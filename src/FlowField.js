import Vector2d from './Vector2d';

class FlowField {
    constructor(world) {
        this.world = world;
        this.max = false;
        this.data = [];
    }
    draw() {
        const { ctx } = this.world;
        const { width, height } = this.world.game.ctx.canvas;
        const { rows, cols } = this.world.game.config.grid;

        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                ctx.fillText(
                    this.data[i][j].value,
                    i * (width / rows),
                    (j + 1) * (height / cols)
                );
            }
        }
    }
    update() {
        // only update if target has changed
        const { width, height } = this.world.game.ctx.canvas;
        const { rows, cols } = this.world.game.config.grid;
        const { target } = this.world.game;
        const { terrain } = this.world;

        this.data = [];
        for (let i = 0; i < rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < cols; j++) {
                if (terrain.data[i][j] === 1) {
                    this.data[i][j] = {
                        value: this.max,
                    };
                } else {
                    this.data[i][j] = {
                        value: null,
                    };
                }
            }
        }

        this.path = {
            end: {
                distance: 0,
                x: Math.floor(target.pos.x / (width / rows)),
                y: Math.floor(target.pos.y / (height / cols)),
            },
        };

        const queue = [];
        let value = 0;
        const visited = [];

        this.data[this.path.end.x][this.path.end.y].value = 0;

        queue.push({ x: this.path.end.x, y: this.path.end.y });

        while (queue.length > 0) {
            const current = queue.shift();
            // value++;

            // Add neighbors
            const neighbors = {
                north: {
                    x: current.x,
                    y: current.y - 1,
                },
                south: {
                    x: current.x,
                    y: current.y + 1,
                },
                west: {
                    x: current.x - 1,
                    y: current.y,
                },
                east: {
                    x: current.x + 1,
                    y: current.y,
                },
            };
            const vector = new Vector2d();

            // Set value
            Object.keys(neighbors).forEach(direction => {
                if (
                    this.data[neighbors[direction].x] &&
                    this.data[neighbors[direction].x][neighbors[direction].y]
                ) {
                    if (
                        this.data[neighbors[direction].x][
                            neighbors[direction].y
                        ].value === null
                    ) {
                        const value = this.data[current.x][current.y].value;
                        this.data[neighbors[direction].x][
                            neighbors[direction].y
                        ].value = value + 1;

                        queue.push(neighbors[direction]);
                    }

                    // Set vector
                    if (
                        !this.data[neighbors[direction].x][
                            neighbors[direction].y
                        ].value
                    ) {
                    }
                }
            });

            // const vector = new Vector2d();
            // if(data[])
        }
    }
}
export default FlowField;
