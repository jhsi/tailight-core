# Trailwind Core Examples

This directory contains examples demonstrating how to use the Trailwind Core library.

## Running the Examples

The examples use Vite for development and building. Here's how to run them:

### Development Mode
```bash
# First, build the core library from the root directory
cd ..
npm run build

# Then, in the examples directory
cd examples
npm install
npm run dev
```

This will start a development server with hot module reloading. Visit the URL shown in your terminal (typically `http://localhost:5173`).

### Building for Production
```bash
# From the examples directory
npm run build
```

The built examples will be available in the `dist/examples` directory.

## Available Examples

### Basic Example
Located in `basic/index.html`, this example demonstrates:
- Creating a desire path between two elements
- Using the `onPathEnter` and `onPathLeave` callbacks
- Enabling debug mode to visualize the polygon
- Setting a custom tolerance value

## More Examples Coming Soon
- Advanced usage examples
- Custom polygon visualization
- Dynamic element positioning
- Multiple desire paths 