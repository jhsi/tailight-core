export interface TrailwindConfig {
    src: HTMLElement;
    dest: HTMLElement;
    onPathEnter?: () => void;
    onPathLeave?: () => void;
    tolerance?: number;
    debug?: boolean;
}