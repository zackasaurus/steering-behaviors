import Element from './Element';

class Game {
    constructor() {
        this.canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.canvas.width = window.innerWidth / 2;
        this.ctx.canvas.height = window.innerHeight / 2;

        this.target = {
            x: this.ctx.canvas.width / 2,
            y: this.ctx.canvas.height / 2,
        };
    }
    init() {
        this.element = new Element(this);

        // Mouse click
        document.addEventListener('mousedown', e => {
            this.target = {
                x: e.clientX - this.ctx.canvas.offsetLeft,
                y: e.clientY - this.ctx.canvas.offsetTop,
            };
        });

        const tick = () => {
            // Update
            this.element.update();
            // Clear
            this.ctx.clearRect(
                0,
                0,
                this.ctx.canvas.width,
                this.ctx.canvas.height
            );
            // Draw
            this.element.draw();
            // Tick
            requestAnimationFrame(tick);
        };
        tick();
    }
}

export default Game;
