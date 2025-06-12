
export class TransformationMatrix2D {

    private matrix: number[];


    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, e: number = 0, f: number = 0) {
        this.matrix = [a, b, c, d, e, f]
    }

    static identity(): TransformationMatrix2D {
        return new TransformationMatrix2D(1, 0, 0, 1, 0, 0);
    }

    applyToPoint(x: number, y: number): [number, number] {
        const [a, b, c, d, e, f] = this.matrix;
        const newX = a * x + c * y + e;
        const newY = b * x + d * y + f;
        return [newX, newY];
    }

    applyToPoints(points: [number, number][]): [number, number][] {
        return points.map(([x, y]) => this.applyToPoint(x, y));
    }

    translate(tx: number, ty: number): TransformationMatrix2D {
        this.matrix[4] += tx;
        this.matrix[5] += ty;
        return this;
    }

    scale(sx: number, sy: number): TransformationMatrix2D {
        this.matrix[0] *= sx;
        this.matrix[1] *= sx;
        this.matrix[2] *= sy;
        this.matrix[3] *= sy;
        return this;
    }

    rotate(angle: number): TransformationMatrix2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [a, b, c, d, e, f] = this.matrix;

        this.matrix[0] = a * cos - b * sin;
        this.matrix[1] = a * sin + b * cos;
        this.matrix[2] = c * cos - d * sin;
        this.matrix[3] = c * sin + d * cos;
        return this;
    }

    inverse(): TransformationMatrix2D {
        const [a, b, c, d, e, f] = this.matrix;
        const det = a * d - b * c;

        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }

        const invDet = 1 / det;

        return new TransformationMatrix2D(
            +d * invDet,
            -b * invDet,
            -c * invDet,
            +a * invDet,
            (c * f - d * e) * invDet,
            (b * e - a * f) * invDet
        );
    }
}