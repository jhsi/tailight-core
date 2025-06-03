import { describe, it, expect } from 'vitest';
import { getIntentPolygon, pointInPolygon } from '../geometry';
import type { Point, Polygon } from '../types/geometry';

describe('getIntentPolygon', () => {
    // Helper function to create a mock element with given dimensions
    const createMockElement = (left: number, top: number, width: number, height: number): HTMLElement => {
        const element = document.createElement('div');
        element.getBoundingClientRect = () => ({
            left,
            top,
            right: left + width,
            bottom: top + height,
            width,
            height,
            x: left,
            y: top,
            toJSON: () => ({})
        });
        return element;
    };

    // Helper function to verify polygon points
    const verifyPolygonPoints = (polygon: Polygon, expectedPoints: Point[]) => {
        expect(polygon).toHaveLength(expectedPoints.length);

        // Log the actual and expected points for debugging if not equal
        if (polygon.length !== expectedPoints.length || polygon.map(p => `${p.left},${p.top}`).join(' ') !== expectedPoints.map(p => `${p.left},${p.top}`).join(' ')) {
            console.log('Actual points:', polygon);
            console.log('Expected points:', expectedPoints);
        }

        polygon.forEach((point, index) => {
            expect(point).toEqual(expectedPoints[index]);
        });
    };

    // Helper function to validate polygon ordering
    const validatePolygonOrdering = (polygon: Polygon) => {
        // Check if points are ordered clockwise
        const [topLeft, topRight, bottomRight, bottomLeft] = polygon;
        const topLeftValid = topLeft.left < topRight.left && topLeft.top < bottomRight.top && topLeft.top < bottomLeft.top;
        const topRightValid = topRight.top < bottomRight.top && topRight.top < bottomLeft.top;
        const bottomLeftValid = bottomLeft.left < bottomRight.left;

        return topLeftValid && topRightValid && bottomLeftValid;
    };

    it('should create intent polygon when src is to the left of dest', () => {
        const src = createMockElement(0, 0, 100, 100);
        const dest = createMockElement(150, 0, 100, 100);
        const tolerance = 10;

        const polygon = getIntentPolygon(src, dest, tolerance);
        expect(validatePolygonOrdering(polygon)).toBe(true);

        verifyPolygonPoints(polygon, [
            { left: 0, top: -10 },      // top left (farthest src)
            { left: 150, top: -10 },    // top right (closest dest)
            { left: 150, top: 110 },    // bottom right (closest dest)
            { left: 0, top: 110 }       // bottom left (farthest src)
        ]);
    });

    it('should create intent polygon when src is to the right of dest', () => {
        const src = createMockElement(150, 0, 100, 100);
        const dest = createMockElement(0, 0, 100, 100);
        const tolerance = 10;

        const polygon = getIntentPolygon(src, dest, tolerance);
        expect(validatePolygonOrdering(polygon)).toBe(true);

        verifyPolygonPoints(polygon, [
            { left: 100, top: -10 },    // top left (closest dest)
            { left: 250, top: -10 },    // top right (farthest src)
            { left: 250, top: 110 },    // bottom right (farthest src)
            { left: 100, top: 110 }     // bottom left (closest dest)
        ]);
    });

    it('should create intent polygon when src is above dest', () => {
        const src = createMockElement(0, 0, 100, 100);
        const dest = createMockElement(0, 150, 100, 100);
        const tolerance = 10;

        const polygon = getIntentPolygon(src, dest, tolerance);
        expect(validatePolygonOrdering(polygon)).toBe(true);

        verifyPolygonPoints(polygon, [
            { left: -10, top: 0 },      // top left (farthest src)
            { left: 110, top: 0 },      // top right (farthest src)
            { left: 110, top: 150 },    // bottom right (closest dest)
            { left: -10, top: 150 }     // bottom left (closest dest)
        ]);
    });

    it('should create intent polygon when src is below dest', () => {
        const src = createMockElement(0, 150, 100, 100);
        const dest = createMockElement(0, 0, 100, 100);
        const tolerance = 10;

        const polygon = getIntentPolygon(src, dest, tolerance);
        expect(validatePolygonOrdering(polygon)).toBe(true);

        verifyPolygonPoints(polygon, [
            { left: -10, top: 100 },    // top left (closest dest)
            { left: 110, top: 100 },    // top right (closest dest)
            { left: 110, top: 250 },    // bottom right (farthest src)
            { left: -10, top: 250 }     // bottom left (farthest src)
        ]);
    });

    it('should handle boxes of different sizes', () => {
        const src = createMockElement(0, 0, 100, 50);
        const dest = createMockElement(150, 0, 200, 100);
        const tolerance = 10;

        const polygon = getIntentPolygon(src, dest, tolerance);
        expect(validatePolygonOrdering(polygon)).toBe(true);

        verifyPolygonPoints(polygon, [
            { left: 0, top: -10 },      // top left (farthest src)
            { left: 150, top: -10 },     // top right (closest dest)
            { left: 150, top: 110 },     // bottom right (closest dest)
            { left: 0, top: 60 },        // bottom left (farthest src)
        ]);
    });

    it('should handle diagonal arrangement', () => {
        const src = createMockElement(0, 0, 100, 100);
        const dest = createMockElement(150, 150, 100, 100);
        const tolerance = 10;

        const polygon = getIntentPolygon(src, dest, tolerance);
        expect(validatePolygonOrdering(polygon)).toBe(true);

        // For diagonal arrangement, we expect the polygon to connect
        // the two farthest corners of src to the two closest corners of dest
        expect(polygon).toHaveLength(4);

        // Verify that the first two points are from src's farthest corners
        const srcPoints = polygon.slice(0, 2);
        srcPoints.forEach(point => {
            expect(
                (point.left === 0 || point.left === 100) &&
                (point.top === 0 || point.top === 100)
            ).toBe(true);
        });

        // Verify that the last two points are from dest's closest corners
        const destPoints = polygon.slice(2);
        destPoints.forEach(point => {
            expect(
                (point.left === 150 || point.left === 250) &&
                (point.top === 150 || point.top === 250)
            ).toBe(true);
        });
    });
});

describe('pointInPolygon', () => {
    it('should return true for point inside polygon', () => {
        const polygon: Polygon = [
            { left: 0, top: 0 },
            { left: 100, top: 0 },
            { left: 100, top: 100 },
            { left: 0, top: 100 }
        ];

        expect(pointInPolygon({ left: 50, top: 50 }, polygon)).toBe(true);
    });

    it('should return false for point outside polygon', () => {
        const polygon: Polygon = [
            { left: 0, top: 0 },
            { left: 100, top: 0 },
            { left: 100, top: 100 },
            { left: 0, top: 100 }
        ];

        expect(pointInPolygon({ left: 150, top: 150 }, polygon)).toBe(false);
    });
});
