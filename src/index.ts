import { internalCreateDesirePath } from "./core";
import { getIntentPolygon, pointInPolygon, isValidPolygon, getBoxFromElement } from "./geometry";
import type { TrailwindConfig } from "./types/core";
import type { Point, Polygon } from "./types/geometry";

export function createDesirePath(config: TrailwindConfig) {
    return internalCreateDesirePath(config);
}

// Export core geometry functions
export { getIntentPolygon, pointInPolygon, isValidPolygon, getBoxFromElement };

// Export types
export type { TrailwindConfig, Point, Polygon };
