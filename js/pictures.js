// Pictures and interactive buttons
import { CONFIG } from './config.js';

export function createPictures(scene, materials) {
    const churchDepth = CONFIG.church.depth;
    const pictureRadius = CONFIG.pictures.radius;
    const pictureHeight = CONFIG.pictures.height;
    const numPictures = CONFIG.pictures.count;
    const pictures = CONFIG.pictures.files;
    const imageInfo = CONFIG.pictures.info;
    
    const cameraZ = churchDepth / 2 - 5;
    const canvas = scene.getEngine().getRenderingCanvas();
    
    // Modal elements
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    
    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    function showModal(index) {
        modalTitle.textContent = imageInfo[index].title;
        modalDescription.textContent = imageInfo[index].description;
        modal.classList.remove('hidden');
    }
    
    // Create picture function
    function createPicture(imagePath, position, rotation, width, height) {
        const pictureMaterial = new BABYLON.StandardMaterial("picMat_" + imagePath, scene);
        const pictureTexture = new BABYLON.Texture("assets/" + imagePath, scene, false, true);
        pictureTexture.hasAlpha = true;
        pictureMaterial.diffuseTexture = pictureTexture;
        pictureMaterial.opacityTexture = pictureTexture;
        pictureMaterial.useAlphaFromDiffuseTexture = true;
        pictureMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        pictureMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        pictureMaterial.backFaceCulling = false;
        
        const picture = BABYLON.MeshBuilder.CreatePlane("picture_" + imagePath, { 
            width: width, 
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);
        picture.material = pictureMaterial;
        picture.position = position.clone();
        picture.rotation.y = rotation;
    }
    
    // Create pictures and buttons
    for (let i = 0; i < numPictures; i++) {
        const angle = -Math.PI / 2 + (i / (numPictures - 1)) * Math.PI;
        const x = Math.sin(angle) * pictureRadius;
        const z = cameraZ - 10 - Math.cos(angle) * pictureRadius;
        const rotationY = -angle;
        
        createPicture(pictures[i], new BABYLON.Vector3(x, pictureHeight, z), rotationY, CONFIG.pictures.width, CONFIG.pictures.imageHeight);
        
        // Create button in front of image
        const buttonOffset = 1.5;
        const buttonX = x - Math.sin(angle) * buttonOffset;
        const buttonZ = z + Math.cos(angle) * buttonOffset;
        
        // Create text button with "Matrix has you"
        const buttonWidth = 1.2;
        const buttonHeight = 0.3;
        const button = BABYLON.MeshBuilder.CreatePlane("button_" + i, {
            width: buttonWidth,
            height: buttonHeight,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);
        
        // Create dynamic texture for button text
        const buttonTexture = new BABYLON.DynamicTexture("btnTex_" + i, { width: 256, height: 64 }, scene, true);
        const btnCtx = buttonTexture.getContext();
        btnCtx.fillStyle = "#001100";
        btnCtx.fillRect(0, 0, 256, 64);
        btnCtx.strokeStyle = "#00ff00";
        btnCtx.lineWidth = 3;
        btnCtx.strokeRect(2, 2, 252, 60);
        btnCtx.font = "bold 24px monospace";
        btnCtx.fillStyle = "#00ff00";
        btnCtx.textAlign = "center";
        btnCtx.textBaseline = "middle";
        btnCtx.fillText("Matrix has you", 128, 32);
        buttonTexture.update();
        
        const btnMat = new BABYLON.StandardMaterial("btnMat_" + i, scene);
        btnMat.diffuseTexture = buttonTexture;
        btnMat.emissiveTexture = buttonTexture;
        btnMat.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
        btnMat.specularColor = new BABYLON.Color3(0, 0, 0);
        button.material = btnMat;
        
        button.position = new BABYLON.Vector3(buttonX, pictureHeight - 1.5, buttonZ);
        button.rotation.y = rotationY + Math.PI;
        
        // Button interaction
        button.actionManager = new BABYLON.ActionManager(scene);
        const imageIndex = i;
        const buttonRef = button;
        const matRef = btnMat;
        let targetScale = 1;
        let targetEmissive = 0.5;
        let currentScale = 1;
        let currentEmissive = 0.5;
        
        // Smooth animation
        scene.onBeforeRenderObservable.add(() => {
            currentScale += (targetScale - currentScale) * 0.1;
            buttonRef.scaling = new BABYLON.Vector3(currentScale, currentScale, currentScale);
            currentEmissive += (targetEmissive - currentEmissive) * 0.1;
            matRef.emissiveColor = new BABYLON.Color3(0, currentEmissive, 0);
        });
        
        button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => showModal(imageIndex)
        ));
        
        button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => {
                targetScale = 1.15;
                targetEmissive = 1;
                canvas.style.cursor = 'pointer';
            }
        ));
        
        button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => {
                targetScale = 1;
                targetEmissive = 0.5;
                canvas.style.cursor = 'default';
            }
        ));
    }
}
