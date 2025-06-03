import type { Point, Polygon } from './types/geometry';

type Box = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

export function getBoxFromElement(element: Element): Box {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
    };
}

export function isValidPolygon(polygon: Polygon): boolean {
    if (polygon.length !== 4) {
        console.error('Polygon must have exactly 4 points');
        return false;
    }

    // Check if points represent a valid polygon (it doesn't have to be a rectangle)
    const [topLeft, topRight, bottomRight, bottomLeft] = polygon;
    const topLeftValid = topLeft.left < topRight.left && topLeft.top < bottomLeft.top;
    const topRightValid = topRight.top < bottomRight.top && topRight.top < bottomLeft.top;
    const bottomLeftValid = bottomLeft.left < bottomRight.left;
    return topLeftValid && topRightValid && bottomLeftValid;
}

function getIntentPolygonPoints(src: Box, dest: Box, tolerance: number): Polygon {
    // Determine the relative position of the boxes
    const isHorizontal = src.top === dest.top && (src.right <= dest.left || dest.right <= src.left);
    const isVertical = src.left === dest.left && (src.bottom <= dest.top || dest.bottom <= src.top);

    if (isHorizontal) {
        // Boxes are arranged horizontally
        const isSrcLeft = src.right <= dest.left;

        if (isSrcLeft) {
            return [
                { left: src.left, top: src.top - tolerance },      // top left (farthest src)
                { left: dest.left, top: dest.top - tolerance },    // top right (closest dest)
                { left: dest.left, top: dest.bottom + tolerance }, // bottom right (closest dest)
                { left: src.left, top: src.bottom + tolerance },   // bottom left (farthest src)
            ];
        } else {
            return [
                { left: dest.right, top: dest.top - tolerance },    // top left (closest dest)
                { left: src.right, top: src.top - tolerance },     // top right (farthest src)
                { left: src.right, top: src.bottom + tolerance },  // bottom right (farthest src)
                { left: dest.right, top: dest.bottom + tolerance }, // bottom left (closest dest)
            ];
        }
    } else if (isVertical) {
        // Boxes are arranged vertically
        const isSrcTop = src.bottom <= dest.top;

        if (isSrcTop) {
            return [
                { left: src.left - tolerance, top: src.top },        // top left (farthest src)
                { left: src.right + tolerance, top: src.top },       // top right (farthest src)
                { left: dest.right + tolerance, top: dest.top },     // bottom right (closest dest)
                { left: dest.left - tolerance, top: dest.top },      // bottom left (closest dest)
            ];
        } else {
            return [
                { left: dest.left - tolerance, top: dest.bottom },      // top left (closest dest)
                { left: dest.right + tolerance, top: dest.bottom },     // top right (closest dest)
                { left: src.right + tolerance, top: src.bottom },    // bottom right (farthest src)
                { left: src.left - tolerance, top: src.bottom },     // bottom left (farthest src)
            ];
        }
    } else {
        // Boxes overlap or are diagonally arranged
        const isDestQuadrantI = src.left < dest.left && src.top > dest.top;
        const isDestQuadrantII = src.left < dest.left && src.top < dest.top;
        const isDestQuadrantIII = src.left > dest.left && src.top > dest.top;
        // const isDestQuadrantIV = src.left > dest.left && src.top < dest.top;

        tolerance = 0; // TODO: remove this
        if (isDestQuadrantI) {
            return [
                { left: src.left, top: src.top - tolerance },
                { left: dest.left, top: dest.top - tolerance },
                { left: dest.right, top: dest.bottom + tolerance },
                { left: src.right, top: src.bottom + tolerance },
            ];
        } else if (isDestQuadrantII) {
            return [
                { left: src.left, top: src.bottom - tolerance },
                { left: src.right, top: src.top - tolerance },
                { left: dest.right, top: dest.top + tolerance },
                { left: dest.left, top: dest.bottom + tolerance },
            ];
        } else if (isDestQuadrantIII) {
            return [
                { left: dest.left, top: dest.bottom - tolerance },
                { left: src.left, top: src.top - tolerance },
                { left: src.right, top: src.bottom + tolerance },
                { left: dest.right, top: dest.bottom + tolerance },
            ];
        } else {
            // isDestQuadrantIV
            return [
                { left: src.left, top: src.bottom - tolerance },
                { left: dest.right, top: dest.top - tolerance },
                { left: src.right, top: src.top + tolerance },
                { left: src.left, top: src.bottom + tolerance },
            ];
        }
    }
}

export function getIntentPolygon(
    src: HTMLElement,
    dest: HTMLElement,
    tolerance: number
): Polygon {
    const srcBox = getBoxFromElement(src);
    const destBox = getBoxFromElement(dest);
    const polygon = getIntentPolygonPoints(srcBox, destBox, tolerance);

    if (!isValidPolygon(polygon)) {
        console.error('Invalid polygon generated:', polygon);
    }

    return polygon;
}

// Ray-casting algorithm for point-in-polygon
export function pointInPolygon(
    point: Point,
    vs: Polygon
): boolean {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].left, yi = vs[i].top;
        const xj = vs[j].left, yj = vs[j].top;

        const intersect = yi > point.top !== yj > point.top &&
            point.left < ((xj - xi) * (point.top - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}
