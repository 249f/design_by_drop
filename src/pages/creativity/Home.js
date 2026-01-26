import React, { useState, useRef, useCallback } from 'react';
import './Home.css';

// Basic shape components
const shapes = [
    { id: 'rectangle', name: 'Rectangle', type: 'rectangle' },
    { id: 'square', name: 'Square', type: 'square' },
    { id: 'circle', name: 'Circle', type: 'circle' },
    { id: 'text', name: 'Text', type: 'text' },
];

function Home() {
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [draggedShape, setDraggedShape] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const canvasRef = useRef(null);
    const elementIdRef = useRef(1);

    // Get selected element data
    const selectedElementData = elements.find(el => el.id === selectedElement);

    // Generate HTML code from elements
    const generateHTML = () => {
        if (elements.length === 0) return '<div class="container">\n  <!-- Drop shapes here -->\n</div>';

        let html = '<div class="container">\n';
        elements.forEach((el) => {
            const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;`;
            if (el.type === 'text') {
                html += `  <p class="element-${el.id}" style="${style}">${el.content || 'Text'}</p>\n`;
            } else {
                html += `  <div class="element-${el.id} shape-${el.type}" style="${style}"></div>\n`;
            }
        });
        html += '</div>';
        return html;
    };

    // Generate CSS code from elements
    const generateCSS = () => {
        let css = `.container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\n`;

        elements.forEach((el) => {
            css += `.element-${el.id} {\n`;
            css += `  position: absolute;\n`;
            css += `  left: ${el.x}px;\n`;
            css += `  top: ${el.y}px;\n`;
            css += `  width: ${el.width}px;\n`;
            css += `  height: ${el.height}px;\n`;

            if (el.type === 'circle') {
                css += `  border-radius: 50%;\n`;
                css += `  background-color: ${el.backgroundColor || '#3498db'};\n`;
            } else if (el.type === 'rectangle' || el.type === 'square') {
                css += `  background-color: ${el.backgroundColor || '#3498db'};\n`;
                css += `  border-radius: 4px;\n`;
            } else if (el.type === 'text') {
                css += `  color: ${el.color || '#333'};\n`;
                css += `  font-size: 16px;\n`;
            }
            css += `}\n\n`;
        });

        return css;
    };

    // Handle drag start from shape palette
    const handleDragStart = (e, shape) => {
        setDraggedShape(shape);
        e.dataTransfer.effectAllowed = 'copy';
    };

    // Handle drag over canvas
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Handle drop on canvas
    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggedShape || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newElement = {
            id: elementIdRef.current++,
            type: draggedShape.type,
            x: x - 40,
            y: y - 40,
            width: draggedShape.type === 'square' || draggedShape.type === 'circle' ? 80 : 120,
            height: draggedShape.type === 'text' ? 30 : 80,
            backgroundColor: '#3498db',
            color: '#ffffff',
            content: draggedShape.type === 'text' ? 'Text' : '',
        };

        setElements([...elements, newElement]);
        setSelectedElement(newElement.id);
        setDraggedShape(null);
    };

    // Handle element selection
    const handleElementClick = (e, element) => {
        e.stopPropagation();
        if (!isResizing) {
            setSelectedElement(element.id);
        }
    };

    // Handle element drag within canvas
    const handleElementDrag = (e, elementId) => {
        if (isResizing || !canvasRef.current) return;

        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const element = elements.find(el => el.id === elementId);
        const startElX = element.x;
        const startElY = element.y;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            setElements(prev => prev.map(el =>
                el.id === elementId
                    ? { ...el, x: startElX + dx, y: startElY + dy }
                    : el
            ));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle resize
    const handleResize = useCallback((e, elementId, corner) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const element = elements.find(el => el.id === elementId);
        const startWidth = element.width;
        const startHeight = element.height;
        const startElX = element.x;
        const startElY = element.y;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startElX;
            let newY = startElY;

            switch (corner) {
                case 'se':
                    newWidth = Math.max(30, startWidth + dx);
                    newHeight = Math.max(30, startHeight + dy);
                    break;
                case 'sw':
                    newWidth = Math.max(30, startWidth - dx);
                    newHeight = Math.max(30, startHeight + dy);
                    newX = startElX + (startWidth - newWidth);
                    break;
                case 'ne':
                    newWidth = Math.max(30, startWidth + dx);
                    newHeight = Math.max(30, startHeight - dy);
                    newY = startElY + (startHeight - newHeight);
                    break;
                case 'nw':
                    newWidth = Math.max(30, startWidth - dx);
                    newHeight = Math.max(30, startHeight - dy);
                    newX = startElX + (startWidth - newWidth);
                    newY = startElY + (startHeight - newHeight);
                    break;
                default:
                    break;
            }

            setElements(prev => prev.map(el =>
                el.id === elementId
                    ? { ...el, width: newWidth, height: newHeight, x: newX, y: newY }
                    : el
            ));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [elements]);

    // Handle canvas click to deselect
    const handleCanvasClick = () => {
        setSelectedElement(null);
    };

    // Delete selected element
    const handleDeleteSelected = () => {
        if (selectedElement) {
            setElements(elements.filter(el => el.id !== selectedElement));
            setSelectedElement(null);
        }
    };

    // Update element color
    const handleColorChange = (color) => {
        if (selectedElement) {
            setElements(prev => prev.map(el =>
                el.id === selectedElement
                    ? { ...el, backgroundColor: color, color: color }
                    : el
            ));
        }
    };

    // Copy code to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="home-container">
            {/* Left Sidebar - Shape Palette */}
            <aside className="sidebar">
                <h2 className="sidebar-title">Shapes</h2>
                <div className="shapes-list">
                    {shapes.map((shape) => (
                        <div
                            key={shape.id}
                            className={`shape-item shape-item-${shape.type}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, shape)}
                        >
                            <div className={`shape-preview ${shape.type}`}></div>
                            <span>{shape.name}</span>
                        </div>
                    ))}
                </div>

                {/* Properties Panel */}
                {selectedElementData && (
                    <div className="properties-panel">
                        <h3 className="panel-title">Properties</h3>

                        {/* Color Picker */}
                        <div className="property-group">
                            <label>Color</label>
                            <div className="color-picker-wrapper">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={selectedElementData.backgroundColor || '#3498db'}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                />
                                <span className="color-value">
                                    {selectedElementData.backgroundColor || '#3498db'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Colors */}
                        <div className="property-group">
                            <label>Quick Colors</label>
                            <div className="quick-colors">
                                {['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#ecf0f1'].map(color => (
                                    <button
                                        key={color}
                                        className="quick-color-btn"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorChange(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Info */}
                        <div className="property-group">
                            <label>Size</label>
                            <div className="size-info">
                                <span>{Math.round(selectedElementData.width)} × {Math.round(selectedElementData.height)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {selectedElement && (
                    <div className="element-actions">
                        <button className="delete-btn" onClick={handleDeleteSelected}>
                            Delete Selected
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Canvas */}
            <main className="canvas-container">
                <div
                    ref={canvasRef}
                    className="canvas"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleCanvasClick}
                >
                    {elements.length === 0 && (
                        <div className="canvas-placeholder">
                            Drag and drop shapes here
                        </div>
                    )}
                    {elements.map((element) => (
                        <div
                            key={element.id}
                            className={`canvas-element ${element.type} ${selectedElement === element.id ? 'selected' : ''}`}
                            style={{
                                left: element.x,
                                top: element.y,
                                width: element.width,
                                height: element.height,
                                backgroundColor: element.type !== 'text' ? element.backgroundColor : 'transparent',
                            }}
                            onClick={(e) => handleElementClick(e, element)}
                            onMouseDown={(e) => handleElementDrag(e, element.id)}
                        >
                            {element.type === 'text' && (
                                <span className="text-content" style={{ color: element.color }}>{element.content}</span>
                            )}

                            {/* Resize Handles */}
                            {selectedElement === element.id && (
                                <>
                                    <div
                                        className="resize-handle nw"
                                        onMouseDown={(e) => handleResize(e, element.id, 'nw')}
                                    />
                                    <div
                                        className="resize-handle ne"
                                        onMouseDown={(e) => handleResize(e, element.id, 'ne')}
                                    />
                                    <div
                                        className="resize-handle sw"
                                        onMouseDown={(e) => handleResize(e, element.id, 'sw')}
                                    />
                                    <div
                                        className="resize-handle se"
                                        onMouseDown={(e) => handleResize(e, element.id, 'se')}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Right Panel - Code Output */}
            <aside className="code-panel">
                <div className="code-section">
                    <div className="code-header">
                        <h3>HTML</h3>
                        <button className="copy-btn" onClick={() => copyToClipboard(generateHTML())}>
                            Copy
                        </button>
                    </div>
                    <pre className="code-output">
                        <code>{generateHTML()}</code>
                    </pre>
                </div>

                <div className="code-section">
                    <div className="code-header">
                        <h3>CSS</h3>
                        <button className="copy-btn" onClick={() => copyToClipboard(generateCSS())}>
                            Copy
                        </button>
                    </div>
                    <pre className="code-output">
                        <code>{generateCSS()}</code>
                    </pre>
                </div>
            </aside>
        </div>
    );
}

export default Home;
