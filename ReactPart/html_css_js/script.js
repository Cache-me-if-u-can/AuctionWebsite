let questions = [

  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"], answer: "Leonardo da Vinci" },
  { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Great White Shark", "Giraffe"], answer: "Blue Whale" },
  { question: "What is the chemical symbol for water?", options: ["O2", "CO2", "H2O", "N2"], answer: "H2O" },
  { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Cell membrane"], answer: "Mitochondria" },
  { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Jane Austen", "J.K. Rowling"], answer: "Harper Lee" },
  { question: "What is the boiling point of water?", options: ["90°C", "100°C", "80°C", "120°C"], answer: "100°C" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "What is the smallest planet in our solar system?", options: ["Earth", "Venus", "Mercury", "Mars"], answer: "Mercury" },


  { question: "What is the largest organ in the human body?", options: ["Liver", "Skin", "Brain", "Heart"], answer: "Skin" },
  { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "Thailand", "Japan", "South Korea"], answer: "Japan" },
  { question: "Which vitamin is produced when a person is exposed to sunlight?", options: ["Vitamin C", "Vitamin A", "Vitamin B12", "Vitamin D"], answer: "Vitamin D" },
  { question: "Who is known as the father of computers?", options: ["Charles Babbage", "Alan Turing", "Thomas Edison", "Alexander Graham Bell"], answer: "Charles Babbage" },
  { question: "In which country is the Great Barrier Reef located?", options: ["USA", "Australia", "Mexico", "Brazil"], answer: "Australia" },
  { question: "What is the square root of 144?", options: ["10", "11", "12", "13"], answer: "12" },
  { question: "Which planet has the most moons?", options: ["Earth", "Jupiter", "Mars", "Saturn"], answer: "Jupiter" },
  { question: "What is the hardest natural substance on Earth?", options: ["Iron", "Gold", "Diamond", "Quartz"], answer: "Diamond" },
  { question: "Which ocean is the Bermuda Triangle located in?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], answer: "Atlantic Ocean" },
  { question: "Which element has the chemical symbol 'Fe'?", options: ["Iron", "Gold", "Silver", "Fluorine"], answer: "Iron" },


  { question: "What is the rarest blood type?", options: ["A", "O", "B", "AB-"], answer: "AB-" },
  { question: "Who developed the theory of general relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], answer: "Albert Einstein" },
  { question: "Which planet has a day longer than its year?", options: ["Venus", "Mars", "Mercury", "Jupiter"], answer: "Venus" },
  { question: "Which Nobel Prize category was created by the inventor of dynamite?", options: ["Peace", "Physics", "Chemistry", "Literature"], answer: "Peace" },
  { question: "What is the tallest mountain in our solar system?", options: ["Mount Everest", "Olympus Mons", "K2", "Mauna Kea"], answer: "Olympus Mons" },
  { question: "What is the primary element in the Sun?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon"], answer: "Hydrogen" },
  { question: "Who invented the World Wide Web?", options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Alan Turing"], answer: "Tim Berners-Lee" },
  { question: "Which planet is known as Earth's twin?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Venus" },
  { question: "What is the longest bone in the human body?", options: ["Femur", "Humerus", "Radius", "Tibia"], answer: "Femur" },
  { question: "What does DNA stand for?", options: ["Deoxyribonucleic Acid", "Deoxyribose Acid", "Dioxygenic Acid", "Dinucleic Acid"], answer: "Deoxyribonucleic Acid" },
];


let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const totalTime = 15;

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question-text').innerText = question.question;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option;
    button.onclick = () => selectAnswer(option);
    optionsContainer.appendChild(button);
  });

  updateProgressBar();
  resetTimer();
}

function selectAnswer(selectedOption) {
  clearInterval(timerInterval);
  const question = questions[currentQuestionIndex];
  if (selectedOption === question.answer) {
    score++;
  }
  moveToNextQuestion();
}

function moveToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showResult();
  }
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
}

function resetTimer() {
  let timeLeft = totalTime;
  document.getElementById('time-left').innerText = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      moveToNextQuestion();
    }
  }, 1000);
}

function showResult() {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('next-button').style.display = 'none';

  const resultContainer = document.getElementById('result-container');
  resultContainer.innerText = `Your Score: ${score} / ${questions.length}`;

  const percentage = (score / questions.length) * 100;
  if (percentage >= 80) {
    resultContainer.innerHTML += '<br>Congratulations! 🎉 Excellent job!';
  } else if (percentage >= 50) {
    resultContainer.innerHTML += '<br>Good effort! Keep practicing!';
  } else {
    resultContainer.innerHTML += '<br>Better luck next time!';
  }

  showConfetti();
}

function showConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDelay = `${Math.random()}s`;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.transform = `scale(${Math.random() * 1.5})`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

function getRandomColor() {
  const colors = ['var(--golden-glow)', 'var(--periwinkle)', 'var(--light-blue)'];
  return colors[Math.floor(Math.random() * colors.length)];
}

displayQuestion();
