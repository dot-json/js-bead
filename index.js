const mainwrapper = document.querySelector("#mainwrapper");
const title = document.querySelector("#title");
const label = document.querySelector("#label");
const gamearea = document.querySelector("#gamearea");
const controls = document.querySelector("#controls");

const givenTiles = {
  easy: [
    { id: 3, val: 1 },
    { id: 8, val: 0 },
    { id: 12, val: 2 },
    { id: 21, val: -1 },
    { id: 24, val: -1 },
    { id: 27, val: -1 },
    { id: 36, val: -1 },
    { id: 40, val: 2 },
    { id: 45, val: 3 },
  ],
  hard: [
    { id: 2, val: 0 },
    { id: 4, val: -1 },
    { id: 14, val: -1 },
    { id: 16, val: -1 },
    { id: 18, val: 3 },
    { id: 20, val: -1 },
    { id: 24, val: 1 },
    { id: 28, val: 2 },
    { id: 30, val: -1 },
    { id: 32, val: -1 },
    { id: 34, val: -1 },
    { id: 44, val: -1 },
    { id: 46, val: 2 },
  ],
  expert: [],
};

const runGame = (mode) => {
  title.innerHTML = "Játék folyamatban";
  label.innerHTML = "Világítsd meg az összes zónát!";

  const grid = document.createElement("div");
  grid.classList.add("grid");
  const newgame = document.createElement("button");
  newgame.classList.add("newgame-btn");
  newgame.innerHTML = "&#8635; Új játék";
  switch (mode) {
    case "easy":
      grid.style.setProperty("--grid-rows", 7);
      grid.style.setProperty("--grid-cols", 7);
      for (let i = 0; i < 7 * 7; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        grid.appendChild(tile);
      }
      givenTiles.easy.map((e) => {
        grid.children[e.id].style.backgroundColor = "#c0b5a5";
        if (e.val != -1) {
          grid.children[e.id].innerHTML = e.val;
        }
      });
      gamearea.appendChild(grid);
      break;
    case "hard":
      grid.style.setProperty("--grid-rows", 7);
      grid.style.setProperty("--grid-cols", 7);
      for (let i = 0; i < 7 * 7; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        grid.appendChild(tile);
      }
      givenTiles.hard.map((e) => {
        grid.children[e.id].style.backgroundColor = "#c0b5a5";
        if (e.val != -1) {
          grid.children[e.id].innerHTML = e.val;
        }
      });
      gamearea.appendChild(grid);
      break;
    case "expert":
      grid.style.setProperty("--grid-rows", 10);
      grid.style.setProperty("--grid-cols", 10);
      for (let i = 0; i < 10 * 10; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        grid.appendChild(tile);
      }
      givenTiles.expert.map((e) => {
        grid.children[e.id].style.backgroundColor = "#c0b5a5";
        if (e.val != -1) {
          grid.children[e.id].innerHTML = e.val;
        }
      });
      gamearea.appendChild(grid);
      break;
  }
  const tiles = grid.children;

  gamearea.appendChild(newgame);
  newgame.addEventListener("click", () => {
    setTimeout(() => {
      gamearea.removeChild(grid);
      gamearea.removeChild(newgame);
      renderHome();
    }, "500");
    grid.classList.add("fadeout");
    newgame.classList.add("fadeout");
  });
};

const renderHome = () => {
  title.innerHTML = "Játék indítása";
  label.innerHTML = "Nehézség:";

  let cpanel = document.createElement("div");
  cpanel.classList.add("difficulty-wrapper");
  cpanel.id = "control-buttons";

  let btn1 = document.createElement("button");
  btn1.classList.add("diff-button");
  btn1.dataset.mode = "easy";
  btn1.innerHTML = "Könnyű";

  let btn2 = document.createElement("button");
  btn2.classList.add("diff-button");
  btn2.dataset.mode = "hard";
  btn2.innerHTML = "Nehéz";

  let btn3 = document.createElement("button");
  btn3.classList.add("diff-button");
  btn3.dataset.mode = "expert";
  btn3.innerHTML = "Expert";

  cpanel.appendChild(btn1);
  cpanel.appendChild(btn2);
  cpanel.appendChild(btn3);
  controls.appendChild(cpanel);
  controls.addEventListener("mouseup", handleControls);

  const spritewrapper = document.createElement("div");
  spritewrapper.classList.add("sprite-wrapper");
  spritewrapper.id = "sprite-wrapper";
  const sprite = document.createElement("img");
  sprite.src = "public/castle.png";
  sprite.alt = "castle";
  sprite.classList.add("sprite");
  spritewrapper.appendChild(sprite);
  gamearea.appendChild(spritewrapper);
};

const handleControls = (e) => {
  if (e.target.matches("button")) {
    const panel = document.querySelector("#control-buttons");
    const sprite = document.querySelector("#sprite-wrapper");
    setTimeout(() => {
      controls.removeChild(panel);
      gamearea.removeChild(sprite);
      runGame(e.target.dataset.mode);
    }, "500");
    panel.classList.add("fadeout");
    sprite.classList.add("fadeout");
    controls.removeEventListener("mouseup", handleControls);
  }
};

controls.addEventListener("mouseup", handleControls);
