export type Point = {
    x: number;
    y: number;
};


export type Polygon = [Point, Point, Point, Point];

export const POLYGON_TOP_LEFT = 0;
export const POLYGON_TOP_RIGHT = 1;
export const POLYGON_BOTTOM_RIGHT = 2;
export const POLYGON_BOTTOM_LEFT = 3;