export type Point = {
    left: number;
    top: number;
};


export type Polygon = [Point, Point, Point, Point];

export const BOX_TOP_LEFT = 0;
export const BOX_TOP_RIGHT = 1;
export const BOX_BOTTOM_RIGHT = 2;
export const BOX_BOTTOM_LEFT = 3;