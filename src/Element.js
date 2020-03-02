import Vector2d from './Vector2d';
class Element {
    constructor(world, id) {
        this.world = world;
        this.id = id;
        this.game = this.world.game;
        this.ctx = this.game.ctx;
        // Constants

        this.max = {
            total: {
                speed: {
                    min: 1,
                    max: 4,
                },
            },
            separation: {
                radius: 25,
            },
            neighbor: {
                radius: 100,
            },
            approach: {
                decay: 8000, // ms
                radius: 300,
            },

            speed: 4,
            force: 0.1,
        };

        this.inside = 0;
        this.entropy = false;
        // Physics
        this.pos = new Vector2d(
            Math.random() * this.ctx.canvas.width,
            Math.random() * this.ctx.canvas.height
        );
        this.vel = new Vector2d();
        this.acc = new Vector2d();

        // Weights
        this.weights = {
            approach: 1,
            separate: 5,
        };
        // Draw
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

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.pos.x, this.pos.y);
        // this.ctx.lineTo(
        //     this.pos.x + this.vel.x * this.lineSize,
        //     this.pos.y + this.vel.y * this.lineSize
        // );
        // this.ctx.stroke();
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
    approach(weight = 1) {
        // Set desired
        const desired = new Vector2d();
        desired.add(this.game.target);
        desired.subtract(this.pos);

        // Get distance
        const distance = desired.length();

        // Normalize desired after getting initial distance
        desired.normalize();

        // Approach radius
        if (distance < this.max.approach.radius) {
            desired.multiply(
                (distance / this.max.approach.radius) ** 2 * this.max.speed
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
    separate(weight = 1) {
        const sum = new Vector2d();
        let count = 0;
        // WIP - needs to use a spatial hash map for detection instead, otherwise it's O(n ** 2) brute force
        Object.keys(this.world.elements.data).forEach(item => {
            const { pos } = this.world.elements.data[item];

            let distance = this.pos.distance(pos);

            if (distance > 0 && distance < this.max.separation.radius) {
                const difference = new Vector2d();
                difference.add(this.pos);
                difference.subtract(pos);
                difference.divide(distance);
                sum.add(difference);
                count++;
            }
        });
        const distance = this.pos.distance(this.game.target);
        if (count > 0) {
            sum.divide(count);
            sum.normalize();

            // Approach added
            if (distance < this.max.approach.radius) {
                sum.multiply(
                    (distance / this.max.approach.radius) * this.max.speed
                );
            } else {
                sum.multiply(this.max.speed);
            }

            sum.subtract(this.vel);
            sum.limit(this.max.force);
        }

        // Set desired
        // const desired = new Vector2d();
        // desired.add(this.game.target);
        // desired.subtract(this.pos);

        // // Get distance
        // const distance = desired.length();

        // // Normalize desired after getting initial distance
        // desired.normalize();

        // // Approach radius
        // if (distance < this.max.approach.radius) {
        //     desired.multiply(
        //         (distance / this.max.approach.radius) * this.max.speed
        //     );
        // } else {
        //     desired.multiply(this.max.speed);
        // }
        // sum.multiply(this.approach());

        sum.multiply(weight);
        return sum;
    }

    applyForce(force) {
        this.acc.add(force);
    }
    update() {
        // Reset acceleration
        this.acc.multiply(0);

        // Apply forces
        this.applyForce(this.approach(this.weights.approach));
        this.applyForce(this.separate(this.weights.separate));

        // Entropy ?
        if (this.entropy) {
            if (
                this.pos.distance(this.game.target) < this.max.approach.radius
            ) {
                this.inside += 16.6666;
                this.max.speed =
                    this.max.total.speed.max *
                    (1 - this.inside / this.max.approach.decay) ** 1;
                if (this.max.speed < 0) {
                    this.max.speed = 0;
                }
                if (this.max.speed < this.max.total.speed.max) {
                    this.max.speed += this.max.total.speed.min;
                }
            } else {
                this.inside = 0;
                this.max.speed = 4;
            }
        }

        // this.separate();

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
