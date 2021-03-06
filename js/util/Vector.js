/**
 * Represents a vector
 * @constructor
 * @param  {number} x - X coordinate
 * @param  {number} y - Y coordinate
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
}
/**
 * @param  {Vector} vec - vector to add
 */
Vector.prototype.add = function(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
};

Vector.prototype.minus = function(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
};

Vector.prototype.scale = function(scalar) {
    return new Vector(scalar * this.x, this.y * scalar);
}