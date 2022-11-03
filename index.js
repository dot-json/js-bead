const mainwrapper = document.querySelector("#mainwrapper");
const title = document.querySelector("#title");
const label = document.querySelector("#label");
const gamearea = document.querySelector("#gamearea");
const controls = document.querySelector("#controls");

const player_name = document.querySelector("#current-player");
const player_button = document.querySelector("#player-btn");
const player_remove_button = document.querySelector("#player-remove-btn");
const player_input = document.querySelector("#profile-input");
const gamelist = document.querySelector("#prev-games");

const all_profiles = [];
let current_profile = "";
let timerObj = null;
let current_time = 0;

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
  expert: [
    { id: 1, val: -1 },
    { id: 15, val: 3 },
    { id: 17, val: 2 },
    { id: 19, val: -1 },
    { id: 21, val: 0 },
    { id: 22, val: -1 },
    { id: 27, val: -1 },
    { id: 34, val: -1 },
    { id: 41, val: 1 },
    { id: 44, val: -1 },
    { id: 45, val: 1 },
    { id: 46, val: -1 },
    { id: 53, val: -1 },
    { id: 54, val: -1 },
    { id: 55, val: -1 },
    { id: 58, val: 3 },
    { id: 65, val: -1 },
    { id: 72, val: 1 },
    { id: 77, val: 0 },
    { id: 78, val: -1 },
    { id: 80, val: 3 },
    { id: 82, val: -1 },
    { id: 84, val: 0 },
    { id: 98, val: 0 },
  ],
};
let bulbs = [];

//kollektiv fadelés funkciók
const fadeinElems = (...elems) => {
  elems.map((e) => {
    e.classList.remove("fadeout");
    e.classList.add("fadein");
  });
};
const fadeoutElems = (...elems) => {
  elems.map((e) => {
    e.classList.remove("fadein");
    e.classList.add("fadeout");
  });
};
//-------------------------

function removeFromObj(arr, value) {
  for (var i = arr.length - 1; i >= 0; --i) {
    if (arr[i].row == value.row && arr[i].col == value.col) {
      arr.splice(i, 1);
    }
  }
}

//check segédek
const getPos = (id, g_size) => {
  return { row: Math.floor(id / g_size), col: id % g_size };
};
const getTile = (pos, size, grid) => {
  return grid[pos.row * size + pos.col];
};
function bulbAtPos(r, c) {
  let state = false;
  bulbs.map((e) => {
    if (e.row == r && e.col == c) {
      state = true;
    }
  });
  return state;
}
//--------------

//raytracing segédek
const checkVUP = (grid_elems, source, g_size) => {
  let state = true;
  for (let i = source.row - 1; i >= 0; i--) {
    const current_tile = getTile(
      { row: i, col: source.col },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall != "true") {
      if (current_tile.dataset.isBulb == "true") {
        state = false;
        break;
      }
    } else {
      break;
    }
  }
  return state;
};
const checkVDOWN = (grid_elems, source, g_size) => {
  let state = true;
  for (let i = source.row + 1; i < g_size; i++) {
    const current_tile = getTile(
      { row: i, col: source.col },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall != "true") {
      if (current_tile.dataset.isBulb == "true") {
        state = false;
        break;
      }
    } else {
      break;
    }
  }
  return state;
};
const checkHLEFT = (grid_elems, source, g_size) => {
  let state = true;
  for (let i = source.col - 1; i >= 0; i--) {
    const current_tile = getTile(
      { row: source.row, col: i },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall != "true") {
      if (current_tile.dataset.isBulb == "true") {
        state = false;
        break;
      }
    } else {
      break;
    }
  }
  return state;
};
const checkHRIGHT = (grid_elems, source, g_size) => {
  let state = true;
  for (let i = source.col + 1; i < g_size; i++) {
    const current_tile = getTile(
      { row: source.row, col: i },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall != "true") {
      if (current_tile.dataset.isBulb == "true") {
        state = false;
        break;
      }
    } else {
      break;
    }
  }
  return state;
};
//------------------------

