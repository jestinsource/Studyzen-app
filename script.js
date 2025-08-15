// StudyZen - Complete JavaScript File

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const timerDisplay = document.getElementById('timer-display');
const stopwatchDisplay = document.getElementById('stopwatch-display');
const flashcardContainer = document.getElementById('flashcard-container');
const pdfUpload = document.getElementById('pdf-upload');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfContent = document.getElementById('pdf-content');
const landscapeOverlay = document.getElementById('landscape-overlay');
const fullscreenTimer = document.getElementById('fullscreen-timer');
const examContent = document.getElementById('exam-content');
const examSelection = document.getElementById('exam-selection');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// App State
let currentTheme = 'light';
let timerInterval;
let timerSeconds = 1500;
let stopwatchInterval;
let stopwatchSeconds = 0;
let stopwatchRunning = false;
let pdfTextContent = '';
let currentQuestionIndex = 0;
let questions = [];

// Initialize the app
function init() {
  generateCalendar();
  setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Tab navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('onclick').match(/'([^']+)'/)[1];
      showTab(tabId);
    });
  });
  
  // PDF upload
  pdfUpload.addEventListener('change', handlePdfUpload);
  
  // Exam PDF upload
  document.getElementById('exam-pdf-upload').addEventListener('change', handleExamPdfUpload);
}

// Theme Management
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  
  const icon = themeToggle.querySelector('i');
  if (currentTheme === 'dark') {
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
  }
}

// Tab Navigation
function showTab(tabId) {
  tabContents.forEach(content => {
    content.classList.remove('active');
  });
  
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`.tab[onclick*="${tabId}"]`).classList.add('active');
}

// Timer Functions
function startTimer(seconds) {
  clearInterval(timerInterval);
  timerSeconds = seconds;
  updateTimerDisplay();
  
  landscapeOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      alert('Timer completed!');
      exitFullscreenTimer();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  timerDisplay.textContent = display;
  fullscreenTimer.textContent = display;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 1500;
  updateTimerDisplay();
  exitFullscreenTimer();
}

function exitFullscreenTimer() {
  clearInterval(timerInterval);
  landscapeOverlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Stopwatch Functions
function startStopwatch() {
  if (!stopwatchRunning) {
    stopwatchInterval = setInterval(() => {
      stopwatchSeconds++;
      updateStopwatchDisplay();
    }, 1000);
    stopwatchRunning = true;
  }
}

function pauseStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchSeconds = 0;
  stopwatchRunning = false;
  updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchSeconds / 3600);
  const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
  const seconds = stopwatchSeconds % 60;
  const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  stopwatchDisplay.textContent = display;
}

// Flashcard Functions
function flipCard(card) {
  card.classList.toggle('flipped');
}

function addFlashcard() {
  const newCard = document.createElement('div');
  newCard.className = 'flashcard';
  newCard.innerHTML = `
    <div class="flashcard-inner">
      <div class="flashcard-front" contenteditable="true">Click to edit question</div>
      <div class="flashcard-back" contenteditable="true">Click to edit answer</div>
    </div>
  `;
  newCard.addEventListener('click', () => flipCard(newCard));
  flashcardContainer.appendChild(newCard);
}

