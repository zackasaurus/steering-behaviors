const SimplexNoise = require('simplex-noise'),
    simplex = new SimplexNoise(Math.random);

class Terrain {
    constructor(world) {
        this.world = world;
        this.ctx = this.world.ctx;
        this.ctx.imageSmoothingEnabled = false;
        this.data = [];

        // Move to server
        const { rows, cols } = this.world.game.config.grid;
        let buffer = 10;
        let rand = 0.005;
        let step = 25;

        for (let i = 0; i < rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < cols; j++) {
                let noise = (simplex.noise2D(i / step, j / step) + 1) / 2;
                let boundary = 0;

                if (noise > 0.65) {
                    boundary = 1;
                } else {
                    boundary = 0;
                }
                this.data[i][j] = boundary;
            }
        }

        // Keep this on the client
        const terrainImage = document.createElement('CANVAS');
        const ctx = terrainImage.getContext('2d');
        ctx.canvas.width = rows;
        ctx.canvas.height = cols;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.data[i][j] === 1) {
                    ctx.fillStyle = 'silver';
                    ctx.fillRect(i, j, 1, 1);
                }
            }
        }
        this.image = new Image();
        this.image.src = terrainImage.toDataURL('image/png');
    }

    draw() {
        const { width, height } = this.ctx.canvas;
        this.ctx.drawImage(this.image, 0, 0, width, height);
    }
}
export default Terrain;
