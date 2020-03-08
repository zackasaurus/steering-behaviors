import Vector2d from './Vector2d';
class Element {
    constructor(world, id) {
        this.world = world;
        this.id = id;
        this.game = this.world.game;
        this.ctx = this.game.ctx;

        // Constants

        // Weights
        this.weights = {
            approach: 3,
            separate: 5,
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
                radius: 300,
            },

            speed: 5,
            force: 0.1,
            rotation: 0.05, // radians
        };

        this.inside = 0;
        this.entropy = false;
        // Physics
        this.pos = new Vector2d(
            Math.random() * this.ctx.canvas.width,
            Math.random() * this.ctx.canvas.height
        );
        this.vel = new Vector2d(0, 0.1);
        this.acc = new Vector2d();

        // Orientation
        this.orientation = new Vector2d(-1, 0);

        // Draw
        this.size = 10;
        this.lineSize = 15;
    }
    draw() {
        // Turret
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.translate(this.pos.x, this.pos.y);
        this.ctx.rotate(-this.vel.angle());

        this.ctx.arc(this.size / 2, 0, this.size / 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        // Base
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.size / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'orangered';
        this.ctx.fill();
        this.ctx.closePath();

        // Line
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
        desired.add(this.game.target.pos);
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
        desired.add(this.game.target.pos);
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
        const distance = this.pos.distance(this.game.target.pos);
        if (count > 0) {
            sum.divide(count);
            sum.normalize();

            // Approach added
            if (distance < this.max.approach.radius) {
                sum.multiply(
                    (distance / this.max.approach.radius) ** 2 * this.max.speed
                );
            } else {
                sum.multiply(this.max.speed);
            }

            sum.subtract(this.vel);
            sum.limit(this.max.force);
        }

        sum.multiply(weight);
        return sum;
    }
    alignment(weight = 1) {
        const sum = new Vector2d();
        let count = 0;
        // WIP - needs to use a spatial hash map for detection instead, otherwise it's O(n ** 2) brute force
        Object.keys(this.world.elements.data).forEach(item => {
            const { pos, vel } = this.world.elements.data[item];

            let distance = this.pos.distance(pos);

            if (distance > 0 && distance < this.max.alignment.radius) {
                sum.add(vel);
                count++;
            }
        });
        const distance = this.pos.distance(this.game.target.pos);
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
        } else {
            return new Vector2d();
        }

        sum.multiply(weight);
        return sum;
    }
    cohesion(weight = 1) {
        const sum = new Vector2d();
        let count = 0;
        // WIP - needs to use a spatial hash map for detection instead, otherwise it's O(n ** 2) brute force
        Object.keys(this.world.elements.data).forEach(item => {
            const { pos } = this.world.elements.data[item];

            let distance = this.pos.distance(pos);

            if (distance > 0 && distance < this.max.cohesion.radius) {
                sum.add(pos);
                count++;
            }
        });
        if (count > 0) {
            sum.divide(count);

            const desired = new Vector2d();
            desired.add(sum);
            desired.subtract(this.pos);

            desired.normalize(this.max.speed);
            // Steer force
            const steer = new Vector2d();
            steer.add(desired);
            steer.subtract(this.vel);

            steer.limit(this.max.force);

            const distance = this.pos.distance(this.game.target.pos);

            // if (steer.length() > this.max.force) {
            //     steer.normalize(this.max.force);
            // }
            steer.multiply(weight);
            return steer;

            // sum.normalize();

            // Approach added
            // if (distance < this.max.approach.radius) {
            //     sum.multiply(
            //         (distance / this.max.approach.radius) * this.max.speed
            //     );
            // } else {
            //     sum.multiply(this.max.speed);
            // }

            // sum.subtract(this.vel);
            // sum.limit(this.max.force);
        } else {
            return new Vector2d();
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }
    applyVelocity() {
        const desired = new Vector2d();
        desired.add(this.vel);
        desired.add(this.acc);
        // console.log(this.v);
        const angle = this.vel.angle(desired); // in radians

        if (Math.abs(angle) > this.max.rotation) {
            // console.log('gg');
            // set rotate based off of angle
            if (angle < 0) {
                this.vel.rotate(-this.max.rotation);
            } else {
                this.vel.rotate(this.max.rotation);
            }

            this.vel.normalize(desired.length());
        } else {
            this.vel.add(this.acc);
        }
    }
    update() {
        // Reset acceleration
        this.acc.multiply(0);

        // Apply forces
        this.applyForce(this.approach(this.weights.approach));
        this.applyForce(this.separate(this.weights.separate));
        this.applyForce(this.alignment(this.weights.alignment));
        this.applyForce(this.cohesion(this.weights.cohesion));
        // Set Velocity
        this.applyVelocity();
        // this.vel.add(this.acc);

        // Set Position
        this.pos.add(this.vel);
    }
}

export default Element;
