var Geometry;
(function (Geometry) {
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    Geometry.Point = Point;
    function degreesToRadians(angle) {
        return angle * Math.PI / 180;
    }
    Geometry.degreesToRadians = degreesToRadians;
    function radiansToDegrees(angle) {
        return angle * 180 / Math.PI;
    }
    Geometry.radiansToDegrees = radiansToDegrees;
})(Geometry || (Geometry = {}));
//# sourceMappingURL=geometry.js.map