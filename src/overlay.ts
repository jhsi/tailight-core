import type { Point } from "./types/geometry";

let idCounter = 0;
const overlays = new Map<number, { svg: SVGSVGElement, polygon: Point[], events?: OverlayEvents }>();

export type OverlayEvents = Partial<{
    onClick: (e: MouseEvent) => void;
    onMouseEnter: (e: MouseEvent) => void;
    onMouseLeave: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
}>;

export function renderOverlay(
    id: number,
    polygon: Point[],
    cssAttributes: Record<string, string> = {},
    events?: OverlayEvents
): number {
    removeOverlay(id);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'fixed';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';

    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    overlay.setAttribute('fill', 'rgba(255,0,0,0.2)');
    overlay.setAttribute('stroke', 'red');
    overlay.setAttribute('stroke-width', '1');
    overlay.setAttribute('pointer-events', 'auto');
    Object.entries(cssAttributes).forEach(([key, value]) => {
        overlay.setAttribute(key, value);
    });

    const points = polygon.map(p => `${p.left},${p.top}`).join(' ');
    overlay.setAttribute('points', points);

    if (events) {
        if (events.onClick) overlay.addEventListener('click', events.onClick);
        if (events.onMouseEnter) overlay.addEventListener('mouseenter', events.onMouseEnter);
        if (events.onMouseMove) overlay.addEventListener('mousemove', events.onMouseMove);
        if (events.onMouseLeave) overlay.addEventListener('mouseleave', (e) => {
            const mouse = { left: e.clientX, top: e.clientY };
            let insideAnother = false;
            overlays.forEach((entry, id) => {
                if (id !== overlayId && pointInPolygon(mouse, entry.polygon)) {
                    insideAnother = true;
                }
            });
            if (!insideAnother && events?.onMouseLeave) {
                events.onMouseLeave(e);
            }
        });
    }

    svg.appendChild(overlay);
    document.body.appendChild(svg);

    const overlayId = id ?? idCounter++;
    overlays.set(overlayId, { svg, polygon, events });
    return overlayId;
}

export function removeAllOverlays() {
    overlays.forEach((overlay, id) => {
        if (overlay && overlay.svg.parentNode) {
            (overlay.svg.parentNode as HTMLElement).removeChild(overlay.svg);
            overlays.delete(id);
        }
    });
}

function removeOverlay(id: number) {
    const overlay = overlays.get(id);
    if (overlay && overlay.svg.parentNode) {
        (overlay.svg.parentNode as HTMLElement).removeChild(overlay.svg);
        overlays.delete(id);
    }
}

function pointInPolygon(point: { left: number, top: number }, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].left, yi = polygon[i].top;
        const xj = polygon[j].left, yj = polygon[j].top;
        const intersect = ((yi > point.top) !== (yj > point.top)) &&
            (point.left < (xj - xi) * (point.top - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
