import { internalCreateDesirePath } from "./core";

// Core logic for desire path
export interface TrailwindConfig {
    from: HTMLElement;
    to: HTMLElement;
    onPathEnter?: () => void;
    onPathLeave?: () => void;
    tolerance?: number;
    debug?: boolean;
}

export function createDesirePath(config: TrailwindConfig) {
    return internalCreateDesirePath(config);
}
