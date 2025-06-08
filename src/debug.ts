import type { Point } from "./types/geometry";

let overlay: SVGPolygonElement | null = null;

export function renderDebugOverlay(polygon: Point[], cssAttributes: Record<string, string> = {}) {
    removeDebugOverlay();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'fixed';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';

    overlay = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
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
}

export function removeDebugOverlay() {
    if (overlay && overlay.parentNode) {
        (overlay.parentNode as HTMLElement).removeChild(overlay);
        overlay = null;
    }
}
