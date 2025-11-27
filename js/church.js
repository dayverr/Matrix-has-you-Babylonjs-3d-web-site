// Church geometry - floor, walls, ceiling, arches, pillars, windows
import { CONFIG } from './config.js';

export function createChurch(scene, materials) {
    const churchWidth = CONFIG.church.width;
    const churchHeight = CONFIG.church.height;
    const churchDepth = CONFIG.church.depth;
    const naveHeight = CONFIG.church.naveHeight;
    const aisleWidth = CONFIG.church.aisleWidth;
    
    const { stoneMaterial, darkStoneMaterial, floorMaterial, pillarMaterial } = materials;

    // Floor
    const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: churchWidth, height: churchDepth }, scene);
    floor.material = floorMaterial;
    floor.position.y = 0;

    // Main walls
    const wallThickness = 0.5;
    
    // Left wall
    const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { 
        width: wallThickness, 
        height: churchHeight, 
        depth: churchDepth 
    }, scene);
    leftWall.material = stoneMaterial;
    leftWall.position = new BABYLON.Vector3(-churchWidth / 2, churchHeight / 2, 0);

    // Right wall
    const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { 
        width: wallThickness, 
        height: churchHeight, 
        depth: churchDepth 
    }, scene);
    rightWall.material = stoneMaterial;
    rightWall.position = new BABYLON.Vector3(churchWidth / 2, churchHeight / 2, 0);

    // Back wall (altar end)
    const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { 
        width: churchWidth, 
        height: churchHeight, 
        depth: wallThickness 
    }, scene);
    backWall.material = stoneMaterial;
    backWall.position = new BABYLON.Vector3(0, churchHeight / 2, -churchDepth / 2);

    // Front wall (entrance)
    const frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { 
        width: churchWidth, 
        height: churchHeight, 
        depth: wallThickness 
    }, scene);
    frontWall.material = stoneMaterial;
    frontWall.position = new BABYLON.Vector3(0, churchHeight / 2, churchDepth / 2);

    // Create Gothic arch function
    function createArch(position, rotation, width, height, depth, material) {
        const archGroup = [];
        
        // Left pillar
        const leftPillar = BABYLON.MeshBuilder.CreateCylinder("archPillarL", {
            diameter: depth,
            height: height * 0.6,
            tessellation: 16
        }, scene);
        leftPillar.material = material;
        leftPillar.position = new BABYLON.Vector3(
            position.x - width / 2,
            height * 0.3,
            position.z
        );
        archGroup.push(leftPillar);

        // Right pillar
        const rightPillar = BABYLON.MeshBuilder.CreateCylinder("archPillarR", {
            diameter: depth,
            height: height * 0.6,
            tessellation: 16
        }, scene);
        rightPillar.material = material;
        rightPillar.position = new BABYLON.Vector3(
            position.x + width / 2,
            height * 0.3,
            position.z
        );
        archGroup.push(rightPillar);

        // Gothic pointed arch using segments
        const archRadius = width / 2;
        const segments = 12;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            
            let x, y;
            if (t <= 0.5) {
                const localAngle = Math.PI * (t * 2);
                x = position.x - width / 2 + archRadius * (1 - Math.cos(localAngle));
                y = height * 0.6 + archRadius * Math.sin(localAngle) * 1.3;
            } else {
                const localAngle = Math.PI * ((t - 0.5) * 2);
                x = position.x + archRadius * Math.cos(localAngle);
                y = height * 0.6 + archRadius * Math.sin(Math.PI - localAngle) * 1.3;
            }
            
            const archSegment = BABYLON.MeshBuilder.CreateSphere("archSeg" + i, {
                diameter: depth * 0.8
            }, scene);
            archSegment.material = material;
            archSegment.position = new BABYLON.Vector3(x, y, position.z);
            archGroup.push(archSegment);
        }

        return archGroup;
    }

    // Create row of pillars and arches along the nave
    const numPillars = 6;
    const pillarSpacing = churchDepth / (numPillars + 1);
    const pillarOffset = aisleWidth + 1;
    const pictureZone = { min: 7, max: 23 };

    for (let i = 0; i < numPillars; i++) {
        const zPos = -churchDepth / 2 + pillarSpacing * (i + 1);
        
        // Skip pillars in the picture zone
        if (zPos > pictureZone.min && zPos < pictureZone.max) {
            continue;
        }
        
        // Left row of pillars
        const leftPillar = BABYLON.MeshBuilder.CreateCylinder("pillarL" + i, {
            diameter: 1.2,
            height: naveHeight,
            tessellation: 24
        }, scene);
        leftPillar.material = pillarMaterial;
        leftPillar.position = new BABYLON.Vector3(-pillarOffset, naveHeight / 2, zPos);

        // Right row of pillars
        const rightPillar = BABYLON.MeshBuilder.CreateCylinder("pillarR" + i, {
            diameter: 1.2,
            height: naveHeight,
            tessellation: 24
        }, scene);
        rightPillar.material = pillarMaterial;
        rightPillar.position = new BABYLON.Vector3(pillarOffset, naveHeight / 2, zPos);

        // Pillar capitals (decorative tops)
        const capitalL = BABYLON.MeshBuilder.CreateCylinder("capitalL" + i, {
            diameterTop: 1.8,
            diameterBottom: 1.2,
            height: 0.5,
            tessellation: 24
        }, scene);
        capitalL.material = pillarMaterial;
        capitalL.position = new BABYLON.Vector3(-pillarOffset, naveHeight + 0.25, zPos);

        const capitalR = BABYLON.MeshBuilder.CreateCylinder("capitalR" + i, {
            diameterTop: 1.8,
            diameterBottom: 1.2,
            height: 0.5,
            tessellation: 24
        }, scene);
        capitalR.material = pillarMaterial;
        capitalR.position = new BABYLON.Vector3(pillarOffset, naveHeight + 0.25, zPos);
    }

    // Create arches only outside picture zone
    for (let i = 0; i < numPillars - 1; i++) {
        const zPos = -churchDepth / 2 + pillarSpacing * (i + 1);
        const nextZ = -churchDepth / 2 + pillarSpacing * (i + 2);
        const archZ = (zPos + nextZ) / 2;
        
        if (archZ > pictureZone.min && archZ < pictureZone.max) {
            continue;
        }
        
        createArch(
            new BABYLON.Vector3(-pillarOffset, 0, archZ),
            0,
            pillarSpacing * 0.8,
            naveHeight,
            0.6,
            darkStoneMaterial
        );
        
        createArch(
            new BABYLON.Vector3(pillarOffset, 0, archZ),
            0,
            pillarSpacing * 0.8,
            naveHeight,
            0.6,
            darkStoneMaterial
        );
    }

    // Transverse arches only outside picture zone
    for (let i = 0; i < numPillars; i++) {
        const zPos = -churchDepth / 2 + pillarSpacing * (i + 1);
        
        if (zPos > pictureZone.min && zPos < pictureZone.max) {
            continue;
        }

        createArch(
            new BABYLON.Vector3(0, 0, zPos),
            0,
            pillarOffset * 2,
            naveHeight + 2,
            0.5,
            darkStoneMaterial
        );
    }

    // Vaulted ceiling
    const ceilingMaterial = new BABYLON.StandardMaterial("ceilingMat", scene);
    ceilingMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    ceilingMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    ceilingMaterial.backFaceCulling = false;

    for (let i = 0; i < numPillars - 1; i++) {
        const zStart = -churchDepth / 2 + pillarSpacing * (i + 1);
        const zEnd = -churchDepth / 2 + pillarSpacing * (i + 2);
        const zMid = (zStart + zEnd) / 2;
        
        if (zMid > pictureZone.min && zMid < pictureZone.max) {
            continue;
        }
        
        const vaultHeight = churchHeight - 2;
        
        const leftVault = BABYLON.MeshBuilder.CreatePlane("vaultL" + i, {
            width: pillarOffset + 1,
            height: pillarSpacing
        }, scene);
        leftVault.material = ceilingMaterial;
        leftVault.position = new BABYLON.Vector3(-pillarOffset / 2, vaultHeight, zMid);
        leftVault.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 8);

        const rightVault = BABYLON.MeshBuilder.CreatePlane("vaultR" + i, {
            width: pillarOffset + 1,
            height: pillarSpacing
        }, scene);
        rightVault.material = ceilingMaterial;
        rightVault.position = new BABYLON.Vector3(pillarOffset / 2, vaultHeight, zMid);
        rightVault.rotation = new BABYLON.Vector3(Math.PI / 2, 0, Math.PI / 8);
    }

    // Create windows
    createStainedGlassWindows(scene, churchWidth, churchDepth, numPillars, pillarSpacing);
    createBigWindows(scene, churchWidth, churchDepth, numPillars, pillarSpacing);
    createRoseWindow(scene, churchDepth);
}

