import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, getDocs, limit, doc, updateDoc } from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  firestoreDatabaseId: (import.meta as any).env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId
};

if (!firebaseConfig.apiKey && (import.meta as any).env.MODE !== 'development') {
  console.warn('Firebase API Key is missing. Ensure VITE_FIREBASE_API_KEY is set in your environment.');
}

const app = initializeApp(firebaseConfig);
// @ts-ignore - The property firestoreDatabaseId is added by AI Studio setup
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const saveChatHistory = async (
  uid: string,
  chatId: string | null,
  queryText: string,
  messages: { query: string, report: string }[],
  timestamp: number
): Promise<string | null> => {
  const path = `users/${uid}/chats`;
  try {
    if (chatId) {
      const docRef = doc(db, 'users', uid, 'chats', chatId);
      await updateDoc(docRef, {
        messages,
        timestamp
      });
      return chatId;
    } else {
      const userChatsRef = collection(db, 'users', uid, 'chats');
      const newDoc = await addDoc(userChatsRef, {
        query: queryText,
        messages,
        timestamp
      });
      return newDoc.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return null;
  }
};

export const loadChatHistory = async (uid: string) => {
  const path = `users/${uid}/chats`;
  try {
    const userChatsRef = collection(db, 'users', uid, 'chats');
    const q = query(userChatsRef, orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      let messages = data.messages || [];
      if (messages.length === 0 && data.query && data.report) {
        messages = [{ query: data.query, report: data.report }];
      }
      return { 
         id: doc.id,
         query: data.query, 
         messages,
         timestamp: data.timestamp 
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};
