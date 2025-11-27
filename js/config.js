// Configuration and constants for the 3D gallery

export const CONFIG = {
    // Church dimensions
    church: {
        width: 20,
        height: 18,
        depth: 50,
        naveHeight: 12,
        aisleWidth: 5,
        wallThickness: 0.5
    },
    
    // Picture arc parameters
    pictures: {
        radius: 8,
        height: 2.5,
        width: 2.5,
        imageHeight: 3,
        count: 5,
        files: ["1.png", "2.png", "3.png", "4.png", "5.png"],
        info: [
            { title: "Artwork 1", description: "This is the first stunning piece in our collection. It represents the beginning of a journey through digital art and imagination." },
            { title: "Artwork 2", description: "The second masterpiece explores themes of color and form, creating a visual symphony that captivates the viewer." },
            { title: "Artwork 3", description: "A centerpiece of the exhibition, this work combines traditional techniques with modern digital expression." },
            { title: "Artwork 4", description: "This piece invites contemplation, with layers of meaning hidden within its intricate details." },
            { title: "Artwork 5", description: "The final artwork in our gallery tour, representing the culmination of artistic vision and technical mastery." }
        ]
    },
    
    // Camera settings
    camera: {
        startY: 1.7,
        zoomedRadius: 1.5,
        smoothFactor: 0.05
    },
    
    // Fog settings
    fog: {
        density: 0.02,
        color: { r: 0.1, g: 0.1, b: 0.15 }
    },
    
    // Matrix animation settings
    matrix: {
        textureSize: 512,
        columns: 32,
        chars: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*"
    }
};
