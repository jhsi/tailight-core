import { getIntentPolygon, pointInPolygon } from './geometry';
import { renderDebugOverlay, removeDebugOverlay } from './debug';
import type { TrailwindConfig } from './types/core';
import { throttle } from './utils/throttle';

const THROTTLE_DELAY_MS = 50; // 60+fps

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

    if (config.debug) renderDebugOverlay(polygon, config.options?.debugOverlayCSSAttributes);

    const throttledUpdate = throttle(() => {
        polygon = updatePolygon();
        if (config.debug) renderDebugOverlay(polygon, config.options?.debugOverlayCSSAttributes);
    }, THROTTLE_DELAY_MS);

    const observer = new ResizeObserver(throttledUpdate);
    observer.observe(config.src);
    observer.observe(config.dest);

    window.addEventListener('mousemove', throttle(onMouseMove, THROTTLE_DELAY_MS));
    window.addEventListener('resize', throttledUpdate);

    return {
        destroy() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', throttledUpdate);
            observer.disconnect();
            if (config.debug) removeDebugOverlay();
        },
    };
}
