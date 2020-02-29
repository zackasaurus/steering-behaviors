import { normalize, multiply, length } from './Vector2d';

class Element {
    constructor(game) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.max = {
            approach: {
                radius: 100,
            },
            speed: 4,
            force: 0.1,
        };

        this.pos = {
            x: 50,
            y: 50,
        };
        this.vel = {
            x: 0,
            y: 0,
        };
        this.acc = {
            x: 0,
            y: 0,
        };
        this.desired = {
            x: null,
            y: null,
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
    seek() {
        this.desired.x = this.game.target.x - this.pos.x;
        this.desired.y = this.game.target.y - this.pos.y;

        this.desired = normalize(this.desired, this.max.speed);
        let steer = {
            x: this.desired.x - this.vel.x,
            y: this.desired.y - this.vel.y,
        };
        if (length(steer) > this.max.force) {
            steer = normalize(steer, this.max.force);
        }
        return steer;
    }
    approach() {
        this.desired.x = this.game.target.x - this.pos.x;
        this.desired.y = this.game.target.y - this.pos.y;

        let distance = length(this.desired);

        this.desired = normalize(this.desired, 1);
        // Approach radius
        if (distance < this.max.approach.radius) {
            this.desired = multiply(
                this.desired,
                (distance / this.max.approach.radius) * this.max.speed
            );
        } else {
            this.desired = multiply(this.desired, this.max.speed);
        }

        let steer = {
            x: this.desired.x - this.vel.x,
            y: this.desired.y - this.vel.y,
        };
        if (length(steer) > this.max.force) {
            steer = normalize(steer, this.max.force);
        }
        return steer;
    }
    update() {
        // Acceleration
        this.acc = this.approach();

        // Velocity
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        if (length(this.vel) > this.max.speed) {
            this.vel = normalize(this.vel, this.max.speed);
        }

        // Position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Boundaries
        this.pos.x > this.ctx.canvas.width ? this.ctx.canvas.width : this.pos.x;
    }
}

export default Element;