// Stained glass windows
function createStainedGlassWindow(scene, position, rotation, width, height) {
    const colors = [
        new BABYLON.Color3(0.8, 0.2, 0.2),
        new BABYLON.Color3(0.2, 0.4, 0.8),
        new BABYLON.Color3(0.9, 0.7, 0.2),
        new BABYLON.Color3(0.3, 0.7, 0.3),
        new BABYLON.Color3(0.6, 0.2, 0.6)
    ];
    
    const panelHeight = height / 5;
    for (let i = 0; i < 5; i++) {
        const glassMat = new BABYLON.StandardMaterial("glassMat" + i, scene);
        glassMat.diffuseColor = colors[i];
        glassMat.emissiveColor = colors[i].scale(0.5);
        glassMat.alpha = 0.7;
        glassMat.backFaceCulling = false;
        
        const panel = BABYLON.MeshBuilder.CreatePlane("glassPanel" + i, {
            width: width * 0.8,
            height: panelHeight * 0.9
        }, scene);
        panel.material = glassMat;
        panel.position = new BABYLON.Vector3(
            position.x,
            position.y - height / 2 + panelHeight * (i + 0.5),
            position.z
        );
        panel.rotation.y = rotation;
    }

    const archMat = new BABYLON.StandardMaterial("archGlassMat", scene);
    archMat.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.3);
    archMat.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0.1);
    archMat.alpha = 0.7;
    
    const archTop = BABYLON.MeshBuilder.CreateDisc("archTop", {
        radius: width / 2,
        tessellation: 32,
        arc: 0.5
    }, scene);
    archTop.material = archMat;
    archTop.position = new BABYLON.Vector3(position.x, position.y + height / 2, position.z);
    archTop.rotation.y = rotation;
    archTop.rotation.z = Math.PI / 2;
}

