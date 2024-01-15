const buttonHeight = "5em";
const buttonWidth = "10em";
const buttonBorder = "1px solid black";
const buttonMargins = "5em";
const buttonNumID = "numButtons";
const buttonsContainerID = "buttonsContainer";
const outputContainerID = "outputContainer";

class Button {
  constructor(value) {
    this.value = value;
    this.element = this.makeElement();
    this.color = generateRandomColor();
    this.element = this.makeElement();
  }

  makeElement() {
    const button = document.createElement("button");
    button.innerHTML = this.value;
    button.style.backgroundColor = this.color;
    button.style.height = buttonHeight;
    button.style.width = buttonWidth;
    button.style.border = buttonBorder;
    button.style.margin = buttonMargins;
    return button;
  }
}

class MemoryGame {
  constructor() {
    this.numButtons = document.getElementById(buttonNumID).value;
    this.buttonsContainer = document.getElementById(buttonsContainerID);
    this.outputContainer = document.getElementById(outputContainerID);
    this.buttons = [];
    this.userSelectedOrder = [];
    this.scattering = false;
  }

  reset() {
    this.buttonsContainer.innerHTML = "";
    this.outputContainer.innerHTML = "";
    this.buttons = [];
    this.userSelectedOrder = [];
  }

  run() {
    if (!isValidInput(this.numButtons)) {
      alert(badNumber);
      return;
    }
    this.reset();
    this.createButtons();

    setTimeout(() => {
      for (let i = 0; i < this.numButtons; i++) {
        setTimeout(() => {
          this.scattering = true;
          this.scatterButtons();

          if (i === this.numButtons - 1) {
            this.scattering = false;
            this.hideButtonLabels();
            this.makeClickable();
          }
          // gpt found bug with my async code
          // now it will work because each scatter is delayed incrementally
          // since setTimeout is non-blocking, they use to all run at the same time
        }, 2000 * i);
      }
    }, 1000 * this.numButtons);
  }

  scatterButtons() {
    if (this.scattering) {
      const maxButtonWidth = window.innerWidth - 250;
      const maxButtonHeight = window.innerHeight - 250;
      for (const button of this.buttons) {
        const x = Math.floor(Math.random() * maxButtonWidth);
        const y = Math.floor(Math.random() * maxButtonHeight);
        button.element.style.position = "absolute";
        button.element.style.left = `${x}px`;
        button.element.style.top = `${y}px`;
      }
    } else {
      for (let i = 0; i < this.numButtons; i++) {
        buttons[i].element.style.position = "relative";
        buttons[i].element.style.left = "0px";
        buttons[i].element.style.top = "0px";
      }
    }
  }

  hideButtonLabels() {
    for (let i = 0; i < this.numButtons; i++) {
      this.buttons[i].element.innerHTML = "";
    }
  }

  createButtons() {
    for (let i = 0; i < this.numButtons; i++) {
      this.buttons.push(new Button(i + 1));
      this.buttonsContainer.appendChild(this.buttons[i].element);
    }
  }

  makeClickable() {
    for (let i = 0; i < this.numButtons; i++) {
      this.buttons[i].element.addEventListener("click", () => {
        this.handleClick(this.buttons[i]);
      });
    }
  }

  handleClick(button) {
    const buttonClickedValue = button.value;
    if (!this.userSelectedOrder.includes(buttonClickedValue)) {
      this.userSelectedOrder.push(buttonClickedValue);
      button.element.innerHTML = buttonClickedValue;
    }

    if (Number(this.userSelectedOrder.length) === Number(this.numButtons)) {
      if (this.checkOrderCorrect()) {
        const message = document.createElement("p");
        message.textContent = goodMemory;
        this.outputContainer.appendChild(message);
      } else {
        const message = document.createElement("p");
        message.textContent = badMemory;
        this.outputContainer.appendChild(message);
      }
    } else {
      for (let i = 0; i < this.userSelectedOrder.length; i++) {
        if (i + 1 !== Number(this.userSelectedOrder[i])) {
          this.buttons.forEach((button) => {
            button.element.innerHTML = button.value;
          });
          const message = document.createElement("p");
          message.textContent = badMemory;
          this.outputContainer.appendChild(message);
          break;
        }
      }
    }
  }

  checkOrderCorrect() {
    for (let i = 0; i < this.numButtons; i++) {
      if (i + 1 !== Number(this.userSelectedOrder[i])) {
        return false;
      }
    }
    return true;
  }
}

function isValidInput(input) {
  if (input < 3 || input > 7) {
    return false;
  }
  return true;
}

// gpt
// simple function that generates a random color for r g b
// returns a formatted string to be used as a css color
function generateRandomColor() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return `rgb(${red}, ${green}, ${blue})`;
}
