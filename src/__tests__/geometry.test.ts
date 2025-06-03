import { describe, it, expect } from 'vitest';
import { pointInPolygon } from '../geometry';
import type { Polygon } from '../types/geometry';

describe('pointInPolygon', () => {
    const square: Polygon = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
    ];

    it('returns true for points inside', () => {
        expect(pointInPolygon({ x: 50, y: 50 }, square)).toBe(true);
    });

    it('returns false for points outside', () => {
        expect(pointInPolygon({ x: 150, y: 50 }, square)).toBe(false);
    });
});
