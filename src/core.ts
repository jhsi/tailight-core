import { getIntentPolygon, pointInPolygon } from './geometry';
import { renderDebugOverlay, removeDebugOverlay } from './debug';
import type { TrailwindConfig } from './types/core';
import { throttle } from './utils/throttle';

const THROTTLE_DELAY_MS = 100; // 60fps

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

    window.addEventListener('mousemove', throttle(onMouseMove, THROTTLE_DELAY_MS));

    if (config.debug) renderDebugOverlay(polygon);

    const observer = new ResizeObserver(
        throttle(() => {
            polygon = updatePolygon();
            if (config.debug) renderDebugOverlay(polygon);
        }, THROTTLE_DELAY_MS)
    );

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
