const mainwrapper = document.querySelector("#mainwrapper");
const gamearea = document.querySelector("#gamearea");
const control_btns = document.querySelectorAll("#ctrl-btn");
const control_panel = document.querySelector("#control-buttons");

control_panel.addEventListener("mouseup", (e) => {
  if (e.target.matches("button")) {
    control_panel.classList.add("fadeout");
  }
});
