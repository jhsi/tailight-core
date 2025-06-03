import type { Point, Polygon } from './types/geometry';

export function getIntentPolygon(
    from: HTMLElement,
    to: HTMLElement,
    tolerance: number
): Polygon {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();

    // Simple triangle from right edge of A to left edge of B
    return [
        { x: a.left, y: a.top - tolerance }, // top left
        { x: b.left, y: b.top - tolerance }, // top right
        { x: b.left, y: b.bottom + tolerance }, // bottom right
        { x: a.left, y: a.bottom + tolerance }, // bottom left
    ];
}

// Ray-casting algorithm for point-in-polygon
export function pointInPolygon(
    point: Point,
    vs: Polygon
): boolean {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;

        const intersect = yi > point.y !== yj > point.y &&
            point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}