function generateFlashcardsFromPDF() {
  // In a real app, this would use AI to extract key concepts from the PDF
  const simulatedFlashcards = [
    { question: "What is photosynthesis?", answer: "The process by which plants convert light energy into chemical energy" },
    { question: "What is chlorophyll?", answer: "Green pigment in plants that absorbs light" },
    { question: "What are stomata?", answer: "Pores in plant leaves for gas exchange" }
  ];
  
  flashcardContainer.innerHTML = '';
  
  simulatedFlashcards.forEach(card => {
    const newCard = document.createElement('div');
    newCard.className = 'flashcard';
    newCard.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">${card.question}</div>
        <div class="flashcard-back">${card.answer}</div>
      </div>
    `;
    newCard.addEventListener('click', () => flipCard(newCard));
    flashcardContainer.appendChild(newCard);
  });
  
  showTab('flashcards');
  alert('3 flashcards generated from PDF content!');
}

// PDF Functions
function handlePdfUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  pdfContent.innerHTML = '<p>Processing PDF... <i class="fas fa-spinner fa-spin"></i></p>';
  pdfViewer.style.display = 'block';
  document.getElementById('summarize-btn').style.display = 'inline-block';
  document.getElementById('exam-btn').style.display = 'inline-block';
  
  // Simulate PDF processing
  setTimeout(() => {
    pdfTextContent = "Sample PDF Content:\n\n" +
                    "Chapter 1: Introduction to Biology\n\n" +
                    "Key Concepts:\n" +
                    "- Photosynthesis: Process by which plants convert sunlight into energy\n" +
                    "- Mitochondria: Powerhouse of the cell\n" +
                    "- DNA: Genetic material\n\n" +
                    "Important Terms:\n" +
                    "1. Chloroplast: Organelle where photosynthesis occurs\n" +
                    "2. Enzyme: Biological catalyst\n" +
                    "3. Homeostasis: Maintaining stable internal conditions";
    
    document.getElementById('pdf-title').textContent = file.name;
    pdfContent.innerHTML = `
      <div class="pdf-text-content">${pdfTextContent}</div>
    `;
  }, 1500);
}

function readAloud() {
  // In a real app, use the Web Speech API
  alert('This would read the PDF content aloud using text-to-speech');
}

function summarizePDF() {
  // In a real app, use AI summarization
  alert('This would generate a summary of the PDF content');
}

function generateExamFromPDF() {
  // Simulate exam questions from PDF
  questions = [
    {
      question: "What organelle is responsible for photosynthesis?",
      options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
      answer: 1
    },
    {
      question: "What is the powerhouse of the cell?",
      options: ["Chloroplast", "Mitochondria", "Nucleus", "Golgi Apparatus"],
      answer: 1
    }
  ];
  
  examSelection.style.display = 'none';
  examContent.style.display = 'block';
  currentQuestionIndex = 0;
  showQuestion(currentQuestionIndex);
  showTab('exam');
}

// Exam Functions
function handleExamPdfUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Simulate processing exam PDF
  setTimeout(() => {
    questions = [
      {
        question: "What is the basic unit of life?",
        options: ["Cell", "Atom", "Molecule", "Organ"],
        answer: 0
      },
      {
        question: "Which molecule carries genetic information?",
        options: ["Protein", "Lipid", "DNA", "Carbohydrate"],
        answer: 2
      }
    ];
    
    examSelection.style.display = 'none';
    examContent.style.display = 'block';
    currentQuestionIndex = 0;
    showQuestion(currentQuestionIndex);
  }, 1000);
}

function generateExamFromCurrentFlashcards() {
  // In a real app, generate questions from flashcards
  questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      answer: 1
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: 1
    }
  ];
  
  examSelection.style.display = 'none';
  examContent.style.display = 'block';
  currentQuestionIndex = 0;
  showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
  if (index < 0 || index >= questions.length) return;
  
  const question = questions[index];
  questionText.textContent = question.question;
  
  optionsContainer.innerHTML = '';
  question.options.forEach((option, i) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.innerHTML = `
      <input type="radio" name="answer" id="option-${i}">
      <label for="option-${i}">${option}</label>
    `;
    optionsContainer.appendChild(optionDiv);
  });
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else {
    alert('Exam completed!');
  }
}

// Calendar Functions
function generateCalendar() {
  const calendarBody = document.getElementById('calendar-body');
  calendarBody.innerHTML = '';
  
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let day = 1;
  for (let i = 0; i < 6; i++) {
    if (day > daysInMonth) break;
    
    const row = document.createElement('tr');
    
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      
      if (i === 0 && j < firstDay) {
        cell.textContent = '';
      } else if (day > daysInMonth) {
        cell.textContent = '';
      } else {
        cell.textContent = day;
        
        if (day === date.getDate() && month === date.getMonth() && year === date.getFullYear()) {
          cell.classList.add('today');
        }
        
        day++;
      }
      
      row.appendChild(cell);
    }
    
    calendarBody.appendChild(row);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);