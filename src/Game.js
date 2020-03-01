import World from './World';
import Vector2d from './Vector2d';
class Game {
    constructor() {
        this.canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.canvas.width = window.innerWidth / 2;
        this.ctx.canvas.height = window.innerHeight / 2;

        this.target = new Vector2d(
            this.ctx.canvas.width / 2,
            this.ctx.canvas.height / 2
        );

        this.timestamp = {
            previous: null,
            current: null,
            delta: null,
        };
    }
    init() {
        this.world = new World(this);

        // Mouse click
        document.addEventListener('mousedown', e => {
            this.target = {
                x: e.clientX - this.ctx.canvas.offsetLeft,
                y: e.clientY - this.ctx.canvas.offsetTop,
            };
        });

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
            this.world.draw();
            // Tick
            requestAnimationFrame(tick);
        };
        tick();
    }
}

export default Game;
