import type { Point, Polygon } from './types/geometry';

type Box = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

function getBoxFromElement(element: HTMLElement): Box {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
    };
}

function isValidPolygon(polygon: Polygon): boolean {
    if (polygon.length !== 4) {
        console.error('Polygon must have exactly 4 points');
        return false;
    }

    // Check if points are ordered clockwise
    for (let i = 0; i < 4; i++) {
        const current = polygon[i];
        const next = polygon[(i + 1) % 4];
        const nextNext = polygon[(i + 2) % 4];

        // Calculate cross product to determine if points are ordered clockwise
        const crossProduct = (next.left - current.left) * (nextNext.top - current.top) -
            (next.top - current.top) * (nextNext.left - current.left);

        if (crossProduct >= 0) {
            console.error(`Points ${i}, ${(i + 1) % 4}, ${(i + 2) % 4} are not ordered clockwise`);
            console.error('Points:', {
                current,
                next,
                nextNext,
                crossProduct
            });
            return false;
        }
    }

    return true;
}

function getIntentPolygonPoints(src: Box, dest: Box, tolerance: number): Polygon {
    // Determine the relative position of the boxes
    const isHorizontal = src.right <= dest.left || dest.right <= src.left;
    const isVertical = src.bottom <= dest.top || dest.bottom <= src.top;

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
        // Find the farthest edge of src from dest and closest edge of dest to src
        const srcCenter = {
            left: (src.left + src.right) / 2,
            top: (src.top + src.bottom) / 2
        };
        const destCenter = {
            left: (dest.left + dest.right) / 2,
            top: (dest.top + dest.bottom) / 2
        };

        // Determine which edges of src are farthest from dest
        const srcEdges = [
            { left: src.left, top: src.top },      // top-left
            { left: src.right, top: src.top },     // top-right
            { left: src.right, top: src.bottom },  // bottom-right
            { left: src.left, top: src.bottom }    // bottom-left
        ];

        // Sort edges by distance to dest center
        srcEdges.sort((a, b) => {
            const distA = Math.hypot(a.left - destCenter.left, a.top - destCenter.top);
            const distB = Math.hypot(b.left - destCenter.left, b.top - destCenter.top);
            return distB - distA; // Sort in descending order
        });

        // Take the two farthest edges
        const farthestSrcEdges = srcEdges.slice(0, 2);

        // Find the two closest points on dest to the farthest src edges
        const destEdges = [
            { left: dest.left, top: dest.top },      // top-left
            { left: dest.right, top: dest.top },     // top-right
            { left: dest.right, top: dest.bottom },  // bottom-right
            { left: dest.left, top: dest.bottom }    // bottom-left
        ];

        // For each farthest src edge, find the closest dest edge
        const closestDestEdges = farthestSrcEdges.map(srcEdge => {
            return destEdges.reduce((closest, current) => {
                const distToCurrent = Math.hypot(
                    current.left - srcEdge.left,
                    current.top - srcEdge.top
                );
                const distToClosest = Math.hypot(
                    closest.left - srcEdge.left,
                    closest.top - srcEdge.top
                );
                return distToCurrent < distToClosest ? current : closest;
            });
        });

        // Create polygon points in clockwise order
        // Start with closest dest edge, then go to farthest src edge
        const points = [
            closestDestEdges[0],
            farthestSrcEdges[0],
            farthestSrcEdges[1],
            closestDestEdges[1]
        ] as Polygon;

        // Ensure clockwise ordering by checking cross products
        const isClockwise = (p1: Point, p2: Point, p3: Point) => {
            const crossProduct = (p2.left - p1.left) * (p3.top - p1.top) -
                (p2.top - p1.top) * (p3.left - p1.left);
            return crossProduct < 0;
        };

        // If not clockwise, reverse the order
        if (!isClockwise(points[0], points[1], points[2])) {
            points.reverse();
        }

        return points;
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