function createStainedGlassWindows(scene, churchWidth, churchDepth, numPillars, pillarSpacing) {
    for (let i = 0; i < numPillars - 1; i++) {
        const zPos = -churchDepth / 2 + pillarSpacing * (i + 1.5);
        
        createStainedGlassWindow(scene,
            new BABYLON.Vector3(-churchWidth / 2 + 0.3, 13, zPos),
            Math.PI / 2, 2, 3
        );
        
        createStainedGlassWindow(scene,
            new BABYLON.Vector3(churchWidth / 2 - 0.3, 13, zPos),
            -Math.PI / 2, 2, 3
        );
    }
}

// Big landscape windows
function createBigWindow(scene, position, rotation, width, height) {
    const windowFrameMat = new BABYLON.StandardMaterial("bigWindowFrameMat", scene);
    windowFrameMat.diffuseColor = new BABYLON.Color3(0.25, 0.2, 0.15);
    windowFrameMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    
    const landscapeMat = new BABYLON.StandardMaterial("landscapeMat", scene);
    const landscapeTexture = new BABYLON.Texture("assets/nature.jpg", scene, false, true);
    landscapeMat.diffuseTexture = landscapeTexture;
    landscapeMat.emissiveColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    landscapeMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    landscapeMat.backFaceCulling = false;
    
    const windowGlass = BABYLON.MeshBuilder.CreatePlane("bigWindowGlass", {
        width: width,
        height: height,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    windowGlass.material = landscapeMat;
    windowGlass.position = position.clone();
    windowGlass.rotation.y = rotation;
    
    const frameThickness = 0.25;
    const frameDepth = 0.15;
    
    const topFrame = BABYLON.MeshBuilder.CreateBox("bigWindowTopFrame", {
        width: width + frameThickness * 2,
        height: frameThickness,
        depth: frameDepth
    }, scene);
    topFrame.material = windowFrameMat;
    topFrame.position = new BABYLON.Vector3(position.x, position.y + height / 2 + frameThickness / 2, position.z);
    topFrame.rotation.y = rotation;
    
    const bottomFrame = BABYLON.MeshBuilder.CreateBox("bigWindowBottomFrame", {
        width: width + frameThickness * 2,
        height: frameThickness,
        depth: frameDepth
    }, scene);
    bottomFrame.material = windowFrameMat;
    bottomFrame.position = new BABYLON.Vector3(position.x, position.y - height / 2 - frameThickness / 2, position.z);
    bottomFrame.rotation.y = rotation;
    
    const numDividers = 3;
    for (let i = 1; i < numDividers; i++) {
        const divider = BABYLON.MeshBuilder.CreateBox("windowDivider" + i, {
            width: frameThickness * 0.5,
            height: height,
            depth: frameDepth
        }, scene);
        divider.material = windowFrameMat;
        
        const xOffset = -width / 2 + (width / numDividers) * i;
        if (rotation === Math.PI / 2) {
            divider.position = new BABYLON.Vector3(position.x, position.y, position.z + xOffset);
        } else if (rotation === -Math.PI / 2) {
            divider.position = new BABYLON.Vector3(position.x, position.y, position.z - xOffset);
        } else {
            divider.position = new BABYLON.Vector3(position.x + xOffset, position.y, position.z);
        }
        divider.rotation.y = rotation;
    }
    
    const hDivider = BABYLON.MeshBuilder.CreateBox("windowHDivider", {
        width: width,
        height: frameThickness * 0.5,
        depth: frameDepth
    }, scene);
    hDivider.material = windowFrameMat;
    hDivider.position = new BABYLON.Vector3(position.x, position.y, position.z);
    hDivider.rotation.y = rotation;
    
    const archRadius = width / 2;
    const archSegments = 16;
    for (let i = 0; i <= archSegments; i++) {
        const t = i / archSegments;
        let x, y;
        if (t <= 0.5) {
            const localAngle = Math.PI * (t * 2);
            x = -archRadius + archRadius * (1 - Math.cos(localAngle));
            y = archRadius * Math.sin(localAngle) * 0.8;
        } else {
            const localAngle = Math.PI * ((t - 0.5) * 2);
            x = archRadius * Math.cos(localAngle);
            y = archRadius * Math.sin(Math.PI - localAngle) * 0.8;
        }
        
        const archPiece = BABYLON.MeshBuilder.CreateBox("archPiece" + i, {
            width: frameThickness * 0.6,
            height: frameThickness * 0.6,
            depth: frameDepth
        }, scene);
        archPiece.material = windowFrameMat;
        
        if (rotation === Math.PI / 2) {
            archPiece.position = new BABYLON.Vector3(position.x, position.y + height / 2 + y, position.z + x);
        } else if (rotation === -Math.PI / 2) {
            archPiece.position = new BABYLON.Vector3(position.x, position.y + height / 2 + y, position.z - x);
        } else {
            archPiece.position = new BABYLON.Vector3(position.x + x, position.y + height / 2 + y, position.z);
        }
        archPiece.rotation.y = rotation;
    }
}

function createBigWindows(scene, churchWidth, churchDepth, numPillars, pillarSpacing) {
    for (let i = 0; i < numPillars - 1; i++) {
        const zPos = -churchDepth / 2 + pillarSpacing * (i + 1.5);
        
        createBigWindow(scene,
            new BABYLON.Vector3(-churchWidth / 2 + 0.3, 5, zPos),
            Math.PI / 2, 5, 6
        );
        
        createBigWindow(scene,
            new BABYLON.Vector3(churchWidth / 2 - 0.3, 5, zPos),
            -Math.PI / 2, 5, 6
        );
    }
}

// Rose window at the back
function createRoseWindow(scene, churchDepth) {
    const roseWindowMat = new BABYLON.StandardMaterial("roseWindowMat", scene);
    roseWindowMat.emissiveColor = new BABYLON.Color3(0.6, 0.3, 0.5);
    roseWindowMat.alpha = 0.8;
    
    const roseWindow = BABYLON.MeshBuilder.CreateDisc("roseWindow", {
        radius: 4,
        tessellation: 64
    }, scene);
    roseWindow.material = roseWindowMat;
    roseWindow.position = new BABYLON.Vector3(0, 11, -churchDepth / 2 + 0.3);
    roseWindow.rotation.y = Math.PI;

    for (let r = 1; r <= 3; r++) {
        const ringMat = new BABYLON.StandardMaterial("ringMat" + r, scene);
        const hue = r * 0.3;
        ringMat.emissiveColor = new BABYLON.Color3(0.5 + hue * 0.3, 0.2 + hue * 0.2, 0.6 - hue * 0.2);
        ringMat.alpha = 0.75;
        
        const ring = BABYLON.MeshBuilder.CreateTorus("roseRing" + r, {
            diameter: 8 - r * 2,
            thickness: 0.3,
            tessellation: 48
        }, scene);
        ring.material = ringMat;
        ring.position = new BABYLON.Vector3(0, 11, -churchDepth / 2 + 0.35);
        ring.rotation.x = Math.PI / 2;
    }
}
