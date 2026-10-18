
const intro = document.getElementById("intro");
const gameScreen = document.getElementById("game-screen");
const reveal = document.getElementById("reveal");

const stage = document.getElementById("game-stage");
const ribbon = document.getElementById("ribbon");
const finalRibbon = document.getElementById("final-ribbon");

const playButton = document.getElementById("play-button");
const ribbonButton = document.getElementById("ribbon-button");
const message = document.getElementById("game-message");

const target = {
    x: 60,
    y: 25
};

let dragging = false;
let won = false;
let ribbonShown = false;

let offsetX = 0;
let offsetY = 0;

// INTRO -> GAME
playButton.addEventListener("click", () => {
    intro.classList.add("hidden");
    gameScreen.classList.remove("hidden");
});

// SHOW THE BOW AT A RANDOM POSITION
ribbonButton.addEventListener("click", () => {
    if (won || ribbonShown) return;

    ribbonShown = true;

    // Use the existing PNG, resized to fit the game area.
    ribbon.style.width = "18%";
    ribbon.style.height = "auto";
    ribbon.style.display = "block";
    ribbon.style.bottom = "auto";

    // Pick a random starting position within the game area.
    const maxX = Math.max(
        0,
        stage.clientWidth - ribbon.offsetWidth
    );

    const maxY = Math.max(
        0,
        stage.clientHeight - ribbon.offsetHeight
    );

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    ribbon.style.left = `${randomX}px`;
    ribbon.style.top = `${randomY}px`;

    message.textContent = "STYLE TINY RUTU!";
    message.className = "";

    ribbonButton.textContent = "STYLE TINY RUTU!";
});

// START DRAGGING
ribbon.addEventListener("pointerdown", (event) => {
    if (won) return;

    dragging = true;

    const rect = ribbon.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    ribbon.setPointerCapture(event.pointerId);
    event.preventDefault();
});

// MOVE THE BOW
ribbon.addEventListener("pointermove", (event) => {
    if (!dragging || won) return;

    const rect = stage.getBoundingClientRect();

    let x = event.clientX - rect.left - offsetX;
    let y = event.clientY - rect.top - offsetY;

    x = Math.max(
        0,
        Math.min(x, stage.clientWidth - ribbon.offsetWidth)
    );

    y = Math.max(
        0,
        Math.min(y, stage.clientHeight - ribbon.offsetHeight)
    );

    ribbon.style.left = `${x}px`;
    ribbon.style.top = `${y}px`;
    ribbon.style.bottom = "auto";
});

// CHECK THE BOW POSITION
ribbon.addEventListener("pointerup", () => {
    if (!dragging) return;

    dragging = false;

    const stageRect = stage.getBoundingClientRect();
    const ribbonRect = ribbon.getBoundingClientRect();

    const ribbonX =
        ribbonRect.left + ribbonRect.width / 2 - stageRect.left;

    const ribbonY =
        ribbonRect.top + ribbonRect.height / 2 - stageRect.top;

    const targetX = stage.clientWidth * target.x / 100;
    const targetY = stage.clientHeight * target.y / 100;

    const correct =
        Math.abs(ribbonX - targetX) < stage.clientWidth * 0.12 &&
        Math.abs(ribbonY - targetY) < stage.clientHeight * 0.09;

    // FAILED ATTEMPT
    if (!correct) {
        message.textContent = "LOSER";
        message.className = "";

        // Restart the shake animation on every failed attempt.
        void message.offsetWidth;
        message.classList.add("loser");

        return;
    }

    // WIN!
    won = true;

    // Snap the bow into place.
    ribbon.style.left = `${targetX - ribbon.offsetWidth / 2}px`;
    ribbon.style.top = `${targetY - ribbon.offsetHeight / 2}px`;
    ribbon.style.bottom = "auto";

    // Use the same PNG for the final photo.
    finalRibbon.style.width = "18%";
    finalRibbon.style.left = `${target.x}%`;
    finalRibbon.style.top = `${target.y}%`;

    message.textContent = "YAYYYYYY";
    message.className = "winner";

    ribbonButton.textContent = "YOU DID IT!";
    ribbonButton.disabled = true;

    // Reveal the birthday surprise after the celebration.
    setTimeout(() => {
        gameScreen.classList.add("hidden");
        reveal.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 1800);
});

// HANDLE CANCELLED TOUCH INTERACTIONS
ribbon.addEventListener("pointercancel", () => {
    dragging = false;
});
