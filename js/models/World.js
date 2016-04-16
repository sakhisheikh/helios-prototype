/*globals Vector Coin*/

/**
 * Represents world model
 * @constructor
 * @param  {array} map - an array of strings representing the static map
 * @param  {array} entityMap - an array of strings representing the entities on the map
 * @param  {object} backgroundLegend - an object to decode the map characters to tiles
 * @param  {object} entityLegend - an object to decode the entity-map characters to entities
 * @param  {object} intentions - describes user intentions
 */
function World(map, entityMap, backgroundLegend, entityLegend, intentions, obstacles) {
    if (map.length != entityMap.length || map[0].length != entityMap[0].length)
        throw new Error('Entity map and static map sizes do not match');

    //2D array
    var grid = this.grid = [];
    var entities = this.entities = [];
    this.intentions = intentions;
    this.obstacles = obstacles;
    this.height = map.length;
    this.width = map[0].length;

    map.forEach(function(line) {
        var row = [];
        Array.prototype.forEach.call(line, (function(char) {
            row.push(backgroundLegend[char]);
        }));
        grid.push(row);
    });

    entityMap.forEach(function(line, y) {
        Array.prototype.forEach.call(line, (function(entityChar, x) {

            if (entityChar in entityLegend) {
                entities.push(new entityLegend[entityChar](new Vector(x, y)));
            }
        }));
    });
}
World.prototype.dropCoin=function (pos) {
    this.entities.push(new Coin(pos,this));
};
/**
 * detect collisons
 * @param  {Vector} vec
 * @param  {Vector} size
 */
World.prototype.handlingCollisions = function(vec, size) {
    var xStart = Math.floor(vec.x);
    var yStart = Math.floor(vec.y);
    var newPos = vec.add(size);
    var xEnd = Math.ceil(newPos.x);
    var yEnd = Math.ceil(newPos.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0 || yStart > this.height)
        return true;
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            if (this.obstacles.indexOf(this.grid[y][x]) >= 0) {
                return true;
            }
        }
    }
    return false;
};

/**
 * One iteration in the world
 */
World.prototype.cycle = function(step) {
    var self = this;

    while (step > 0) {
        var thisStep = Math.min(this.maxStep, step);
        step -= thisStep;
        this.entities.forEach(function(entity) {
            entity.act(thisStep, self, self.intentions);
        });
    }
};
World.prototype.maxStep = 0.05;