# ReMind 🧠

> An AI companion using LLMs to help improve the quality of life for people with dementia and their caregivers.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-4-red.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🌟 Overview

ReMind is an end-to-end working prototype that leverages **GPT-4** to provide adaptive conversations, personal history management, and emotion evaluation for dementia patients. The AI companion is aware of the emotional state of both the patient and caregiver, responding differentially to each while adapting to their needs.

## 🎯 What It Does

ReMind improves emotional well-being and independence by:

1. **Initiating adaptive conversations** with the patient and creating a positive emotional atmosphere
2. **Helping remember important information** like names of loved ones
3. **Providing feedback to caregivers** on their interactions with the patient

## 💡 Inspiration

Dementia is a leading neurodegenerative disorder affecting **over 55 million people globally**. Fading memory comes as a great personal loss and frustration for those affected AND their caregivers. Large Language Models (LLMs) like ChatGPT by OpenAI have made it plausible to tackle problems surrounding dementia patients and their caregivers.

## 🛠️ How We Built It

- **GPT-4 Integration**: Analyzes conversations and maintains the patient's subjective history database (accessible only to the patient)
- **Emotion Extraction**: Extracts emotions using **"Arousal"** and **"Valence"** of each sentence
- **Adaptive Responses**: AI companion responds differentially to patient and caregiver based on emotional state
- **Speech Pipeline**: Integrated speech-to-text and text-to-speech for ease of interaction

```python
# Example usage
from remind import AICompanion

companion = AICompanion(model="gpt-4")
companion.start_conversation()
```

## 📦 Built With

| Technology | Purpose |
|------------|---------|
| [GPT-4](https://openai.com/gpt-4) | Core LLM for conversations |
| [OpenAI](https://openai.com/) | API integration |
| [Python](https://python.org) | Main programming language |
| [Jupyter](https://jupyter.org) | Development environment |
| [NumPy](https://numpy.org) | Numerical computations |
| [Pandas](https://pandas.pydata.org) | Data manipulation |
| [SpeechRecognition](https://pypi.org/project/speechrecognition/) | Speech-to-text pipeline |

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Arsh-sudo/ReMind.git

# Navigate to the project directory
cd ReMind

# Install dependencies
pip install -r requirements.txt
```

## 📋 Requirements

- Python 3.8+
- OpenAI API key
- NumPy
- Pandas
- SpeechRecognition

## 🔧 Configuration

Create a `.env` file with your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

## 🎮 Usage

```bash
# Start the AI companion
python main.py

# Or use in Jupyter notebook
jupyter notebook remind_demo.ipynb
```

## 🏆 Accomplishments

- ✅ End-to-end working prototype
- ✅ Direct speech input support
- ✅ Personal history management
- ✅ Emotion evaluation in ongoing conversations

## 🚧 Challenges We Ran Into

- Implementing a history database to persist information across GPT-4 sessions
- Programmatically integrating speech-to-text and text-to-speech pipelines with GPT-4

## 🚀 What's Next for ReMind

- **Speaker Identification**: Create history databases specific for each speaker for personalized interaction
- **Flexible Prompt Strategies**: Develop better input prompt strategies for more conversationally natural responses
- **Enhanced Emotion Detection**: Improve arousal and valence extraction accuracy

## 📄 Project Structure
ReMind/
├── main.py # Main entry point
├── remind_demo.ipynb # Jupyter notebook demo
├── requirements.txt # Python dependencies
├── .env # Environment variables (API keys)
├── README.md # This file
└── utils/
├── emotion_analysis.py
├── speech_pipeline.py
└── history_database.py

text

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**ARSH SHARMA**  
📍 Indore, Madhya Pradesh, India  
🔗 [GitHub](https://github.com/Arsh-sudo)

## 🙏 Acknowledgments

- OpenAI for GPT-4
- Dementia patients and caregivers who inspired this project
- 55 million people globally affected by dementia

---

<div align="center">

**Made with ❤️ for improving dementia care**

⭐ Star this repo if you find it helpful!

</div>
