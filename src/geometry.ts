import type { TrailwindConfig } from './types/core';
import { BOX_BOTTOM_LEFT, BOX_BOTTOM_RIGHT, BOX_TOP_LEFT, BOX_TOP_RIGHT, type Point, type Polygon } from './types/geometry';
import * as martinez from 'martinez-polygon-clipping';

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

function union(polygons: Point[][]): Point[] {
    let result = toMartinezPolygon(polygons[0]);
    for (let i = 1; i < polygons.length; i++) {
        result = martinez.union(result, toMartinezPolygon(polygons[i]));
    }
    return fromMartinezPolygon(result);
}

function toMartinezPolygon(points: Point[]): any {
    return [[points.map(p => [p.left, p.top])]];
}

function fromMartinezPolygon(mpoly: any): Point[] {
    if (!Array.isArray(mpoly)) throw new Error('Invalid polygon result');
    for (const poly of mpoly) {
        if (Array.isArray(poly) && Array.isArray(poly[0]) && poly[0].length >= 3 && Array.isArray(poly[0][0])) {
            // poly[0] is a ring of [number, number]
            return poly[0].map((pt: any) => ({ left: pt[0], top: pt[1] }));
        }
    }
    throw new Error('No valid polygon ring found');
}

function boxToPolygon(box: Box): Point[] {
    return [
        { left: box.left, top: box.top },    // top-left
        { left: box.right, top: box.top },   // top-right
        { left: box.right, top: box.bottom },// bottom-right
        { left: box.left, top: box.bottom }  // bottom-left
    ];
}

// Generalized: connect two polygons (not just boxes)
export function getIntentPolygonBetweenPolygons(src: Point[], dest: Point[]): Point[] {
    let result: Point[] = [];

    // upper or lower quadrants relative to src
    const destQIorQII = dest[BOX_TOP_LEFT].top <= src[BOX_TOP_LEFT].top && dest[BOX_TOP_RIGHT].top <= src[BOX_TOP_RIGHT].top;
    const destQIIIorQIV = dest[BOX_BOTTOM_LEFT].top >= src[BOX_BOTTOM_LEFT].top && dest[BOX_BOTTOM_RIGHT].top >= src[BOX_BOTTOM_RIGHT].top;
    // left or right quadrants relative to src
    const destQIIorQIII = dest[BOX_TOP_LEFT].left <= src[BOX_TOP_LEFT].left && dest[BOX_BOTTOM_LEFT].left <= src[BOX_BOTTOM_LEFT].left;
    const destQIorQIV = dest[BOX_TOP_RIGHT].left >= src[BOX_TOP_RIGHT].left && dest[BOX_BOTTOM_RIGHT].left >= src[BOX_BOTTOM_RIGHT].left;

    // upper right quadrant
    const destQI = destQIorQII && destQIorQIV;
    // upper left quadrant
    const destQII = destQIorQII && destQIIorQIII;
    // lower right quadrant
    const destQIII = destQIIorQIII && destQIIIorQIV;
    // lower left quadrant
    const destQIV = destQIIIorQIV && destQIorQIV;

    const betweenQIandQII = destQI && destQII;
    const betweenQIIandQIII = destQII && destQIII;
    const betweenQIIIandQIV = destQIII && destQIV;
    const betweenQIandQIV = destQI && destQIV;

    // ordering matters here, clockwise from src
    if (betweenQIandQII) {
        result = [src[BOX_BOTTOM_LEFT], dest[BOX_BOTTOM_LEFT], dest[BOX_BOTTOM_RIGHT], src[BOX_BOTTOM_RIGHT]];
    } else if (betweenQIIandQIII) {
        result = [src[BOX_TOP_RIGHT], src[BOX_BOTTOM_RIGHT], dest[BOX_BOTTOM_RIGHT], dest[BOX_TOP_RIGHT]];
    } else if (betweenQIIIandQIV) {
        result = [src[BOX_TOP_LEFT], src[BOX_TOP_RIGHT], dest[BOX_TOP_RIGHT], dest[BOX_TOP_LEFT]];
    } else if (betweenQIandQIV) {
        result = [src[BOX_TOP_LEFT], dest[BOX_TOP_LEFT], dest[BOX_BOTTOM_LEFT], src[BOX_BOTTOM_LEFT]];
    } else if (destQI) {
        result = [src[BOX_TOP_LEFT], dest[BOX_TOP_LEFT], dest[BOX_BOTTOM_LEFT], dest[BOX_BOTTOM_RIGHT], src[BOX_BOTTOM_RIGHT], src[BOX_TOP_RIGHT]];
    } else if (destQII) {
        result = [src[BOX_TOP_LEFT], src[BOX_BOTTOM_LEFT], dest[BOX_BOTTOM_LEFT], dest[BOX_BOTTOM_RIGHT], dest[BOX_TOP_RIGHT], src[BOX_TOP_RIGHT]];
    } else if (destQIII) {
        result = [src[BOX_TOP_LEFT], src[BOX_BOTTOM_LEFT], src[BOX_BOTTOM_RIGHT], dest[BOX_BOTTOM_RIGHT], dest[BOX_TOP_RIGHT], dest[BOX_TOP_LEFT]];
    } else if (destQIV) {
        result = [src[BOX_BOTTOM_LEFT], src[BOX_BOTTOM_RIGHT], src[BOX_TOP_RIGHT], dest[BOX_TOP_RIGHT], dest[BOX_TOP_LEFT], dest[BOX_BOTTOM_LEFT]];
    }

    return result;
}

// Accepts two polygons (Point[]), not just boxes or elements
const DEFAULT_OPTIONS_INCLUDES = { dest: true, src: false };

export function getIntentPolygons(src: Element, dest: Element, options?: TrailwindConfig['options']): Array<Point[]> {
    const srcPolygon = boxToPolygon(getBoxFromElement(src));
    const destPolygon = boxToPolygon(getBoxFromElement(dest));
    const pathPolygon = getIntentPolygonBetweenPolygons(srcPolygon, destPolygon);

    let result = [pathPolygon];
    if (options?.include?.src ?? DEFAULT_OPTIONS_INCLUDES.src) {
        result.push(srcPolygon);
    }
    if (options?.include?.dest ?? DEFAULT_OPTIONS_INCLUDES.dest) {
        result.push(destPolygon);
    }
    return result;
}