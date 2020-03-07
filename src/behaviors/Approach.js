import Vector2d from '../Vector2d';
class Approach {
    constructor(element) {
        this.element = element;
        this.game = this.element.game;
        this.pos = this.element.pos;
        this.vel = this.element.vel;
        this.max = this.element.max;
    }
    update(weight = 1) {
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
}

export default Approach;
