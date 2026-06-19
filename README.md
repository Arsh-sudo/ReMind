# 🧠 ReMind

<div align="center">
  <p><strong>AI Companion for Dementia Care | Powered by Large Language Models</strong></p>
  <p>Elevating emotional well-being and independence for people with dementia and their caregivers</p>
  <br>
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=yellow" alt="Python Version">
  <img src="https://img.shields.io/badge/OpenAI-GPT-4-412941.svg?style=for-the-badge&logo=openai&logoColor=white" alt="GPT-4 Powered">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License">
  <br><br>
</div>

---

## 🌟 Overview

**ReMind** represents a groundbreaking advancement in AI-assisted dementia care. Built on cutting-edge Large Language Model (LLM) technology, our prototype delivers adaptive conversational support that improves the emotional well-being, independence, and quality of life for people with dementia and their caregivers.

> *"Large Language Models such as ChatGPT by OpenAI have made it plausible to tackle problems surrounding dementia patients and their caregivers."*

### 🎯 Mission

ReMind is geared to improve emotional well-being and independence by:

| # | Capability | Description |
|---|------------|-------------|
| 🗣️ | **Adaptive Conversations** | Initiates engaging conversations that create a positive emotional atmosphere |
| 📝 | **Memory Assistance** | Helps remember crucial information like names of loved ones, important dates, and personal history |
| 📊 | **Caregiver Feedback** | Provides actionable insights to caregivers about their interactions with the patient |
| 💭 | **Emotion Intelligence** | Real-time emotional state awareness for both patient and caregiver |

---

## ✨ Key Features

### 🎭 Emotional Intelligence Engine

ReMind extracts and analyzes emotions expressed in conversations using two core psychological dimensions:
┌─────────────────────────────────────────────────────┐
│ EMOTIONAL ANALYSIS MATRIX │
├─────────────────────────────────────────────────────┤
│ - Arousal: Energy level of the emotion │
│ - Valence: Positive/negative quality of emotion │
└─────────────────────────────────────────────────────┘

text

The AI companion is aware of the **current emotional state** of both the patient and caregiver, enabling differential responses and adaptive behavior.

### 📚 Personal History Management

- **Subjective History Database**: GPT-4 analyzes and maintains the patient's personal history
- **Patient-Only Access**: History database is accessible exclusively to the patient for privacy
- **End-to-End Integration**: Seamless personal history management throughout conversations

### 🎤 Multi-Modal Input Support

- **Direct Speech Input**: Natural voice interaction for enhanced accessibility
- **Real-Time Processing**: Instant conversation analysis and response generation
- **Contextual Awareness**: Maintains conversation context across multiple interactions

---

## 🏗️ Architecture
┌────────────────────────────────────────────────────────────────┐
│ ReMind Architecture │
├────────────────────────────────────────────────────────────────┤
│ │
│ ┌──────────┐ ┌──────────┐ ┌────────────────────────┐ │
│ │ Speech │ → │ OpenAI │ → │ Emotion Analysis │ │
│ │ Input │ │ GPT-4 │ │ (Arousal + Valence) │ │
│ └──────────┘ └──────────┘ └────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Personal History Database │ │
│ │ (Patient-exclusive access, GPT-4 maintained) │ │
│ └────────────────────────────────────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌──────────┐ ┌──────────┐ ┌────────────────────────┐ │
│ │ Adaptive │ ← │ Emotional │ ← │ Conversation │ │
│ │ Response │ │ State │ │ Analysis │ │
│ └──────────┘ └──────────┘ └────────────────────────┘ │
│ ▲ │
│ │ │
│ ┌──────────────┐ │
│ │ Caregiver │ │
│ │ Feedback │ │
│ └──────────────┘ │
│ │
└────────────────────────────────────────────────────────────────┘

text

---

## 🚀 Technology Stack

| Component | Technology |
|-----------|------------|
| **Core AI** | OpenAI GPT-4 |
| **Language Model** | ChatGPT (OpenAI) |
| **Implementation** | Python |
| **Emotion Analysis** | Arousal & Valence Framework |
| **Database** | Personal History Database (Patient-secure) |
| **Input** | Direct Speech Processing |

---

## 📦 Installation

### Prerequisites

- Python 3.8 or higher
- OpenAI API key with GPT-4 access
- npm (for dependencies)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Arsh-sudo/ReMind.git
cd ReMind

# 2. Install dependencies
npm install

# 3. Configure OpenAI API key
export OPENAI_API_KEY="your-api-key_here"

# 4. Start the development server
npm run dev
```

---

## 🎮 Usage

### Starting a Conversation

```python
from remind import ReMindAI

# Initialize ReMind AI companion
remind = ReMindAI(
    api_key="your-openai-key",
    model="gpt-4"
)

# Start adaptive conversation with patient
response = remind.converse(
    user_input="Hello, who is my daughter?",
    user_type="patient"
)

print(response)
```

### Emotion Analysis

```python
# Analyze emotion in conversation
emotion_data = remind.analyze_emotion(
    sentence="I feel happy today seeing my family"
)

print(f"Arousal: {emotion_data.arousal}")  # Energy level
print(f"Valence: {emotion_data.valence}")   # Positive/negative quality
```

### Caregiver Feedback

```python
# Get feedback for caregiver
feedback = remind.get_caregiver_feedback(
    conversation_history=conversation,
    patient_emotional_state=emotion_data
)

print(feedback.insights)
```

---

## 📊 Demo & Prototype

A **working prototype in Python using OpenAI** is available for testing. The prototype demonstrates:

- ✅ End-to-end working conversation flow
- ✅ Direct speech input processing
- ✅ Personal history management
- ✅ Real-time emotion evaluation
- ✅ Adaptive response generation
- ✅ Caregiver feedback system

---

## 🔒 Privacy & Security

ReMind prioritizes patient privacy with:

- **Exclusive Patient Access**: History database accessible only to the patient
- **Local Data Handling**: Personal information stored securely
- **Encrypted Communication**: All conversations encrypted end-to-end
- **No External Sharing**: Patient data never shared with third parties

---

## 🤝 Contributing

We welcome contributions to make ReMind even better!

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make your changes** and commit: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/my-feature`
5. **Create a Pull Request**

### Development Guidelines

- Follow Python best practices
- Maintain code documentation
- Test all changes thoroughly
- Ensure privacy features remain intact

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

ReMind is built on the foundation of advances in Large Language Models:

- **OpenAI** for GPT-4 and ChatGPT technology
- **LLM Research Community** for advancing AI companion capabilities
- **Dementia Care Research** for understanding patient needs

---

## 📞 Contact

- **GitHub**: [@Arsh-sudo](https://github.com/Arsh-sudo)
- **Repository**: [github.com/Arsh-sudo/ReMind](https://github.com/Arsh-sudo/ReMind)
- **Issues**: [GitHub Issues](https://github.com/Arsh-sudo/ReMind/issues)

---

## 🌈 Impact

> *"ReMind represents a significant step forward in AI-assisted dementia care, leveraging the power of Large Language Models to create meaningful, adaptive conversations that improve quality of life."* [1]

### Expected Outcomes

| Stakeholder | Benefit |
|-------------|---------|
| **Patients** | Enhanced emotional well-being, improved independence, better memory recall |
| **Caregivers** | Actionable feedback, reduced stress, improved interaction quality |
| **Healthcare** | Insightful reports, condition monitoring, cost-effective care support |

---

<div align="center">

**Built with ❤️ for better dementia care**

Follow the project for updates and contribute to the future of AI-assisted care

</div>

---

<p align="center">
  <a href="#top">↑ Back to Top</a>
</p>
