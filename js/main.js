// Main entry point - initializes the engine and scene
import { createScene } from './scene.js';

// Get the canvas element
const canvas = document.getElementById("renderCanvas");

// Create Babylon.js engine
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

// Create the scene
const scene = createScene(engine, canvas);

// Start screen handling
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const infoDiv = document.getElementById('info');

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    infoDiv.classList.remove('hidden');
});

// Render loop
engine.runRenderLoop(function() {
    scene.render();
});

// Handle window resize
window.addEventListener("resize", function() {
    engine.resize();
});
