// Scene orchestration - creates and assembles the complete scene
import { CONFIG } from './config.js';
import { setupCamera } from './camera.js';
import { createMaterials } from './materials.js';
import { createChurch } from './church.js';
import { createPictures } from './pictures.js';
import { createLighting } from './lighting.js';

export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.1, 1);
    
    // Add fog to the scene
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = CONFIG.fog.density;
    scene.fogColor = new BABYLON.Color3(CONFIG.fog.color.r, CONFIG.fog.color.g, CONFIG.fog.color.b);

    // Setup camera with scroll animation
    setupCamera(scene, canvas);
    
    // Create all materials
    const materials = createMaterials(scene);
    
    // Create church geometry
    createChurch(scene, materials);
    
    // Create pictures and buttons
    createPictures(scene, materials);
    
    // Create lighting
    createLighting(scene);

    return scene;
}
