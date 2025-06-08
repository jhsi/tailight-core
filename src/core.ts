import { boxToPolygon, getBoxFromElement, getIntentPolygons, pointInPolygon } from './geometry';
import { renderOverlay, removeAllOverlays, OverlayEvents } from './overlay';
import type { TrailwindConfig } from './types/core';
import { throttle } from './utils/throttle';

const THROTTLE_DELAY_MS = 50; // 60+fps

function propagateToUnderlying(e: MouseEvent, config: TrailwindConfig, type: string) {
    const point = { left: e.clientX, top: e.clientY };
    const isInDestination = pointInPolygon(point, boxToPolygon(getBoxFromElement(config.dest)));
    const isInSource = pointInPolygon(point, boxToPolygon(getBoxFromElement(config.src)));
    if (isInDestination && config.options?.include?.dest) {
        config.dest.dispatchEvent(new MouseEvent(type, e));
    } else if (isInSource && config.options?.include?.src) {
        config.src.dispatchEvent(new MouseEvent(type, e));
    }
}

export function _createDesirePath(config: TrailwindConfig) {
    const updatePolygons = () => getIntentPolygons(config.src, config.dest, config.options);
    let polygons = updatePolygons();

    const mouseEvents: OverlayEvents = {
        onClick: (e: MouseEvent) => {
            config.onPathClick?.(e);
            propagateToUnderlying(e, config, 'click');
        },
        onMouseDown: (e: MouseEvent) => {
            config.onPathMouseDown?.(e);
            propagateToUnderlying(e, config, 'mousedown');
        },
        onMouseUp: (e: MouseEvent) => {
            config.onPathMouseUp?.(e);
            propagateToUnderlying(e, config, 'mouseup');
        },
        onMouseMove: (e: MouseEvent) => {
            config.onPathMouseMove?.(e);
            propagateToUnderlying(e, config, 'mousemove');
        },
        onMouseEnter: (e: MouseEvent) => {
            config.onPathMouseEnter?.(e);
        },
        onMouseLeave: (e: MouseEvent) => {
            config.onPathMouseLeave?.(e);
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
