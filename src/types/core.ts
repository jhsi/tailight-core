export interface TrailwindConfig {
    src: HTMLElement;
    dest: HTMLElement;
    onPathMouseEnter?: () => void;
    onPathMouseLeave?: () => void;
    onPathMouseMove?: () => void;
    onPathClick?: () => void;
    tolerance?: number;
    debug?: boolean;
    options?: {
        include?: {
            dest?: boolean; // if true, the destination will be included in the polygon. defaults true
            src?: boolean; // if true, the source will be included in the polygon. defaults false
        };
        debugOverlayCSSAttributes?: Record<string, string>;
    };
}