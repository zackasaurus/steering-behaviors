import Element from './Element';

class World {
    constructor(game) {
        this.game = game;
        this.elements = {
            current: {
                id: 0,
            },
            total: 5,
            data: {},
        };

        for (let i = 0; i < this.elements.total; i++) {
            this.elements.data[this.elements.current.id++] = new Element(this);
        }
    }
    draw() {
        Object.keys(this.elements.data).forEach(item => {
            this.elements.data[item].draw();
        });
    }

    update() {
        Object.keys(this.elements.data).forEach(item => {
            this.elements.data[item].update();
        });
    }
}

export default World;
