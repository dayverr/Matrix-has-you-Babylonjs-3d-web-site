// Lighting setup
import { CONFIG } from './config.js';

export function createLighting(scene) {
    const churchWidth = CONFIG.church.width;
    const churchDepth = CONFIG.church.depth;
    
    // Ambient light
    const ambientLight = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5;
    ambientLight.diffuse = new BABYLON.Color3(0.8, 0.8, 0.9);
    ambientLight.groundColor = new BABYLON.Color3(0.3, 0.3, 0.4);
    
    // Main directional light
    const mainLight = new BABYLON.DirectionalLight("mainLight", new BABYLON.Vector3(-1, -2, 1), scene);
    mainLight.intensity = 0.6;
    mainLight.diffuse = new BABYLON.Color3(1, 0.95, 0.8);
    
    // Point lights for atmosphere
    const pointLight1 = new BABYLON.PointLight("point1", new BABYLON.Vector3(0, 15, 0), scene);
    pointLight1.intensity = 0.3;
    pointLight1.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
    
    const pointLight2 = new BABYLON.PointLight("point2", new BABYLON.Vector3(-churchWidth / 3, 8, -churchDepth / 3), scene);
    pointLight2.intensity = 0.2;
    pointLight2.diffuse = new BABYLON.Color3(0.9, 0.8, 1);
    
    const pointLight3 = new BABYLON.PointLight("point3", new BABYLON.Vector3(churchWidth / 3, 8, churchDepth / 3), scene);
    pointLight3.intensity = 0.2;
    pointLight3.diffuse = new BABYLON.Color3(1, 0.8, 0.9);
}
