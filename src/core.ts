import { getIntentPolygons } from './geometry';
import { renderOverlay, removeAllOverlays, OverlayEvents } from './overlay';
import type { TrailwindConfig } from './types/core';
import { throttle } from './utils/throttle';

const THROTTLE_DELAY_MS = 50; // 60+fps

export function _createDesirePath(config: TrailwindConfig) {
    const updatePolygons = () => getIntentPolygons(config.src, config.dest, config.options);
    let polygons = updatePolygons();

    const mouseEvents: OverlayEvents = {
        onClick: () => {
            config.onPathClick?.();
        },
        onMouseEnter: () => {
            config.onPathMouseEnter?.();
        },
        onMouseLeave: () => {
            config.onPathMouseLeave?.();
        },
        onMouseMove: () => {
            config.onPathMouseMove?.();
        },
    };

    if (config.debug) polygons.forEach((polygon, index) => renderOverlay(index, polygon, config.options?.debugOverlayCSSAttributes, mouseEvents));

    const throttledUpdate = throttle(() => {
        polygons = updatePolygons();
        if (config.debug) polygons.forEach((polygon, index) => renderOverlay(index, polygon, config.options?.debugOverlayCSSAttributes, mouseEvents));
    }, THROTTLE_DELAY_MS);

    const observer = new ResizeObserver(throttledUpdate);
    observer.observe(config.src);
    observer.observe(config.dest);

    window.addEventListener('resize', throttledUpdate);

    return {
        destroy() {
            window.removeEventListener('resize', throttledUpdate);
            observer.disconnect();
            if (config.debug) removeAllOverlays();
        },
    };
}
