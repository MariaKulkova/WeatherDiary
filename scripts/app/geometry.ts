namespace Geometry {

    export class Point {
        x: number
        y: number

        constructor(x: number,
                    y: number) {
        this.x = x
        this.y = y
        }
    }

    export function degreesToRadians(angle: number): number {
      return angle * Math.PI / 180
    }

    export function radiansToDegrees(angle: number): number {
      return angle * 180 / Math.PI
    }
}