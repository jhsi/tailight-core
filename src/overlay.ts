import type { Point } from "./types/geometry";

let idCounter = 0;
const overlays = new Map<number, SVGPolygonElement>();

export function renderOverlay(id: number, polygon: Point[], cssAttributes: Record<string, string> = {}) {
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
    Object.entries(cssAttributes).forEach(([key, value]) => {
        overlay?.setAttribute(key, value);
    });

    const points = polygon.map(p => `${p.left},${p.top}`).join(' ');
    overlay.setAttribute('points', points);

    svg.appendChild(overlay);
    document.body.appendChild(svg);

    const overlayId = id ?? idCounter++;
    overlays.set(overlayId, overlay);
    return overlayId;
}

export function removeAllOverlays() {
    overlays.forEach((overlay, id) => {
        if (overlay && overlay.parentNode) {
            (overlay.parentNode as HTMLElement).removeChild(overlay);
            overlays.delete(id);
        }
    });
}

function removeOverlay(id: number) {
    const overlay = overlays.get(id);
    if (overlay && overlay.parentNode) {
        (overlay.parentNode as HTMLElement).removeChild(overlay);
        overlays.delete(id);
    }
}
