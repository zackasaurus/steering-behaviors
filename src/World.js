import Matter from 'matter-js';
import Element from './Element';
import Terrain from './Terrain';
import FlowField from './FlowField';
import Box from './box/Box';
class World {
    constructor(game) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.elements = {
            current: {
                id: 0,
            },
            total: this.game.config.elements.total,
            data: {},
        };

        for (let i = 0; i < this.elements.total; i++) {
            this.elements.data[this.elements.current.id] = new Element(
                this,
                this.elements.current.id++
            );
        }

        // Terrain
        this.terrain = new Terrain(this);
        // Flowfield
        // this.flowField = new FlowField(this);
        this.boxes = this.game.engine.world;
        // this.box1 = Matter.Bodies.rectangle(400, 200, 80, 80);
        // console.log(this.box1);
        // this.box = new Box(this, 100, 100, 50, 80, 'red');

        // this.box1 = new Box(this, 200, 200, 50, 50, 'blue');

        this.boxList = [];

        for (let i = 0; i < 10; i++) {
            this.boxList.push(
                new Box(
                    this,
                    i + 1,
                    Math.random() * this.ctx.canvas.width,
                    Math.random() * this.ctx.canvas.height,
                    20,
                    50,
                    'coral'
                )
            );
        }

        // console.log(this.box);

        // Matter.World.add(this.boxes, this.box);
    }
    draw() {
        this.boxList.forEach((item) => item.draw());
        // this.terrain.draw();
        // this.flowField.draw();

        // Object.keys(this.elements.data).forEach(item => {
        //     this.elements.data[item].draw();
        // });

        // this.box.draw();
        // this.box1.draw();
        // this.ctx.rect(this.box1.position.x, this.box1.position.y, 80, 80);
        // this.ctx.fill();
    }

    update() {
        this.boxList.forEach((item) => item.update());

        // this.boxList.forEach((item) => console.log(item.body));
        // this.flowField.update();
        // this.box.update();
        Object.keys(this.elements.data).forEach((item) => {
            this.elements.data[item].update();
        });
    }
}

export default World;
