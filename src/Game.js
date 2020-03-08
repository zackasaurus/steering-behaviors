import Config from './config';

import Grid from './Grid';
import World from './World';
import Target from './Target';
class Game {
    constructor() {
        this.config = Config;

        this.canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');

        this.ctx.imageSmoothingEnabled = false;

        this.ctx.canvas.width = this.config.canvas.width;
        this.ctx.canvas.height = this.config.canvas.height;

        this.canvas.width = this.config.canvas.width;
        this.canvas.height = this.config.canvas.height;

        this.canvas.style.visibility = 'visible';
        this.canvas.style.opacity = 1;

        // this.timestamp = {
        //     previous: null,
        //     current: null,
        //     delta: null,
        // };
    }
    init() {
        this.grid = new Grid(this);

        this.target = new Target(
            {
                x: this.ctx.canvas.width / 2,
                y: this.ctx.canvas.height / 2,
            },
            this
        );

        this.world = new World(this);

        // Mouse down
        document.addEventListener('mousedown', e => {
            const { width, height, offsetLeft, offsetTop } = this.ctx.canvas;

            // Get position
            const pos = {
                x: e.clientX - offsetLeft,
                y: e.clientY - offsetTop,
            };

            // Set Boundaries
            if (pos.x < width && pos.x >= 0 && pos.y < height && pos.y >= 0) {
                this.target.pos = pos;
            }
        });
        // Resize window
        // window.addEventListener('resize', e => {
        //     this.ctx.canvas.width = window.innerWidth;
        //     this.ctx.canvas.height = window.innerHeight;
        // });

        // Time WIP
        // this.timestamp.current = Date.now();

        const tick = () => {
            // Time WIP
            // this.delta = timestamp - Date.now();
            // Update
            this.world.update();
            // Clear
            this.ctx.clearRect(
                0,
                0,
                this.ctx.canvas.width,
                this.ctx.canvas.height
            );
            // Draw
            this.grid.draw();
            this.target.draw();
            this.world.draw();
            // Tick
            requestAnimationFrame(tick);
        };
        tick();
    }
}

export default Game;
