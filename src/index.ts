import { _createDesirePath } from "./core";
import { getIntentPolygons, isValidPolygon, getBoxFromElement } from "./geometry";
import type { TrailwindConfig } from "./types/core";
import type { Point, Polygon } from "./types/geometry";

export function createDesirePath(config: TrailwindConfig) {
    return _createDesirePath(config);
}

// Export core geometry functions
export { getIntentPolygons, isValidPolygon, getBoxFromElement };

// Export types
export type { TrailwindConfig, Point, Polygon };
