const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
let score = 0;

const genres = [
  {
    name: "Film & TV",
    id: 11,
  },
  {
    name: "Music",
    id: 12,
  },

  {
    name: "Games",
    id: 15,
  },
  {
    name: "General Knowledge",
    id: 9,
  },
];

const difficulty = ["easy", "medium", "hard"];

addGenre = (genre) => {
  const column = document.createElement("div");
  column.classList.add("genre-column");
  column.innerHTML = genre.name;
  game.append(column);

  difficulty.forEach((difficulty) => {
    const card = document.createElement("div");
    card.classList.add("card");
    column.append(card);

    if (difficulty === "easy") {
      card.innerHTML = 100;
    }
    if (difficulty === "medium") {
      card.innerHTML = 200;
    }
    if (difficulty === "hard") {
      card.innerHTML = 300;
    }

    fetch(
      `https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${difficulty}&type=boolean`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        card.setAttribute("data-question", data.results[0].question);
        card.setAttribute("data-answer", data.results[0].correct_answer);

        card.setAttribute("data-value", card.getInnerHTML());
      })
      .then(() => card.addEventListener("click", flipCard));
  });
};
genres.forEach((genre) => addGenre(genre));

function flipCard() {
  this.innerHTML = "";
  this.style.fontSize = "1rem";
  const questionDisplay = document.createElement("div");
  const trueButton = document.createElement("button");
  const falseButton = document.createElement("button");
  trueButton.innerHTML = "True";
  falseButton.innerHTML = "False";
  trueButton.classList.add("correct-btn");
  falseButton.classList.add("false-btn");
  trueButton.addEventListener("click", getResult);
  falseButton.addEventListener("click", getResult);
  questionDisplay.innerHTML = this.getAttribute("data-question");
  this.append(questionDisplay, trueButton, falseButton);

  const allCards = Array.from(document.querySelectorAll(".card"));
  allCards.forEach((card) => card.removeEventListener("click", flipCard));
}

function getResult() {
  const allCards = Array.from(document.querySelectorAll(".card"));
  allCards.forEach((card) => card.addEventListener("click", flipCard));

  const cardButton = this.parentElement;
  if (cardButton.getAttribute("data-answer") === this.innerHTML) {
    score = score + Number(cardButton.getAttribute("data-value"));
    scoreDisplay.innerHTML = score;
    cardButton.classList.add("correct");

    setTimeout(() => {
      while (cardButton.firstChild) {
        cardButton.removeChild(cardButton.lastChild);
      }
      cardButton.innerHTML = cardButton.getAttribute("data-value");
    }, 100);
  } else {
    cardButton.classList.add("false");
    setTimeout(() => {
      while (cardButton.firstChild) {
        cardButton.removeChild(cardButton.lastChild);
      }
      cardButton.innerHTML = 0;
    }, 100);
  }
  cardButton.removeEventListener("click", flipCard);
}
