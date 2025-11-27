// Camera setup and scroll-based animation
import { CONFIG } from './config.js';

export function setupCamera(scene, canvas) {
    const churchDepth = CONFIG.church.depth;
    const numPictures = CONFIG.pictures.count;
    const zoomedRadius = CONFIG.camera.zoomedRadius;
    const smoothFactor = CONFIG.camera.smoothFactor;    
    const cameraStartZ = churchDepth / 2 - 5; // z = 20
    const pictureArcCenterZ = cameraStartZ - 10; // z = 10
    const pictureArcCenter = new BABYLON.Vector3(0, CONFIG.pictures.height, pictureArcCenterZ);
    
    // Camera positions for the journey
    const startPos = new BABYLON.Vector3(0, CONFIG.camera.startY, cameraStartZ);
    const midPos = new BABYLON.Vector3(-5, CONFIG.pictures.height, 10);
    
    // Camera - positioned inside the church
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2,
        0.1,
        startPos.clone(),
        scene
    );
    
    camera.lowerRadiusLimit = 0.1;
    camera.upperRadiusLimit = 0.1;
    camera.lowerBetaLimit = 0.3;
    camera.upperBetaLimit = Math.PI - 0.3;
    camera.angularSensibilityX = 500;
    camera.angularSensibilityY = 500;
    camera.panningSensibility = 0;
    camera.attachControl(canvas, true);

    // Smooth scroll animation variables
    let targetFlyProgress = 0;
    let currentFlyProgress = 0;
    
    // Total progress: 0-1 = fly to image 1, 1-2 = zoom in, 2-6 = slide along arc
    const maxProgress = 2 + (numPictures - 1);

    // Scroll to set target progress
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetFlyProgress += e.deltaY * 0.001;
        targetFlyProgress = Math.max(0, Math.min(maxProgress, targetFlyProgress));
    }, { passive: false });

    // Smooth animation loop
    scene.onBeforeRenderObservable.add(() => {
        currentFlyProgress += (targetFlyProgress - currentFlyProgress) * smoothFactor;
        
        let camX, camY, camZ, camAlpha;
        
        if (currentFlyProgress <= 1) {
            // Phase 1: Fly from start to centered on image 1
            const phase1Progress = currentFlyProgress;
            camX = startPos.x + (midPos.x - startPos.x) * phase1Progress;
            camY = startPos.y + (midPos.y - startPos.y) * phase1Progress;
            camZ = startPos.z + (midPos.z - startPos.z) * phase1Progress;
            camAlpha = Math.PI / 2 + (Math.PI / 2) * phase1Progress;
        } else if (currentFlyProgress <= 2) {
            // Phase 2: Zoom closer to image 1
            const phase2Progress = currentFlyProgress - 1;
            const zoomedX = 2;
            camX = midPos.x + (zoomedX - midPos.x) * phase2Progress;
            camY = midPos.y;
            camZ = midPos.z;
            camAlpha = Math.PI;
        } else {
            // Phase 3: Slide along arc from image 1 to images 2,3,4,5
            const phase3Progress = currentFlyProgress - 2;
            const startAngle = -Math.PI / 2;
            const endAngle = Math.PI / 2;
            const currentAngle = startAngle + (phase3Progress / (numPictures - 1)) * (endAngle - startAngle);
            
            const imgX = Math.sin(currentAngle) * -0.314;
            const imgZ = pictureArcCenterZ - Math.cos(currentAngle) * -0.314;
            
            camX = imgX + zoomedRadius * (-Math.sin(currentAngle));
            camZ = imgZ + zoomedRadius * Math.cos(currentAngle);
            camY = pictureArcCenter.y;
            camAlpha = Math.PI / 2 - currentAngle;
        }
        
        camera.target.x = camX;
        camera.target.y = camY;
        camera.target.z = camZ;
        camera.alpha = camAlpha;
    });

    return camera;
}
