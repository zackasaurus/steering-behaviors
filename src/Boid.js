import Matter from 'matter-js';
import Vector2d from './Vector2d';
class Box {
    constructor(world, x, y, w, h, color) {
        this.world = world;
        this.game = this.world.game;
        this.ctx = this.world.ctx;
        this.body = Matter.Bodies.rectangle(x, y, w, h);
        this.body.friction = 1;
        this.body.restitution = 0;
        this.w = w;
        this.h = h;
        this.color = color;
        Matter.World.add(this.world.boxes, this.body);

        this.vel = new Vector2d(0, 0);
        this.acc = new Vector2d();
        // Weights
        this.weights = {
            approach: 3,
            separate: 8,
            alignment: 3,
            cohesion: 0.5,
        };
        // Max
        this.max = {
            total: {
                speed: {
                    min: 1,
                    max: 4,
                },
            },
            cohesion: {
                radius: 100,
            },
            alignment: {
                radius: 50,
            },
            separation: {
                radius: 20,
            },
            neighbor: {
                radius: 100,
            },
            approach: {
                decay: 8000, // ms
                radius: 100,
            },

            speed: 5,
            force: 0.05,
            rotation: 0.5, // radians
            // rotationForce: 0.1,
        };
    }
    draw() {
        // const { position, angle } = this.body;
        // // console.log(angle);
        // this.ctx.save();
        // this.ctx.beginPath();
        // this.ctx.translate(position.x, position.y);
        // this.ctx.rotate(angle);
        // this.ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
        // this.ctx.fillStyle = 'white';
        // this.ctx.fill();
        // this.ctx.strokeStyle = this.color;
        // this.ctx.lineWidth = 5;
        // this.ctx.stroke();
        // this.ctx.closePath();
        // this.ctx.restore();
    }
    approach(weight = 1) {
        // Set desired
        const desired = new Vector2d();
        desired.add(this.game.target.pos);
        desired.subtract(this.body.position);

        // Get distance
        const distance = desired.length();

        // Normalize desired after getting initial distance
        desired.normalize();

        // console.log(desired);

        // Approach radius
        if (distance < this.max.approach.radius) {
            desired.multiply(
                (distance / this.max.approach.radius) ** 1 * this.max.speed
            );
        } else {
            desired.multiply(this.max.speed);
        }
        // desired.multiply(this.max.speed);
        // Steer force
        const steer = new Vector2d();
        steer.add(desired);
        steer.subtract(this.body.velocity);

        if (steer.length() > this.max.force) {
            steer.normalize(this.max.force);
        }
        steer.multiply(weight);
        // console.log(this.vel);
        return steer;
    }
    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // Reset acceleration
        this.acc.multiply(0);

        this.applyForce(this.approach(0.2));
        // console.log(this.acc);

        this.body.force = this.acc;

        // Matter.Body.update(this.body, 1 / 60, );

        // this.vel.add(this.acc);
        // this.body.angularVelocity = 0;

        // Matter.Body.create({
        //     force: this.acc,
        // });
        // Matter.Body.set(this.body, )
        // Matter.Body.setVelocity(this.body, this.vel);
    }
}
export default Box;
