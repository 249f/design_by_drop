import React, { useState, useRef, useCallback } from 'react';
import './Home.css';

// Basic shape components
const shapes = [
    { id: 'rectangle', name: 'Rectangle', type: 'rectangle' },
    { id: 'square', name: 'Square', type: 'square' },
    { id: 'circle', name: 'Circle', type: 'circle' },
    { id: 'text', name: 'Text', type: 'text' },
];

// Button components
const buttons = [
    { id: 'btn-primary', name: 'Primary', type: 'button', variant: 'primary' },
    { id: 'btn-secondary', name: 'Secondary', type: 'button', variant: 'secondary' },
    { id: 'btn-outline', name: 'Outline', type: 'button', variant: 'outline' },
];

// Screen presets
const screenPresets = [
    { id: 'desktop', name: 'Desktop', width: 1200, height: 800 },
    { id: 'tablet', name: 'Tablet', width: 768, height: 1024 },
    { id: 'mobile', name: 'Mobile', width: 375, height: 667 },
    { id: 'custom', name: 'Custom', width: null, height: null },
];

function Home() {
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [draggedShape, setDraggedShape] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [canvasBackground, setCanvasBackground] = useState('#1e1e2f');
    const [activeScreen, setActiveScreen] = useState('desktop');
    const [customSize, setCustomSize] = useState({ width: 1200, height: 800 });
    const canvasRef = useRef(null);
    const elementIdRef = useRef(1);

    // Get current screen size
    const getCurrentScreenSize = () => {
        if (activeScreen === 'custom') return customSize;
        const preset = screenPresets.find(s => s.id === activeScreen);
        return { width: preset.width, height: preset.height };
    };

    const screenSize = getCurrentScreenSize();

    // Get selected element data
    const selectedElementData = elements.find(el => el.id === selectedElement);

    // Generate HTML code from elements
    const generateHTML = () => {
        if (elements.length === 0) return '<div class="container">\n  <!-- Drop shapes here -->\n</div>';

        let html = '<div class="container">\n';
        elements.forEach((el) => {
            if (el.type === 'text') {
                html += `  <p class="element-${el.id}">${el.content || 'Text'}</p>\n`;
            } else if (el.type === 'button') {
                html += `  <button class="element-${el.id} btn-${el.variant}">${el.content || 'Button'}</button>\n`;
            } else {
                html += `  <div class="element-${el.id} shape-${el.type}"></div>\n`;
            }
        });
        html += '</div>';
        return html;
    };

    // Generate CSS code from elements
    const generateCSS = () => {
        let css = `body {\n  background-color: ${canvasBackground};\n}\n\n`;
        css += `.container {\n  position: relative;\n  width: ${screenSize.width}px;\n  height: ${screenSize.height}px;\n}\n\n`;

        elements.forEach((el) => {
            css += `.element-${el.id} {\n`;
            css += `  position: absolute;\n`;
            css += `  left: ${el.x}px;\n`;
            css += `  top: ${el.y}px;\n`;
            css += `  width: ${el.width}px;\n`;
            css += `  height: ${el.height}px;\n`;

            if (el.type === 'circle') {
                css += `  border-radius: 50%;\n`;
                css += `  background-color: ${el.backgroundColor};\n`;
            } else if (el.type === 'rectangle' || el.type === 'square') {
                css += `  background-color: ${el.backgroundColor};\n`;
                css += `  border-radius: 4px;\n`;
            } else if (el.type === 'text') {
                css += `  color: ${el.color};\n`;
                css += `  font-size: 16px;\n`;
            } else if (el.type === 'button') {
                css += `  background-color: ${el.backgroundColor};\n`;
                css += `  color: ${el.color};\n`;
                css += `  border: ${el.variant === 'outline' ? `2px solid ${el.backgroundColor}` : 'none'};\n`;
                css += `  border-radius: 6px;\n`;
                css += `  font-size: 14px;\n`;
                css += `  cursor: pointer;\n`;
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

        const getDefaultProps = () => {
            switch (draggedShape.type) {
                case 'button':
                    return {
                        width: 120,
                        height: 40,
                        backgroundColor: draggedShape.variant === 'primary' ? '#3498db' :
                            draggedShape.variant === 'secondary' ? '#6c757d' : 'transparent',
                        color: draggedShape.variant === 'outline' ? '#3498db' : '#ffffff',
                        content: 'Button',
                        variant: draggedShape.variant,
                    };
                case 'text':
                    return { width: 100, height: 30, backgroundColor: 'transparent', color: '#ffffff', content: 'Text' };
                case 'square':
                case 'circle':
                    return { width: 80, height: 80, backgroundColor: '#3498db', color: '#ffffff', content: '' };
                default:
                    return { width: 120, height: 80, backgroundColor: '#3498db', color: '#ffffff', content: '' };
            }
        };

        const props = getDefaultProps();
        const newElement = {
            id: elementIdRef.current++,
            type: draggedShape.type,
            x: x - props.width / 2,
            y: y - props.height / 2,
            ...props,
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
                    ? { ...el, backgroundColor: color, color: el.type === 'text' || el.type === 'button' ? color : el.color }
                    : el
            ));
        }
    };

    // Update element size manually
    const handleSizeChange = (dimension, value) => {
        if (selectedElement) {
            const numValue = parseInt(value) || 30;
            setElements(prev => prev.map(el =>
                el.id === selectedElement
                    ? { ...el, [dimension]: Math.max(30, numValue) }
                    : el
            ));
        }
    };

    // Copy code to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // Render element on canvas
    const renderElement = (element) => {
        const isButton = element.type === 'button';
        const style = {
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            backgroundColor: element.type === 'text' ? 'transparent' :
                (element.variant === 'outline' ? 'transparent' : element.backgroundColor),
            color: element.color,
            border: element.variant === 'outline' ? `2px solid ${element.backgroundColor}` : 'none',
        };

        return (
            <div
                key={element.id}
                className={`canvas-element ${element.type} ${element.variant || ''} ${selectedElement === element.id ? 'selected' : ''}`}
                style={style}
                onClick={(e) => handleElementClick(e, element)}
                onMouseDown={(e) => handleElementDrag(e, element.id)}
            >
                {element.type === 'text' && (
                    <span className="text-content">{element.content}</span>
                )}
                {isButton && (
                    <span className="button-content">{element.content}</span>
                )}

                {/* Resize Handles */}
                {selectedElement === element.id && (
                    <>
                        <div className="resize-handle nw" onMouseDown={(e) => handleResize(e, element.id, 'nw')} />
                        <div className="resize-handle ne" onMouseDown={(e) => handleResize(e, element.id, 'ne')} />
                        <div className="resize-handle sw" onMouseDown={(e) => handleResize(e, element.id, 'sw')} />
                        <div className="resize-handle se" onMouseDown={(e) => handleResize(e, element.id, 'se')} />
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="home-container">
            {/* Left Sidebar */}
            <aside className="sidebar">
                {/* Shapes */}
                <div className="sidebar-section">
                    <h2 className="sidebar-title">Shapes</h2>
                    <div className="shapes-list">
                        {shapes.map((shape) => (
                            <div
                                key={shape.id}
                                className="shape-item"
                                draggable
                                onDragStart={(e) => handleDragStart(e, shape)}
                            >
                                <div className={`shape-preview ${shape.type}`}></div>
                                <span>{shape.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="sidebar-section">
                    <h2 className="sidebar-title">Buttons</h2>
                    <div className="shapes-list">
                        {buttons.map((btn) => (
                            <div
                                key={btn.id}
                                className="shape-item"
                                draggable
                                onDragStart={(e) => handleDragStart(e, btn)}
                            >
                                <div className={`button-preview ${btn.variant}`}>{btn.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Properties Panel */}
                {selectedElementData && (
                    <div className="properties-panel">
                        <h3 className="panel-title">Properties</h3>

                        {/* Color Picker */}
                        <div className="property-group">
                            <label>Color</label>
                            <div className="color-input-row">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={selectedElementData.backgroundColor || '#3498db'}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="color-text-input"
                                    value={selectedElementData.backgroundColor || '#3498db'}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    placeholder="#3498db"
                                />
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

                        {/* Size Inputs */}
                        <div className="property-group">
                            <label>Size</label>
                            <div className="size-inputs">
                                <div className="size-input-group">
                                    <span>W</span>
                                    <input
                                        type="number"
                                        value={Math.round(selectedElementData.width)}
                                        onChange={(e) => handleSizeChange('width', e.target.value)}
                                        min="30"
                                    />
                                </div>
                                <span className="size-separator">×</span>
                                <div className="size-input-group">
                                    <span>H</span>
                                    <input
                                        type="number"
                                        value={Math.round(selectedElementData.height)}
                                        onChange={(e) => handleSizeChange('height', e.target.value)}
                                        min="30"
                                    />
                                </div>
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

            {/* Main Canvas Area */}
            <main className="canvas-container">
                {/* Toolbar */}
                <div className="canvas-toolbar">
                    {/* Screen Size Presets */}
                    <div className="screen-presets">
                        {screenPresets.map(preset => (
                            <button
                                key={preset.id}
                                className={`preset-btn ${activeScreen === preset.id ? 'active' : ''}`}
                                onClick={() => setActiveScreen(preset.id)}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>

                    {/* Custom Size Inputs */}
                    {activeScreen === 'custom' && (
                        <div className="custom-size-inputs">
                            <input
                                type="number"
                                value={customSize.width}
                                onChange={(e) => setCustomSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                                min="320"
                            />
                            <span>×</span>
                            <input
                                type="number"
                                value={customSize.height}
                                onChange={(e) => setCustomSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                                min="320"
                            />
                        </div>
                    )}

                    {/* Background Color */}
                    <div className="bg-color-control">
                        <label>Background:</label>
                        <input
                            type="color"
                            value={canvasBackground}
                            onChange={(e) => setCanvasBackground(e.target.value)}
                        />
                        <input
                            type="text"
                            className="bg-color-text"
                            value={canvasBackground}
                            onChange={(e) => setCanvasBackground(e.target.value)}
                            placeholder="#1e1e2f"
                        />
                    </div>
                </div>

                {/* Canvas */}
                <div className="canvas-wrapper">
                    <div
                        ref={canvasRef}
                        className="canvas"
                        style={{
                            width: screenSize.width,
                            height: screenSize.height,
                            backgroundColor: canvasBackground
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleCanvasClick}
                    >
                        {elements.length === 0 && (
                            <div className="canvas-placeholder">
                                Drag and drop shapes here
                            </div>
                        )}
                        {elements.map(renderElement)}
                    </div>
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
