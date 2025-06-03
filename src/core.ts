import { getIntentPolygon, pointInPolygon } from './geometry';
import { renderDebugOverlay, removeDebugOverlay } from './debug';

export function internalCreateDesirePath(config: {
    from: HTMLElement;
    to: HTMLElement;
    onPathEnter?: () => void;
    onPathLeave?: () => void;
    tolerance?: number;
    debug?: boolean;
}) {
    let isInside = false;

    const updatePolygon = () =>
        getIntentPolygon(config.from, config.to, config.tolerance || 12);

    let polygon = updatePolygon();

    function onMouseMove(e: MouseEvent) {
        const point = { x: e.clientX, y: e.clientY };
        const inside = pointInPolygon(point, polygon);

        if (inside && !isInside) {
            isInside = true;
            config.onPathEnter?.();
        } else if (!inside && isInside) {
            isInside = false;
            config.onPathLeave?.();
        }
    }

    window.addEventListener('mousemove', onMouseMove);

    if (config.debug) renderDebugOverlay(polygon);

    const observer = new ResizeObserver(() => {
        polygon = updatePolygon();
        if (config.debug) renderDebugOverlay(polygon);
    });

    observer.observe(config.from);
    observer.observe(config.to);

    return {
        destroy() {
            window.removeEventListener('mousemove', onMouseMove);
            observer.disconnect();
            if (config.debug) removeDebugOverlay();
        },
    };
}
