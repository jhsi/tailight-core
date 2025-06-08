export interface TailightConfig {
    src: HTMLElement;
    dest: HTMLElement;
    onPathMouseEnter?: (e: MouseEvent) => void;
    onPathMouseLeave?: (e: MouseEvent) => void;
    onPathMouseMove?: (e: MouseEvent) => void;
    onPathMouseDown?: (e: MouseEvent) => void;
    onPathMouseUp?: (e: MouseEvent) => void;
    onPathClick?: (e: MouseEvent) => void;
    tolerance?: number;
    showOverlay?: boolean;
    options?: {
        include?: {
            dest?: boolean; // if true, the destination will be included in the polygon. defaults true
            src?: boolean; // if true, the source will be included in the polygon. defaults false
        };
        overlayCSS?: Record<string, string>;
    };
}