export const playerInputs = [];

window.addEventListener("keydown", ({ code }) => {
  if (playerInputs.includes(code)) return;
  playerInputs.push(code);
});

window.addEventListener("keyup", ({ code }) => {
  const codeIndex = playerInputs.indexOf(code);
  playerInputs.splice(codeIndex, 1);
});
