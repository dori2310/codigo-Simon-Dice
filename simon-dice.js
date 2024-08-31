const round = document.getElementById("round");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");
const simonButtons = document.getElementsByClassName("square");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const gameOverScreen = document.getElementById("gameOver");
const playAgainButton = document.getElementById("playAgain");
const finalScoreDisplay = document.getElementById("finalScore");

class Simon {
  constructor(simonButtons, startButton, resetButton, round, score, highScore) {
    this.round = 0;
    this.userPosition = 0;
    this.totalRounds = Infinity; // Juego infinito
    this.sequence = [];
    this.speed = 1000;
    this.blockedButtons = true;
    this.score = 0;
    this.highScore = 0;
    this.buttons = Array.from(simonButtons);
    this.display = {
      startButton,
      resetButton,
      round,
      score,
      highScore,
    };
    this.errorSound = new Audio("./sonidos/error.wav");
    this.buttonSounds = [
      new Audio("./sonidos/1.mp3"),
      new Audio("./sonidos/2.mp3"),
      new Audio("./sonidos/3.mp3"),
      new Audio("./sonidos/4.mp3"),
    ];
  }

  init() {
    this.display.startButton.onclick = () => this.startGame();
    this.display.resetButton.onclick = () => this.resetGame();
    playAgainButton.onclick = () => this.resetGame();
    this.buttons.forEach((element, i) => {
      element.onclick = () => this.buttonClick(i);
    });
  }

  startGame() {
    this.display.startButton.disabled = true;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence = [];
    this.score = 0;
    this.updateScore();
    this.buttons.forEach((element) => {
      element.classList.remove("winner");
    });
    this.nextRound();
  }

  resetGame() {
    this.display.startButton.disabled = false;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence = [];
    this.score = 0;
    this.updateScore();
    this.buttons.forEach((element) => {
      element.classList.remove("winner");
    });
    gameOverScreen.style.display = "none";
  }

  updateRound(value) {
    this.round = value;
    this.display.round.textContent = `Ronda ${this.round}`;
  }

  nextRound() {
    this.updateRound(this.round + 1);
    this.sequence.push(this.getRandomColor());
    this.playSequence();
  }

  getRandomColor() {
    return Math.floor(Math.random() * 4);
  }

  playSequence() {
    this.blockedButtons = true;
    let sequenceIndex = 0;
    const timer = setInterval(() => {
      this.playSound(this.sequence[sequenceIndex]);
      this.toggleButtonStyle(this.buttons[this.sequence[sequenceIndex]]);
      setTimeout(
        () =>
          this.toggleButtonStyle(this.buttons[this.sequence[sequenceIndex]]),
        this.speed / 2
      );
      sequenceIndex++;
      if (sequenceIndex >= this.sequence.length) {
        clearInterval(timer);
        this.blockedButtons = false;
      }
    }, this.speed);
  }

  buttonClick(value) {
    if (!this.blockedButtons) {
      this.playSound(value);
      this.toggleButtonStyle(this.buttons[value]);
      setTimeout(() => this.toggleButtonStyle(this.buttons[value]), 200);
      this.validateChosenColor(value);
    }
  }

  validateChosenColor(value) {
    if (this.sequence[this.userPosition] === value) {
      if (this.round === this.userPosition + 1) {
        this.updateScore();
        this.userPosition = 0;
        this.speed = Math.max(this.speed * 0.98, 200);
        this.nextRound();
      } else {
        this.userPosition++;
      }
    } else {
      this.gameOver();
    }
  }

  toggleButtonStyle(button) {
    button.classList.toggle("active");
  }

  gameOver() {
    this.errorSound.play();
    this.updateHighScore();
    this.display.startButton.disabled = false;
    this.blockedButtons = true;
    finalScoreDisplay.textContent = `Puntuación final: ${this.score}`;
    gameOverScreen.style.display = "flex";
  }

  updateScore() {
    this.score += 10;
    this.display.score.textContent = `Puntuación: ${this.score}`;
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.display.highScore.textContent = `Mejor Puntuación: ${this.highScore}`;
    }
  }

  playSound(index) {
    this.buttonSounds[index].play();
  }
}

const simon = new Simon(
  simonButtons,
  startButton,
  resetButton,
  round,
  score,
  highScore
);
simon.init();
