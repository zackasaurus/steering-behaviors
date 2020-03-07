import Vector2d from './Vector2d';

class Target {
    constructor(pos, game) {
        this.pos = new Vector2d(pos.x, pos.y);
        this.game = game;
        this.ctx = this.game.ctx;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, 20, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
export default Target;
