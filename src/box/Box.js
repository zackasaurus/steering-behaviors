import Matter from 'matter-js';
import Vector2d from '../Vector2d';
class Box {
    constructor(world, id, x, y, w, h, color) {
        this.world = world;
        this.game = this.world.game;
        this.ctx = this.world.ctx;

        // matter-js
        this.body = Matter.Bodies.rectangle(x, y, w, h);
        // matter-js config
        this.body.friction = 1;
        this.body.restitution = 0;
        this.body.slop = 0;

        // dimensions
        this.id = id;
        this.w = w;
        this.h = h;
        this.color = color;

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
                radius: 50,
            },
            neighbor: {
                radius: 100,
            },
            approach: {
                decay: 8000, // ms
                radius: 200,
            },

            speed: 5,
            force: 0.01,
            rotation: 0.5, // radians
            // rotationForce: 0.1,
        };

        // Add boxes to matter engine
        Matter.World.add(this.world.boxes, this.body);
    }
    draw() {
        // Rectangle - get coordinates from matter-js
        const { position, angle } = this.body;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(position.x, position.y);
        this.ctx.rotate(angle);
        this.ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
        this.ctx.rect(-this.w / 2, -this.h + 25, this.w, this.h / 5);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
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

        // Approach radius
        if (distance < this.max.approach.radius) {
            desired.multiply(
                (distance / this.max.approach.radius) ** 1 * this.max.speed
            );
        } else {
            desired.multiply(this.max.speed);
        }

        // Calculate steer force
        const steer = new Vector2d();
        steer.add(desired);
        steer.subtract(this.body.velocity);

        if (steer.length() > this.max.force) {
            steer.normalize(this.max.force);
        }
        steer.multiply(weight);
        return steer;
    }
    separate(weight = 1) {
        const sum = new Vector2d();
        this.position = new Vector2d();
        this.position.add(this.body.position);
        let count = 0;
        // WIP - needs to use a spatial hash map for detection instead, otherwise it's O(n ** 2) brute force
        this.world.boxList.forEach((item) => {
            // console.log(item);
            // console.log(this.id);
            const { position, id } = item.body;
            // console.log(id);
            //
            let distance = this.position.distance(position);
            // console.log(distance);

            if (this.id !== id && distance < this.max.separation.radius) {
                // console.log('d');
                const difference = new Vector2d();
                difference.add(this.position);
                difference.subtract(position);
                difference.divide(distance);
                sum.add(difference);
                count++;
            }
        });
        // console.log(count);
        // const distance = this.position.distance(this.game.target.pos);
        // console.log(distance);
        if (count > 0) {
            sum.divide(count);
            sum.normalize();
            sum.subtract(this.body.velocity);
            sum.limit(this.max.force);
        }
        // console.log(sum);
        sum.multiply(weight);
        // console.log(sum);
        return sum;
    }
    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // console.log(this.body.position);
        // this.position = new Vector2d(
        //     this.body.position.x,
        //     this.body.position.y
        // );
        // Reset acceleration
        this.acc.multiply(0);

        this.applyForce(this.approach(0.2));
        // this.applyForce(this.separate(0.2));
        // console.log(this.acc);
        // console.log(this.acc);
        this.body.force = this.acc;
        // console.log(this.body);

        // Set torque
        const desired = new Vector2d();
        desired.add(this.game.target.pos);
        desired.subtract(this.body.position);
        const angle = Math.PI / 2 - desired.angle();
        // console.log(angle);
        // console.log(this.body.angle);
        // add conversion
        const torque = 0.05;
        const maxSteerForce = 0.1;
        let steer = Math.abs(this.body.angle - angle);
        if (steer > maxSteerForce) {
            steer = maxSteerForce;
        }
        if (this.body.angle > angle) {
            Matter.Body.setAngularVelocity(this.body, -steer);
        } else {
            Matter.Body.setAngularVelocity(this.body, steer);
        }
    }
}
export default Box;
