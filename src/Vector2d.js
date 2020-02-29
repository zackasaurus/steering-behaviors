// Lenght of vector
export const length = vector => {
    return (Math.abs(vector.x) ** 2 + Math.abs(vector.y) ** 2) ** 0.5;
};
// Normailize vector
export const normalize = (vector, scalar) => {
    return {
        x: (vector.x * scalar) / length(vector),
        y: (vector.y * scalar) / length(vector),
    };
};
// Multiply Vector
export const multiply = (vector, scalar) => {
    return {
        x: vector.x * scalar,
        y: vector.y * scalar,
    };
};
