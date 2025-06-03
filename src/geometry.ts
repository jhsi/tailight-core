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
        { left: a.left, top: a.top - tolerance }, // top left
        { left: b.left, top: b.top - tolerance }, // top right
        { left: b.left, top: b.bottom + tolerance }, // bottom right
        { left: a.left, top: a.bottom + tolerance }, // bottom left
    ];
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
