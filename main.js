// https://opentdb.com/api.php?amount=10

const question = document.getElementById("question");
const options = document.querySelector(".quiz-choices");
const _correctScore = document.getElementById("score");
const _totalQuestion = document.getElementById("total-amount");
const checkBtn = document.getElementById("check-answer");
const playAgainBtn = document.getElementById("play-again");
const result = document.getElementById("result");

let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

eventListeners = () => {
  checkBtn.addEventListener("click", checkAnswer);
  playAgainBtn.addEventListener("click", restartQuiz);
};

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListeners();

  result.innerHTML = "";
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  checkBtn.disabled = false;
  const APIUrl = "https://opentdb.com/api.php?amount=1";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  console.log(data);
  showQuestion(data.results[0]);
}

showQuestion = (data) => {
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span`;
  // options.innerHTML = `${optionsList.map(option, index) => `
  //     <li> ${index + 1}. <span> ${option} </span> </li>
  //     `)}
  //   `;
  options.innerHTML = ` ${optionsList
    .map(
      (option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `
    )
    .join("")}
    `;

  selectOption();
};

selectOption = () =>
  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (options.querySelector(".selected-choice")) {
        const activeOption = options.querySelector(".selected-choice");
        activeOption.classList.remove("selected-choice");
      }
      option.classList.add("selected-choice");
    });
  });

checkAnswer = () => {
  checkBtn.disabled = true;
  if (options.querySelector(".selected-choice")) {
    let selectedAnswer = options.querySelector(
      ".selected-choice span"
    ).textContent;
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      correctScore++;
      result.innerHTML = `<p><i class = "fas fa-check"></i> Correct Answer!</p>`;
    } else {
      result.innerHTML = `<p><i class = "fas fa-times"></i> Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    checkCount();
  }
};

HTMLDecode = (textString) => {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
};

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
  } else {
    setTimeout(function () {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  playAgainBtn.style.display = "none";
  checkBtn.style.display = "block";
  checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
