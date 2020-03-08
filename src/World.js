import Element from './Element';
import Terrain from './Terrain';
import FlowField from './FlowField';
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
        this.flowField = new FlowField(this);
    }
    draw() {
        this.terrain.draw();
        this.flowField.draw();

        Object.keys(this.elements.data).forEach(item => {
            this.elements.data[item].draw();
        });
    }

    update() {
        this.flowField.update();

        Object.keys(this.elements.data).forEach(item => {
            this.elements.data[item].update();
        });
    }
}

export default World;
