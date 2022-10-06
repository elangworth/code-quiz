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
const highScoresUL = document.getElementById('high-scores-ul');
const seeHighScoresLinkInHeader = document.getElementById('high-scores-link');
const clearScoresButton = document.getElementById('clear-scores');
const playAgainButton = document.getElementById('play-again');


let currentQuestionIndex, shuffledQuestions;
const decrementSeconds = 10; //when answer is wrong
//game starts
startButton.addEventListener('click', startGame);

//runs when the next button is clicked and advances to the next question if there is one
nextButton.addEventListener('click', () => {
  setNextQuestion();
})

//hides start button and displays random question and answers
function startGame() {
  startingSeconds.innerHTML = 60;
  timeLeft = 60;
  startButton.classList.add('hide');
  rules.classList.add('hide');
  seeHighScores.classList.add('hide');
  quizContainer.classList.remove('hide');
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

//Countdown timer
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
    highScoresUL.classList.remove('hide');
    clearInterval(timer);
    endGame();
  }
}

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

//makes sure the time left cannot be less than zero (if time was running out when a wrong answer was selected for example)
function changeTimeLeft(){
  if (timeLeft < 0) {
    timeLeft = 0;
  }
}

//game ends and all done container appears to submit the score
function endGame(){
  submitHighScoresElement.classList.remove('hide');
  quizContainer.classList.add('hide');
  clearInterval(timer);
  nextButton.classList.add('hide');
  changeTimeLeft();
  finalScore.innerHTML = timeLeft;
};

//this area deals with getting and setting the highscores and displaying them
let highScores = {};

//creates the list elements to show the individual scores
function renderHighScores() {
  highScoresUL.innerHTML= '';//resets the UL to be clear if clear scores is clicked
  const initials = Object.keys(highScores);
  for (let i = 0; i < initials.length; i++) {
    let initial = initials[i];
    li = document.createElement('li');  
    li.textContent = initial;
    highScoresUL.appendChild(li);
    span = document.createElement('span');
    span.textContent = highScores[initial];
    li.appendChild(span);
  }
}
//sets up the page upon loading
function init() {
  const value = localStorage.getItem('highScores');
  if (value !== null) {
    highScores = JSON.parse(value);
  } else {
      highScores = {}
  }
}
//sets the highscores and stores them
function storeHighScores() {
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

//moves on to the highscores part of the page
submitButton.addEventListener('click', function(e) {
  submitHighScoresElement.classList.remove('hide');
  document.getElementById('final-score').innerHTML = timeLeft;
  e.preventDefault();
  let initialsInput = document.querySelector('#initials').value.trim();
  if (initialsInput === ''){
    alert("This field is required");
    return;
  }
  highScores[initialsInput] = timeLeft;
  localStorage.setItem('highScores', JSON.stringify(highScores));
  initialsInput.value = '';
  displayHighScores();
  storeHighScores();
});

// resets the highscores page to be blank
function clearScores(){
  startingSeconds.innerHTML = 60;
  window.localStorage.clear();
  highScores = {};
  for (let i = 0; i < listEL.length; i++) {
    listEL[i].classList.add('hide');
  }
  while (listEL.firstChild) {
    listEL.removeChild(listEL.firstChild);
  }
  
}

clearScoresButton.addEventListener('click', clearScores);

//displays the high scores when the user inputs their initials
function displayHighScores() {
  seeHighScores.classList.remove('hide');
  quizContainer.classList.add('hide');
  submitHighScoresElement.classList.add('hide');
  renderHighScores();
}
 
playAgainButton.addEventListener('click', startGame);

seeHighScoresLinkInHeader.addEventListener('click', displayHighScores);

init();