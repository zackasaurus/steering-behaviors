class Vector2d {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(Math.abs(this.x) ** 2 + Math.abs(this.y) ** 2);
    }
    distance(vector) {
        return Math.sqrt(
            Math.abs(this.x - vector.x) ** 2 + Math.abs(this.y - vector.y) ** 2
        );
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    angle(vector = { x: 1, y: 0 }) {
        const cross = this.cross(vector);
        const angle = Math.atan2(Math.abs(cross), this.dot(vector));
        if (cross < 0) {
            return -angle;
        }
        return angle;
    }
    rotate(theta) {
        this.x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
        this.y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
    }
    normalize(scalar = 1) {
        const length = this.length();
        this.x = (this.x * scalar) / length;
        this.y = (this.y * scalar) / length;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }
    limit(force) {
        if (this.length() > force) {
            this.normalize(force);
        }
    }
}

export default Vector2d;
