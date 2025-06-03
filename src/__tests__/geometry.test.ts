import { describe, it, expect } from 'vitest';
import { pointInPolygon } from '../geometry';
import type { Polygon } from '../types/geometry';

describe('pointInPolygon', () => {
    const square: Polygon = [
        { left: 0, top: 0 },
        { left: 100, top: 0 },
        { left: 100, top: 100 },
        { left: 0, top: 100 },
    ];

    it('returns true for points inside', () => {
        expect(pointInPolygon({ left: 50, top: 50 }, square)).toBe(true);
    });

    it('returns false for points outside', () => {
        expect(pointInPolygon({ left: 150, top: 50 }, square)).toBe(false);
    });
});
