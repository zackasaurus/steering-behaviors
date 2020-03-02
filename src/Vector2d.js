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

// export const distance = () => {};
export default Vector2d;
