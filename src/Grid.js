class Grid {
    constructor(game) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.x = this.game.config.grid.x;
        this.y = this.game.config.grid.y;
    }
    draw() {
        // Horizontal Lines
        // for (let i = 0; i < 1000; i += ) {
        //     ctx.beginPath();
        //     ctx.moveTo(-start.x, i - start.y + offset.y);
        //     ctx.lineTo(canvasW - start.x - end.x * gap, i - start.y + offset.y);
        //     ctx.lineWidth = gap / 10;
        //     ctx.strokeStyle = color;
        //     ctx.stroke();
        // }
        // Vertical Lines
        // for (let i = 0; i < canvasW - 1 - end.x * gap; i += gap) {
        //     ctx.beginPath();
        //     ctx.moveTo(i - start.x + offset.x, -start.y);
        //     ctx.lineTo(i - start.x + offset.x, canvasH - start.y - end.y * gap);
        //     ctx.lineWidth = gap / 10;
        //     ctx.strokeStyle = color;
        //     ctx.stroke();
        // }
        // console.log(this.x);
    }
}
export default Grid;
