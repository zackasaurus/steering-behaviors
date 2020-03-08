class Grid {
    constructor(game) {
        this.game = game;
        this.ctx = this.game.ctx;
        // width = this.game.ctx.canvas.width;
        // this.rows = this.game.config.grid.rows;
        // this.cols = this.game.config.grid.cols;
    }
    draw() {
        const { rows, cols } = this.game.config.grid;
        const { width, height } = this.game.ctx.canvas;
        const color = '#00000020';

        // Rows
        for (let i = 0.5; i < width; i += width / rows) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(width, i);
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = color;
            this.ctx.closePath();
        }

        // Columns
        for (let i = 0.5; i < height; i += height / cols) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, height);
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = color;
            this.ctx.closePath();
        }
    }
}
export default Grid;
