# Tailight
https://github.com/user-attachments/assets/dbb21b92-af2e-488b-9a40-a17aeab9a02b

## About
Tailight.js is an experimental library created to help create hoverable desire paths between any two HTML elements. It also can be used to create a light path between two boxed divs.

Want to see the live example? [View it by clicking here](https://www.jameshsi.com/tailight-core)

## Installation

Since this is a local project, you can clone it and build it:

```bash
# Clone the repository
git clone https://github.com/jhsi/tailight-core.git
cd tailight-core

# Install dependencies
npm install

# Build the library
npm run build
```

## Usage

Import the library and create a desire path between two HTML elements:

```javascript
// Import from the built file
import { createDesirePath } from './dist/tailight-core.es.js';

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

```
src/
├── index.ts              # Main export
├── core.ts               # Core instantiation, handling of events
├── geometry.ts           # Triangle and point-in-polygon math
└── overlay.ts            # Optional SVG overlay renderer 
```
