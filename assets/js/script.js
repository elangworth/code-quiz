//required elements
const startButton = document.getElementById('start-button');
const quizContainer = document.getElementById('quiz-container');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const individualAnswerButtons = document.getElementsByClassName('answer');
const nextButton = document.getElementById('next-button');
const startingSeconds = document.getElementById('countdown-time');
const rules = document.getElementById('rules');
const submitHighScoresElement = document.getElementById('submit-high-scores-container');
const submitButton = document.getElementById('submit-button');
//const inputEl = document.getElementById('input');
const listEL = document.getElementsByTagName('li');
const finalScore = document.getElementById('final-score');
const initials = document.getElementById('initials');
const seeHighScores = document.getElementById('see-high-scores-container');
const highScores = document.getElementById('high-scores');
const seeHighScoresLinkInHeader = document.getElementById('high-scores-link');
const clearScoresButton = document.getElementById('clear-scores');
//there are 5 questions

let currentQuestionIndex, shuffledQuestions;
const decrementSeconds = 10; //when answer is wrong

startButton.addEventListener('click', startGame);
//runs when the next button is clicked and advances to the next question if there is one
nextButton.addEventListener('click', () => {
  setNextQuestion();
})

//hides start button and displays random question and answers
function startGame() {
  startButton.classList.add('hide');
  rules.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  answerButtonsElement.classList.remove('hide');
  setNextQuestion();
  updateCountdown();
}

//clears the colors from the answers and gets the question
function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
  currentQuestionIndex++;
}
let timeLeft = 60;
document.getElementById('countdown-time').innerHTML = timeLeft;
let timer;


function updateCountdown(){
timer = setInterval (function() {
  if(timeLeft <= 0){
    clearInterval(timer);
    endGame();
    document.getElementById("countdown-time").innerHTML = "0";
  } else {
    document.getElementById("countdown-time").innerHTML = timeLeft;
  }
  timeLeft --;
}, 1000);
}

//displays the question and answers and checks to see if the selected answer was right or wrong
function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('button');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    } else {
      button.dataset.wrong;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
};

//clears the added classes from when the answer was selected
function resetState() {
  clearStatusClass(individualAnswerButtons);
  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

//sets the class for the right and wrong buttons so the colors will change on the buttons and displays the next question button
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  if (!correct) {
    timeLeft -= decrementSeconds;
  }
  //setAllStatusClasses(correct);
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct);
  })
  if (currentQuestionIndex < shuffledQuestions.length) {
    nextButton.classList.remove('hide');
  } else {
    highScores.classList.remove('hide');
    clearInterval(timer);
    endGame();
  }
}



// //loops through the buttons and adds the correct class to the right button
// function setAllStatusClasses(correct) {
//   Array.from(individualAnswerButtons).forEach(button => {
//     setAllStatusClasses(button, correct);
//   });
// }

//first it clears the status classes and then sets them again for the right and wrong answers
function setStatusClass(button, correct) {
  clearStatusClass(button);
  if (correct) {
    button.classList.add('correct');
  } else {
    button.classList.add('wrong');
  }
}

//removes the status classes from the answer buttons
function clearStatusClass(individualAnswerButtons) {
  if (individualAnswerButtons.class === 'correct') {
    individualAnswerButtons.classList.remove('correct');
  } else if (individualAnswerButtons.class === 'wrong') {
    individualAnswerButtons.classList.remove('wrong');
  }
}

function changeTimeLeft(){
  if (timeLeft < 0) {
    timeLeft = 0;
  }
}

function endGame(){
  submitHighScoresElement.classList.remove('hide');
  quizContainer.classList.add('hide');
  clearInterval(timer);
  nextButton.classList.add('hide');
  changeTimeLeft();
  finalScore.innerHTML = timeLeft;
};

let highScoresText = [];

function renderHighScores() {
  let highScoresList = "";
  for (let i = 0; i < highScoresText.length; i++) {
    let highScoresTexts = highScoresText[i];
    let li = document.createElement('li');
    li.textContent = highScoresList;
    //li.appendChild(highScores);
    highScores.appendChild(li);
  }
}

function init() {
  let storedHighScores = JSON.parse(localStorage.getItem('highScoresText'));
  if (storedHighScores !== null) {
    highScoresText = storedHighScores;
  }
    renderHighScores();
    storeHighScores();
  }

function storeHighScores() {
  localStorage.setItem(highScoresText, JSON.stringify(highScoresText));
}

submitButton.addEventListener('click', function(e) {
  submitHighScoresElement.classList.remove('hide');
  document.getElementById('final-score').innerHTML = timeLeft;
  e.preventDefault();
  let initialsInput = document.querySelector('#initials').value;
  if (initialsInput === ''){
    window.alert('Error: Initials cannot be blank!');
  }
  highScoresText.push(initialsInput);
  initialsInput.value = '';
  displayHighScores();
  window.localStorage.setItem('initials', initials);
  storeHighScores();
  renderHighScores();
});

function displayHighScores() {
  seeHighScores.classList.remove('hide');
  submitHighScoresElement.classList.add('hide');
  initials.textContent = localStorage.getItem('initials');
  renderHighScores();
  storeHighScores();
  startButton.classList.remove('hide');
  startButton.innerHTML = "Play Again";
}

function limitCharacters() {
  let maxCharacters = 2;
  if(liEL.value.length > maxCharacters){
      liEL.value = liEl.value.subtr(0, maxCharacters);
    }
};

function clearScores(){
  highScoresText = [];
}

clearScoresButton.addEventListener('click', clearScores);

seeHighScoresLinkInHeader.addEventListener('click', displayHighScores);

init();