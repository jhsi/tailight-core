import { describe, it, expect } from 'vitest';
import { getIntentPolygon } from '../geometry';
import { POLYGON_BOTTOM_LEFT, POLYGON_BOTTOM_RIGHT, POLYGON_TOP_LEFT, POLYGON_TOP_RIGHT } from '../types/geometry';

function mockElement(rect: Partial<DOMRect>): HTMLElement {
    return {
        getBoundingClientRect: () => rect as DOMRect,
    } as HTMLElement;
}

describe('getIntentPolygon', () => {
    it('creates a rectangle between two elements', () => {
        const from = mockElement({ left: 90, right: 100, top: 100, bottom: 150 });
        const to = mockElement({ left: 200, right: 220, top: 120, bottom: 160 });

        const ZERO_TOLERANCE = 0;

        const poly = getIntentPolygon(from, to, ZERO_TOLERANCE);
        expect(poly.length).toBe(4);
        expect(poly[POLYGON_TOP_LEFT]).toEqual({ x: 90, y: 100 });
        expect(poly[POLYGON_TOP_RIGHT]).toEqual({ x: 200, y: 120 });
        expect(poly[POLYGON_BOTTOM_RIGHT]).toEqual({ x: 200, y: 160 });
        expect(poly[POLYGON_BOTTOM_LEFT]).toEqual({ x: 90, y: 150 });
    });
});
