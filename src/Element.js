import Vector2d from './Vector2d';
class Element {
    constructor(world) {
        this.world = world;
        this.game = this.world.game;
        this.ctx = this.game.ctx;
        this.id = this.world.elements.current.id;
        this.max = {
            separation: {
                radius: 40,
            },
            neighbor: {
                radius: 100,
            },
            approach: {
                radius: 100,
            },
            speed: 4,
            force: 0.1,
        };
        this.pos = new Vector2d(
            Math.random() * this.ctx.canvas.width,
            Math.random() * this.ctx.canvas.height
        );
        this.vel = new Vector2d();
        this.acc = new Vector2d();

        this.desired = {
            x: null,
            y: null,
        };
        this.weights = {
            approach: 1,
        };
        this.size = 15;
        this.lineSize = 15;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.rect(
            this.pos.x - this.size / 2,
            this.pos.y - this.size / 2,
            this.size,
            this.size
        );
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.ctx.lineTo(
            this.pos.x + this.vel.x * this.lineSize,
            this.pos.y + this.vel.y * this.lineSize
        );
        this.ctx.stroke();
    }
    seek(weight) {
        const desired = new Vector2d();
        desired.add(this.game.target);
        desired.subtract(this.pos);

        desired.normalize(this.max.speed);
        // Steer force
        const steer = new Vector2d();
        steer.add(desired);
        steer.subtract(this.vel);

        if (steer.length() > this.max.force) {
            steer.normalize(this.max.force);
        }
        steer.multiply(weight);
        return steer;
    }
    approach(weight) {
        // Set desired
        const desired = new Vector2d();
        desired.add(this.game.target);
        desired.subtract(this.pos);

        // Get distance
        const distance = desired.length();

        desired.normalize();

        // Approach radius
        if (distance < this.max.approach.radius) {
            desired.multiply(
                (distance / this.max.approach.radius) * this.max.speed
            );
        } else {
            desired.multiply(this.max.speed);
        }
        // Steer force
        const steer = new Vector2d();
        steer.add(desired);
        steer.subtract(this.vel);

        if (steer.length() > this.max.force) {
            steer.normalize(this.max.force);
        }
        steer.multiply(weight);
        return steer;
    }
    separate() {
        const sum = new Vector2d();
        let count = 0;
        // WIP - needs to use a spatial hash map for detection instead, otherwise it's O(n ** 2) brute force
        // Object.keys(this.world.elements.data).forEach(item => {
        //     let distance =
        // })
    }
    applyForce(force) {
        this.acc.add(force);
    }
    update() {
        // Reset acceleration
        this.acc.multiply(0);

        // Apply forces
        this.applyForce(this.approach(this.weights.approach));

        // Set Velocity
        this.vel.add(this.acc);

        // Normalize Velocity
        if (this.vel.length() > this.max.speed) {
            this.vel.normalize(this.max.speed);
        }
        // Set Position
        this.pos.add(this.vel);
    }
}

export default Element;
