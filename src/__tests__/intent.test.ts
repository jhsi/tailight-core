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
        const from = mockElement({ left: 50, right: 100, top: 150, bottom: 200 });
        const to = mockElement({ left: 200, right: 250, top: 250, bottom: 300 });

        const ZERO_TOLERANCE = 0;

        const poly = getIntentPolygon(from, to, ZERO_TOLERANCE);
        expect(poly.length).toBe(4);
        expect(poly[POLYGON_TOP_LEFT]).toEqual({ left: 50, top: 200 });
        expect(poly[POLYGON_TOP_RIGHT]).toEqual({ left: 100, top: 150 });
        expect(poly[POLYGON_BOTTOM_RIGHT]).toEqual({ left: 250, top: 250 });
        expect(poly[POLYGON_BOTTOM_LEFT]).toEqual({ left: 200, top: 300 });

    });
});
