class Button {
  constructor(label, color) {
    this.label = label;
    this.color = color;
    this.element = this.makeElement();
  }

  makeElement() {
    const button = document.createElement("button");
    button.innerHTML = this.label;
    button.style.backgroundColor = this.color;
    button.style.height = "5em";
    button.style.width = "10em";
    button.style.border = "1px solid black";
    return button;
  }
}

// gpt
function generateRandomColor() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return `rgb(${red}, ${green}, ${blue})`;
}

async function run() {
  const numButtons = document.getElementById("numButtons").value;
  console.log("buttons:", numButtons);
  if (numButtons < 3 || numButtons > 7) {
    alert("Please enter a valid number");
    return;
  }
  // hide go button
  // create some buttons
  const buttons = createButtons(numButtons);
  setTimeout(() => {
    displayButtonsAsRow(buttons);
  }, 1000 * buttons.length);
  await startGame(buttons);
  playGame(buttons);
}

function reset() {
  console.log("reset");
  document.getElementById("buttonsContainer").innerHTML = "";
  document.getElementById("go").style.display = "block";
}

async function startGame(buttons) {
  document.getElementById("go").style.display = "none";
  displayButtonsAsRow(buttons);
  await new Promise((resolve) => setTimeout(resolve, 1000 * buttons.length));
  for (let i = 0; i < buttons.length; i++) {
    scatterButtons(buttons);
    displayButtons(buttons);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

function scatterButtons(buttons) {
  const windowWidth = window.innerWidth - 250;
  const windowHeight = window.innerHeight - 250;
  for (const button of buttons) {
    const x = Math.floor(Math.random() * windowWidth);
    const y = Math.floor(Math.random() * windowHeight);
    button.element.style.position = "absolute";
    button.element.style.left = `${x}px`;
    button.element.style.top = `${y}px`;
  }
}

function createButtons(numButtons) {
  const buttons = [];
  for (let i = 0; i < numButtons; i++) {
    const button = new Button(i + 1, generateRandomColor());
    buttons.push(button);
  }
  return buttons;
}

function displayButtons(buttons) {
  for (const button of buttons) {
    document.getElementById("buttonsContainer").appendChild(button.element);
  }
}

function displayButtonsAsRow(buttons) {
  const buttonsContainer = document.getElementById("buttonsContainer");
  const buttonsContainerPosition = buttonsContainer.getBoundingClientRect();
  let left = buttonsContainerPosition.left;
  for (const button of buttons) {
    button.element.style.position = "absolute";
    button.element.style.left = `${left}px`;
    button.element.style.top = `${buttonsContainerPosition.top + 100}px`;
    left += 250;
  }
  displayButtons(buttons);
}

function playGame(buttons) {
  for (const button of buttons) {
    button.element.innerHTML = "";
  }

  for (const button of buttons) {
    button.element.addEventListener("click", () => handleClick(buttons));
  }
}

function handleClick(buttons) {
  const userOrder = buttons.map((button) => button.label);
  const correctOrder = [...userOrder].sort((a, b) => a - b);
  console.log("userOrder:", userOrder);
  console.log("correctOrder:", correctOrder);

  if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
    alert("Congratulations! You got the correct order!");
  } else {
    for (const button of buttons) {
      button.element.innerHTML = button.label;
    }
    alert("Wrong order. Try again!");
  }
  reset();
}