//kivilágitás - 4 irányban minden mezőt további 4 irányban checkel
const lightUp = (grid_elems, source, g_size) => {
  // MIDDLE ---------------------------------------------------------
  const middle = getTile(source, g_size, grid_elems);
  middle.classList.remove("lightsout");
  middle.classList.add("lightup");
  // ----------------------------------------------------------------
  // VERTICAL DOWN --------------------------------------------------
  let iteration = 0;
  for (let i = source.row + 1; i < g_size; i++) {
    const current_tile = getTile(
      { row: i, col: source.col },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      current_tile.style.animationDelay = `${iteration * 25}ms`;
      current_tile.classList.remove("lightsout");
      current_tile.classList.add("lightup");
      iteration++;
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  // VERTICAL UP ----------------------------------------------------
  iteration = 0;
  for (let i = source.row - 1; i >= 0; i--) {
    const current_tile = getTile(
      { row: i, col: source.col },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      current_tile.style.animationDelay = `${iteration * 25}ms`;
      current_tile.classList.remove("lightsout");
      current_tile.classList.add("lightup");
      iteration++;
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  //HORIZONTAL RIGHT ------------------------------------------------
  iteration = 0;
  for (let i = source.col + 1; i < g_size; i++) {
    const current_tile = getTile(
      { row: source.row, col: i },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      current_tile.style.animationDelay = `${iteration * 25}ms`;
      current_tile.classList.remove("lightsout");
      current_tile.classList.add("lightup");
      iteration++;
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  //HORIZONTAL LEFT -------------------------------------------------
  iteration = 0;
  for (let i = source.col - 1; i >= 0; i--) {
    const current_tile = getTile(
      { row: source.row, col: i },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      current_tile.style.animationDelay = `${iteration * 25}ms`;
      current_tile.classList.remove("lightsout");
      current_tile.classList.add("lightup");
      iteration++;
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
};

//hasonló logikával lekapcsol
const lightsOut = (grid_elems, source, g_size) => {
  // VERTICAL DOWN --------------------------------------------------
  for (let i = source.row + 1; i < g_size; i++) {
    const current_tile = getTile(
      { row: i, col: source.col },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      if (
        current_tile.dataset.isBulb != "true" &&
        checkVDOWN(grid_elems, { row: i, col: source.col }, g_size) &&
        checkVUP(grid_elems, { row: i, col: source.col }, g_size) &&
        checkHLEFT(grid_elems, { row: i, col: source.col }, g_size) &&
        checkHRIGHT(grid_elems, { row: i, col: source.col }, g_size)
      ) {
        current_tile.style.animationDelay = `0ms`;
        current_tile.classList.add("lightsout");
        current_tile.classList.remove("lightup");
      }
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  // VERTICAL UP ----------------------------------------------------
  for (let i = source.row - 1; i >= 0; i--) {
    const current_tile = getTile(
      { row: i, col: source.col },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      if (
        current_tile.dataset.isBulb != "true" &&
        checkVDOWN(grid_elems, { row: i, col: source.col }, g_size) &&
        checkVUP(grid_elems, { row: i, col: source.col }, g_size) &&
        checkHLEFT(grid_elems, { row: i, col: source.col }, g_size) &&
        checkHRIGHT(grid_elems, { row: i, col: source.col }, g_size)
      ) {
        current_tile.style.animationDelay = `0ms`;
        current_tile.classList.add("lightsout");
        current_tile.classList.remove("lightup");
      }
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  //HORIZONTAL LEFT -------------------------------------------------
  for (let i = source.col - 1; i >= 0; i--) {
    const current_tile = getTile(
      { row: source.row, col: i },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      if (
        current_tile.dataset.isBulb != "true" &&
        checkVDOWN(grid_elems, { row: source.row, col: i }, g_size) &&
        checkVUP(grid_elems, { row: source.row, col: i }, g_size) &&
        checkHLEFT(grid_elems, { row: source.row, col: i }, g_size) &&
        checkHRIGHT(grid_elems, { row: source.row, col: i }, g_size)
      ) {
        current_tile.style.animationDelay = `0ms`;
        current_tile.classList.add("lightsout");
        current_tile.classList.remove("lightup");
      }
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  //HORIZONTAL RIGHT ------------------------------------------------
  for (let i = source.col + 1; i < g_size; i++) {
    const current_tile = getTile(
      { row: source.row, col: i },
      g_size,
      grid_elems
    );
    if (current_tile.dataset.isWall == "false") {
      if (
        current_tile.dataset.isBulb != "true" &&
        checkVDOWN(grid_elems, { row: source.row, col: i }, g_size) &&
        checkVUP(grid_elems, { row: source.row, col: i }, g_size) &&
        checkHLEFT(grid_elems, { row: source.row, col: i }, g_size) &&
        checkHRIGHT(grid_elems, { row: source.row, col: i }, g_size)
      ) {
        current_tile.style.animationDelay = `0ms`;
        current_tile.classList.add("lightsout");
        current_tile.classList.remove("lightup");
      }
    } else {
      break;
    }
  }
  //-----------------------------------------------------------------
  // MIDDLE ---------------------------------------------------------
  const middle = getTile(source, g_size, grid_elems);
  if (
    checkVDOWN(grid_elems, { row: source.row, col: source.col }, g_size) &&
    checkVUP(grid_elems, { row: source.row, col: source.col }, g_size) &&
    checkHLEFT(grid_elems, { row: source.row, col: source.col }, g_size) &&
    checkHRIGHT(grid_elems, { row: source.row, col: source.col }, g_size)
  ) {
    middle.classList.remove("lightup");
    middle.classList.add("lightsout");
  }
  //-----------------------------------------------------------------
};

//falak körüli villanyokat számolja
function checkAround(grid_elems, id, g_size) {
  let amount = 0;
  const mid = getPos(id, g_size);
  if (
    grid_elems[id - 1] != undefined &&
    getPos(id - 1, g_size).col == mid.col - 1 &&
    bulbAtPos(mid.row, mid.col - 1)
  ) {
    amount++;
  }
  if (
    grid_elems[id + 1] != undefined &&
    getPos(id + 1, g_size).col == mid.col + 1 &&
    bulbAtPos(mid.row, mid.col + 1)
  ) {
    amount++;
  }
  if (
    grid_elems[id - g_size] != undefined &&
    getPos(id - g_size, g_size).row == mid.row - 1 &&
    bulbAtPos(mid.row - 1, mid.col)
  ) {
    amount++;
  }
  if (
    grid_elems[id + g_size] != undefined &&
    getPos(id + g_size, g_size).row == mid.row + 1 &&
    bulbAtPos(mid.row + 1, mid.col)
  ) {
    amount++;
  }

  return amount;
}

//ellenőrzi a készséget
function checkCompletion(grid_elems, mode, g_size) {
  let state = true;
  grid_elems.map((e) => {
    if (e.dataset.isWall == "false" && !e.classList.contains("lightup")) {
      state = false;
    }
    if (e.children.length == 0 && e.classList.contains("redlight")) {
      e.classList.remove("redlight");
    }
  });
  bulbs.map((e) => {
    if (
      !checkVDOWN(grid_elems, e, g_size) ||
      !checkVUP(grid_elems, e, g_size) ||
      !checkHLEFT(grid_elems, e, g_size) ||
      !checkHRIGHT(grid_elems, e, g_size)
    ) {
      getTile(e, g_size, grid_elems).classList.add("redlight");
      state = false;
    } else {
      getTile(e, g_size, grid_elems).classList.remove("redlight");
    }
  });
  givenTiles[mode].map((e) => {
    if (e.val != -1) {
      if (checkAround(grid_elems, e.id, g_size, e.val) == e.val) {
        getTile(getPos(e.id, g_size), g_size, grid_elems).style.color =
          "#249232";
      } else {
        state = false;
        getTile(getPos(e.id, g_size), g_size, grid_elems).style.color =
          "#ff392e";
      }
    }
  });
  return state;
}

//megjelenitjuk a játék végi dialógust
const renderDialog = (grid, newgame, timer, time) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog-wrapper", "dialogreveal");
  dialog.innerHTML = `
  <canvas class="canv" id="confetti-canvas"></canvas>
  <div class="dialog-box">
    <div class="dialog-topbar">
      <span class="dialog-title">Grat</span>
      <div class="dialog-close" id="dialog-close"></div>
    </div>
    <div class="dialog-content">
      <div class="dialog-time-box">
        <img src="public/time.svg" alt="watch" class="dialog-stopwatch" />
        <span class="dialog-time">${time}</span>
      </div>
      <button class="dialog-newgame" id="dialog-new">&#8635;</button>
    </div>
  </div>`;
  document.body.appendChild(dialog);
  let confetti = new ConfettiGenerator({ target: "confetti-canvas" });
  confetti.render();
  const close = document.querySelector("#dialog-close");
  const dialog_newgame = document.querySelector("#dialog-new");

  close.addEventListener("click", () => {
    dialog.classList.remove("dialogreveal");
    dialog.classList.add("dialogclose");
    setTimeout(() => {
      dialog.parentElement.removeChild(dialog);
    }, 200);
  });
  dialog_newgame.addEventListener("click", () => {
    dialog.classList.remove("dialogreveal");
    dialog.classList.add("dialogclose");
    setTimeout(() => {
      dialog.parentElement.removeChild(dialog);
      setTimeout(() => {
        gamearea.removeChild(grid);
        gamearea.removeChild(newgame);
        gamearea.removeChild(timer);
        clearInterval(timerObj);
        timerObj = null;
        renderHome();
      }, 200);
      fadeoutElems(title, label, grid, newgame, timer);
    }, 200);
  });
};

//a kör végén logoljuk az eredményt
const logGame = (time, mode) => {
  let game = document.createElement("li");
  game.classList.add("gl-entry");
  game.innerHTML = `[player: ${
    current_profile == "" ? "guest" : current_profile
  }] - [mode: ${mode}] - [time: ${time}]`;
  game.title = game.innerHTML;
  gamelist.prepend(game);
};

//időzitő callback
const tickTimer = (timer) => {
  if (current_time >= 3600) {
    return;
  }
  current_time++;

  let min = Math.floor(current_time / 60);
  let sec = current_time % 60;

  if (sec < 10) {
    sec = "0" + sec;
  }
  if (min < 10) {
    min = "0" + min;
  }
  timer.innerHTML = `${min}:${sec}`;
};

//minden grid-click eventnél alkalmazzuk a játékmenet logikáját
const handleGameLogic = (e, grid, mode, newgame, timer) => {
  if (
    e.target.id == "tile" &&
    e.target.style.backgroundColor != "rgb(192, 181, 165)"
  ) {
    const grid_elems = [...grid.children];
    let id = grid_elems.indexOf(e.target);
    const g_size = Math.sqrt(grid.children.length);
    const pos = getPos(id, g_size);

    if (e.target.children.length == 0) {
      let bulb = document.createElement("img");
      bulb.style.pointerEvents = "none";
      bulb.style.height = "100%";
      bulb.src = "public/bulb.svg";
      e.target.appendChild(bulb);
      e.target.dataset.isBulb = "true";
      bulbs.push(pos);
      //---------------------------------------------
      lightUp(grid_elems, pos, g_size);
    } else if (e.target.id == "tile" && e.target.children.length != 0) {
      e.target.dataset.isBulb = "false";
      removeFromObj(bulbs, pos);
      lightsOut(grid_elems, pos, g_size);
      e.target.removeChild(e.target.firstChild);
    }
    if (checkCompletion(grid_elems, mode, g_size)) {
      let min = Math.floor(current_time / 60);
      let sec = current_time % 60;
      if (sec < 10) {
        sec = "0" + sec;
      }
      if (min < 10) {
        min = "0" + min;
      }
      let time = `${min}:${sec}`;
      grid.style.pointerEvents = "none";
      logGame(time, mode);
      clearInterval(timerObj);
      renderDialog(grid, newgame, timer, time);
    }
  }
};

//előkésziti a játékteret majd elinditja a játékot
const runGame = (mode) => {
  fadeinElems(title, label);
  title.innerHTML = "Játék folyamatban";
  label.innerHTML = "Világítsd meg az összes zónát!";
  player_input.disabled = true;
  player_button.disabled = true;
  player_remove_button.disabled = true;
  bulbs = [];
  current_time = 0;
  if (timerObj) {
    clearInterval(timerObj);
    timerObj = null;
  }
  const grid = document.createElement("div");
  grid.classList.add("grid");
  grid.id = "grid";
  const gametime = document.createElement("span");
  gametime.classList.add("gametime");
  gametime.innerHTML = "00:00";
  const newgame = document.createElement("button");
  newgame.classList.add("newgame-btn");
  newgame.innerHTML = "&#8635; Új játék";
  fadeinElems(grid, newgame, gametime);
  switch (mode) {
    case "easy":
      grid.style.setProperty("--grid-rows", 7);
      grid.style.setProperty("--grid-cols", 7);
      for (let i = 0; i < 7 * 7; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = "tile";
        tile.dataset.isWall = "false";
        tile.dataset.isBulb = "false";
        grid.appendChild(tile);
      }
      givenTiles.easy.map((e) => {
        grid.children[e.id].style.backgroundColor = "#c0b5a5";
        if (e.val != -1) {
          grid.children[e.id].innerHTML = e.val;
        }
        grid.children[e.id].dataset.isWall = "true";
      });
      gamearea.appendChild(gametime);
      gamearea.appendChild(grid);
      if (!timerObj) {
        timerObj = setInterval(() => {
          tickTimer(gametime);
        }, 1000);
      }
      break;
    case "hard":
      grid.style.setProperty("--grid-rows", 7);
      grid.style.setProperty("--grid-cols", 7);
      for (let i = 0; i < 7 * 7; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = "tile";
        tile.dataset.isWall = "false";
        grid.appendChild(tile);
      }
      givenTiles.hard.map((e) => {
        grid.children[e.id].style.backgroundColor = "#c0b5a5";
        if (e.val != -1) {
          grid.children[e.id].innerHTML = e.val;
        }
        grid.children[e.id].dataset.isWall = "true";
      });
      gamearea.appendChild(gametime);
      gamearea.appendChild(grid);
      if (!timerObj) {
        timerObj = setInterval(() => {
          tickTimer(gametime);
        }, 1000);
      }
      break;
    case "expert":
      grid.style.setProperty("--grid-rows", 10);
      grid.style.setProperty("--grid-cols", 10);
      for (let i = 0; i < 10 * 10; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = "tile";
        tile.dataset.isWall = "false";
        grid.appendChild(tile);
      }
      givenTiles.expert.map((e) => {
        grid.children[e.id].style.backgroundColor = "#c0b5a5";
        if (e.val != -1) {
          grid.children[e.id].innerHTML = e.val;
        }
        grid.children[e.id].dataset.isWall = "true";
      });
      gamearea.appendChild(gametime);
      gamearea.appendChild(grid);
      if (!timerObj) {
        timerObj = setInterval(() => {
          tickTimer(gametime);
        }, 1000);
      }
      break;
  }

  gamearea.appendChild(newgame);
  newgame.addEventListener("click", () => {
    setTimeout(() => {
      grid.removeEventListener("click", (e) => {
        handleGameLogic(e, grid, mode, newgame, gametime);
      });
      gamearea.removeChild(grid);
      gamearea.removeChild(newgame);
      gamearea.removeChild(gametime);
      clearInterval(timerObj);
      timerObj = null;
      renderHome();
    }, "500");
    fadeoutElems(title, label, grid, newgame, gametime);
  });
  checkCompletion([...grid.children], mode, Math.sqrt(grid.children.length));
  grid.addEventListener("click", (e) => {
    handleGameLogic(e, grid, mode, newgame, gametime);
  });
};

//előkésziti majd megjeleniti a homescreent
const renderHome = () => {
  title.innerHTML = "Játék indítása";
  label.innerHTML = "Nehézség:";
  player_input.disabled = false;
  player_button.disabled = false;
  player_remove_button.disabled = false;

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

  fadeinElems(title, label, cpanel, spritewrapper);
};

//módválasztás
const handleControls = (e) => {
  if (e.target.matches("button")) {
    const panel = document.querySelector("#control-buttons");
    const sprite = document.querySelector("#sprite-wrapper");
    setTimeout(() => {
      controls.removeChild(panel);
      gamearea.removeChild(sprite);
      runGame(e.target.dataset.mode);
    }, "500");

    fadeoutElems(title, label, panel, sprite);
    controls.removeEventListener("mouseup", handleControls);
  }
};

//profilválasztás
const handleProfileChange = () => {
  if (player_input.value == "") {
    alert("A név nem lehet üres!");
    return;
  }
  if (player_input.value == "guest") {
    alert("A guest név nem választható!");
    return;
  }
  current_profile = player_input.value;
  if (!all_profiles.includes(current_profile)) {
    all_profiles.push(current_profile);
  }
  player_name.innerHTML = current_profile;
  player_name.title = current_profile;
};
const handleProfileDeletion = () => {
  if (current_profile == "") {
    return;
  }
  current_profile = "";
  player_name.innerHTML = "";
  player_name.title = "";
};

controls.addEventListener("mouseup", handleControls);
player_button.addEventListener("click", handleProfileChange);
player_remove_button.addEventListener("click", handleProfileDeletion);
