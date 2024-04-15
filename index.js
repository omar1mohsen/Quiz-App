// Load the quiz data from a JSON file
fetch('quiz-data.json')
  .then(response => response.json())
  .then(initQuiz)
  .catch(error => {
    console.error('Error loading quiz data:', error);
  });

class QuizManager {
  constructor(quizData) {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.timer = null;
    this.quizData = quizData;
    this.domElements = {
      startButton: document.getElementById('start-btn'),
      questionContainer: document.getElementById('question-container'),
      questionElement: document.getElementById('question'),
      answerButtonsElement: document.getElementById('answer-buttons'),
      counterElement: document.getElementById('counter'),
      timerElement: document.querySelector('.counter-progress'),
      resultModal: document.getElementById('result-modal'),
      finalScoreElement: document.getElementById('final-score'),
      repeatButton: document.getElementById('repeat-btn'),
      closeButton: document.getElementById('close-btn'),
    };
    this.bindEventListeners();
  }

  bindEventListeners() {
    this.domElements.startButton.addEventListener('click', this.startQuiz.bind(this));
    this.domElements.repeatButton.addEventListener('click', this.startQuiz.bind(this));
    this.domElements.closeButton.addEventListener('click', this.closeQuiz.bind(this));
  }

  startQuiz = () => {
    this.domElements.startButton.classList.add('hide');
    this.domElements.questionContainer.classList.remove('hide');
    this.domElements.resultModal.classList.add('hide');
    this.domElements.resultModal.classList.remove('show');
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showQuestion(this.quizData.questions[this.currentQuestionIndex]);
    this.startTimer();
  };

  showQuestion = (question) => {
    this.domElements.questionElement.textContent = question.question;
    this.domElements.answerButtonsElement.innerHTML = '';
    question.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('btn');
      button.addEventListener('click', () => this.selectAnswer(answer.correct));
      this.domElements.answerButtonsElement.appendChild(button);
    });
    this.domElements.counterElement.textContent = `${this.currentQuestionIndex + 1}/${this.quizData.questions.length}`;
  };

  selectAnswer = (correct) => {
    clearInterval(this.timer);
    if (correct) {
      this.score++;
    } else {
      this.showResult(false);
      return;
    }
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.quizData.questions.length) {
      this.showQuestion(this.quizData.questions[this.currentQuestionIndex]);
      this.startTimer();
    } else {
      this.showResult(true);
    }
  };

  startTimer = () => {
    let timeLeft = 100;
    this.domElements.timerElement.style.width = '100%';
    this.timer = setInterval(() => {
      timeLeft -= 0.33333; 
      this.domElements.timerElement.style.width = `${timeLeft}%`;
      if (timeLeft <= 0) {
        clearInterval(this.timer);
        this.showResult(false);
      }
    }, 100);
  };

  showResult = (quizCompleted) => {
    this.domElements.questionContainer.classList.add('hide');
    this.domElements.resultModal.classList.remove('hide');
    this.domElements.resultModal.classList.add('show');
    this.domElements.finalScoreElement.textContent = this.score;
    this.domElements.resultModal.querySelector('h2').textContent = quizCompleted
      ? `Congratulations`
      : 'Game Over';
  };

  closeQuiz = () => {
    this.domElements.resultModal.classList.add('hide');
    this.domElements.resultModal.classList.remove('show');
    this.domElements.startButton.classList.remove('hide');
    this.domElements.questionContainer.classList.add('hide');
    this.currentQuestionIndex = 0;
    this.score = 0;
  };
}

function initQuiz(quizData) {
  new QuizManager(quizData);
}