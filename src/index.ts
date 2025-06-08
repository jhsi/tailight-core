import { _createDesirePath } from "./core";
import type { TrailwindConfig } from "./types/core";
import type { Point, Polygon } from "./types/geometry";

export function createDesirePath(config: TrailwindConfig) {
    return _createDesirePath(config);
}

// Export types
export type { TrailwindConfig, Point, Polygon };
