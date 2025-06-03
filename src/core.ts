import { getIntentPolygon, pointInPolygon } from './geometry';
import { renderDebugOverlay, removeDebugOverlay } from './debug';
import type { TrailwindConfig } from './types/core';

export function internalCreateDesirePath(config: TrailwindConfig) {
    let isInside = false;

    const updatePolygon = () =>
        getIntentPolygon(config.src, config.dest, config.tolerance || 0);

    let polygon = updatePolygon();

    function onMouseMove(e: MouseEvent) {
        const point = { left: e.clientX, top: e.clientY };
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

    observer.observe(config.src);
    observer.observe(config.dest);

    return {
        destroy() {
            window.removeEventListener('mousemove', onMouseMove);
            observer.disconnect();
            if (config.debug) removeDebugOverlay();
        },
    };
}
