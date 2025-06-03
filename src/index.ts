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
    // Core logic goes here
    console.log("Creating trailwind path between", config.from, "and", config.to);
}
