# Tailight

## About
Tailight.js is a library created to help create hoverable desire paths between any two HTML elements. It also can be used to create a light path between two boxed divs.

## Installation

```bash
npm install @tailight-core
```

## Usage

Import the library and create a desire path between two HTML elements:

```javascript
import { createDesirePath } from '@tailight-core';

const desirePath = createDesirePath({
    src: sourceElement,      // Source HTML element
    dest: destinationElement, // Destination HTML element
    onPathMouseEnter: () => {
        // Optional: Handle mouse enter on path
    },
    onPathMouseLeave: () => {
        // Optional: Handle mouse leave on path
    },
    tolerance: 0,            // Optional: Path tolerance
    options: {
        include: {
            src: true,       // Optional: Include source element in path
            dest: false      // Optional: Include destination element in path
        },
        overlayCSS: {
            // Optional: Customize debug overlay appearance
            fill: 'rgba(255,255,255,0.2)',
            stroke: 'white',
            'stroke-width': '0px',
            'stroke-opacity': '0',
            'mix-blend-mode': 'multiply'
        }
    },
    showOverlay: true              // Optional: Enable the overlay
});

// Clean up when done
desirePath.destroy();
```

## API Reference

### createDesirePath(options)

Creates a new desire path between two elements.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `src` | HTMLElement | Source element |
| `dest` | HTMLElement | Destination element |
| `onPathMouseEnter` | Function | Callback when mouse enters path |
| `onPathMouseLeave` | Function | Callback when mouse leaves path |
| `options` | Object | Additional configuration options |
| `showOverlay` | boolean | Enable debug mode which shows the overlay |

## Directory structure

src/
├── index.ts              # Main export
├── core.ts               # Core instantiation, handling of events
├── geometry.ts           # Triangle and point-in-polygon math
└── overlay.ts            # Optional SVG overlay renderer 