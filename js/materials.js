// Materials creation including Matrix animation texture
import { CONFIG } from './config.js';

export function createMaterials(scene) {
    // Matrix-style animated wall texture
    const matrixTextureSize = CONFIG.matrix.textureSize;
    const matrixTexture = new BABYLON.DynamicTexture("matrixTexture", { width: matrixTextureSize, height: matrixTextureSize }, scene, true);
    const matrixContext = matrixTexture.getContext();
    
    const matrixChars = CONFIG.matrix.chars;
    const columns = CONFIG.matrix.columns;
    const fontSize = matrixTextureSize / columns;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -50;
    }
    
    // Matrix animation update function
    function updateMatrixTexture() {
        matrixContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixContext.fillRect(0, 0, matrixTextureSize, matrixTextureSize);
        
        matrixContext.fillStyle = '#0f0';
        matrixContext.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            matrixContext.fillStyle = '#fff';
            matrixContext.fillText(char, x, y);
            
            matrixContext.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, 0.8)`;
            const trailChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixContext.fillText(trailChar, x, y - fontSize);
            
            drops[i]++;
            
            if (drops[i] * fontSize > matrixTextureSize && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
        
        matrixTexture.update();
    }
    
    scene.onBeforeRenderObservable.add(updateMatrixTexture);
    
    // Stone material with matrix texture
    const stoneMaterial = new BABYLON.StandardMaterial("stoneMat", scene);
    stoneMaterial.diffuseTexture = matrixTexture;
    stoneMaterial.diffuseTexture.uScale = 2;
    stoneMaterial.diffuseTexture.vScale = 2;
    stoneMaterial.emissiveTexture = matrixTexture;
    stoneMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.8, 0.3);
    stoneMaterial.specularColor = new BABYLON.Color3(0.1, 0.3, 0.1);

    // Dark stone material
    const darkStoneMaterial = new BABYLON.StandardMaterial("darkStoneMat", scene);
    darkStoneMaterial.diffuseTexture = matrixTexture;
    darkStoneMaterial.diffuseTexture.uScale = 1.5;
    darkStoneMaterial.diffuseTexture.vScale = 1.5;
    darkStoneMaterial.emissiveTexture = matrixTexture;
    darkStoneMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.6, 0.2);
    darkStoneMaterial.specularColor = new BABYLON.Color3(0.1, 0.2, 0.1);

    // Floor material with wood texture
    const floorMaterial = new BABYLON.StandardMaterial("floorMat", scene);
    floorMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    const floorTexture = new BABYLON.Texture("assets/wood.jpg", scene);
    floorTexture.uScale = 10;
    floorTexture.vScale = 25;
    floorMaterial.diffuseTexture = floorTexture;
    floorMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Pillar material
    const pillarMaterial = new BABYLON.StandardMaterial("pillarMat", scene);
    pillarMaterial.diffuseColor = new BABYLON.Color3(0.92, 0.92, 0.92);
    pillarMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    // Stained glass material
    const stainedGlassMaterial = new BABYLON.StandardMaterial("stainedGlassMat", scene);
    stainedGlassMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.3, 0.5);
    stainedGlassMaterial.alpha = 0.8;

    // Altar material
    const altarMaterial = new BABYLON.StandardMaterial("altarMat", scene);
    altarMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.85, 0.8);
    altarMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    // Button materials
    const buttonMaterial = new BABYLON.StandardMaterial("buttonMat", scene);
    buttonMaterial.diffuseColor = new BABYLON.Color3(0, 0.8, 0);
    buttonMaterial.emissiveColor = new BABYLON.Color3(0, 0.4, 0);
    buttonMaterial.specularColor = new BABYLON.Color3(0.5, 1, 0.5);
    
    const buttonHoverMaterial = new BABYLON.StandardMaterial("buttonHoverMat", scene);
    buttonHoverMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
    buttonHoverMaterial.emissiveColor = new BABYLON.Color3(0, 0.8, 0);
    buttonHoverMaterial.specularColor = new BABYLON.Color3(1, 1, 1);

    return {
        stoneMaterial: stoneMaterial,
        darkStoneMaterial: darkStoneMaterial,
        floorMaterial: floorMaterial,
        pillarMaterial: pillarMaterial,
        stainedGlassMaterial: stainedGlassMaterial,
        altarMaterial: altarMaterial,
        buttonMaterial: buttonMaterial,
        buttonHoverMaterial: buttonHoverMaterial,
        matrixTexture: matrixTexture
    };
}
