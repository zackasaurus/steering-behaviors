import Vector2d from './Vector2d';

class FlowField {
    constructor(world) {
        this.world = world;
        this.max = false;
        this.data = [];
        this.vectors = [];
    }
    draw() {
        const { ctx } = this.world;
        const { width, height } = this.world.game.ctx.canvas;
        const { rows, cols } = this.world.game.config.grid;

        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // ctx.fillText(
                //     this.data[i][j].value,
                //     i * (width / rows),
                //     (j + 1) * (height / cols)
                // );

                ctx.beginPath();
                ctx.lineWidth = '1';
                ctx.strokeStyle = 'blue';
                const x = i * (width / rows);
                const y = j * (height / cols);
                if (this.vectors[i][j].value) {
                    ctx.moveTo(x + width / rows / 2, y + height / cols / 2);
                    ctx.lineTo(
                        x +
                            width / rows / 2 -
                            (this.vectors[i][j].value.x * (width / rows)) / 4,
                        y +
                            height / cols / 2 -
                            (this.vectors[i][j].value.y * (height / cols)) / 4
                    );
                }

                ctx.stroke();
                ctx.closePath();
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
                        direction: null,
                    };
                } else {
                    this.data[i][j] = {
                        value: null,
                        direction: null,
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
                    // if (
                    //     !this.data[neighbors[direction].x][
                    //         neighbors[direction].y
                    //     ].value
                    // ) {
                    // }
                }
            });

            // const vector = new Vector2d();
            // if(data[])
        }

        // Calc vector

        const points = [
            new Vector2d(0, 1),
            new Vector2d(0, -1),
            new Vector2d(1, 0),
            new Vector2d(-1, 0),
            new Vector2d(1, 1),
            new Vector2d(1, -1),
            new Vector2d(-1, 1),
            new Vector2d(-1, -1),
        ];

        for (let i = 0; i < rows; i++) {
            this.vectors[i] = [];
            for (let j = 0; j < cols; j++) {
                this.vectors[i][j] = {
                    value: {
                        x: null,
                        y: null,
                    },
                };
            }
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // No value
                if (!this.data[i][j]) {
                    continue;
                }
                // console.log('g');
                const pos = new Vector2d(i, j);

                let min = null;
                let minDist = 0;
                points.forEach(item => {
                    let dist =
                        this.data[i - item.x] &&
                        this.data[i - item.x][j - item.y] &&
                        this.data[i - item.x][j - item.y].value !== false &&
                        this.data[i - item.x][j - item.y].value -
                            this.data[i][j].value;

                    // console.log(dist);
                    // console.log(this.data[i][j].value);
                    if (dist < minDist) {
                        min = item;
                        minDist = dist;
                    }
                });
                // console.log(min);

                if (min !== null) {
                    // console.log(min);
                    // console.log(pos);
                    // min = min.subtract(pos);
                    // console.log(min);
                    // min.normalize();
                    // console.log(min);
                    this.vectors[i][j].value = min;
                }

                // console.log(this.vectors[i][j].value);
            }
        }
        // console.log(this.vectors[10][10].value);
    }
}
export default FlowField;
