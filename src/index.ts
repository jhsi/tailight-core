import { internalCreateDesirePath } from "./core";
import type { TrailwindConfig } from "./types/core";

export function createDesirePath(config: TrailwindConfig) {
    return internalCreateDesirePath(config);
}
