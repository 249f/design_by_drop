import React, { useState, useRef } from 'react';
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
    const canvasRef = useRef(null);
    const elementIdRef = useRef(1);

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
            content: draggedShape.type === 'text' ? 'Text' : '',
        };

        setElements([...elements, newElement]);
        setDraggedShape(null);
    };

    // Handle element selection
    const handleElementClick = (e, element) => {
        e.stopPropagation();
        setSelectedElement(element.id);
    };

    // Handle element drag within canvas
    const handleElementDrag = (e, elementId) => {
        if (!canvasRef.current) return;

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
                                <span className="text-content">{element.content}</span>
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
