import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    { id: 'desktop', name: 'Desktop', width: 1200, height: 800, mediaQuery: '@media (min-width: 1024px)' },
    { id: 'tablet', name: 'Tablet', width: 768, height: 1024, mediaQuery: '@media (min-width: 768px) and (max-width: 1023px)' },
    { id: 'mobile', name: 'Mobile', width: 375, height: 667, mediaQuery: '@media (max-width: 767px)' },
    { id: 'custom', name: 'Custom', width: null, height: null, mediaQuery: '' },
];

// Local storage key
const STORAGE_KEY = 'design_by_drop_workspace';

function Home() {
    // Load initial state from localStorage
    const loadFromStorage = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return null;
    };

    const savedState = loadFromStorage();

    const [elements, setElements] = useState(savedState?.elements || []);
    const [selectedElement, setSelectedElement] = useState(null);
    const [draggedShape, setDraggedShape] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [canvasBackground, setCanvasBackground] = useState(savedState?.canvasBackground || '#1e1e2f');
    const [activeScreen, setActiveScreen] = useState(savedState?.activeScreen || 'desktop');
    const [customSize, setCustomSize] = useState(savedState?.customSize || { width: 1200, height: 800 });
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showCodePanel, setShowCodePanel] = useState(false);

    const [showAlignmentHelpers, setShowAlignmentHelpers] = useState(true);
    const [alignmentLines, setAlignmentLines] = useState([]);

    // Store responsive styles per screen
    const [responsiveStyles, setResponsiveStyles] = useState(savedState?.responsiveStyles || {
        desktop: {},
        tablet: {},
        mobile: {},
    });

    const canvasRef = useRef(null);
    const elementIdRef = useRef(savedState?.nextId || 1);

    // Save to localStorage whenever state changes
    useEffect(() => {
        const stateToSave = {
            elements,
            canvasBackground,
            activeScreen,
            customSize,
            responsiveStyles,
            nextId: elementIdRef.current,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [elements, canvasBackground, activeScreen, customSize, responsiveStyles]);

    // Get current screen size
    const getCurrentScreenSize = () => {
        if (activeScreen === 'custom') return customSize;
        const preset = screenPresets.find(s => s.id === activeScreen);
        return { width: preset.width, height: preset.height };
    };

    const screenSize = getCurrentScreenSize();

    // Get selected element data
    const selectedElementData = elements.find(el => el.id === selectedElement);

    // Get element styles for current screen (with responsive overrides)
    const getElementStyles = useCallback((element) => {
        const baseStyles = { ...element };
        const screenOverrides = responsiveStyles[activeScreen]?.[element.id] || {};
        return { ...baseStyles, ...screenOverrides };
    }, [responsiveStyles, activeScreen]);

    // Update element style for current screen
    const updateElementForScreen = useCallback((elementId, updates) => {
        if (activeScreen === 'desktop') {
            // Desktop is the base, update element directly
            setElements(prev => prev.map(el =>
                el.id === elementId ? { ...el, ...updates } : el
            ));
        } else {
            // Store responsive overrides
            setResponsiveStyles(prev => ({
                ...prev,
                [activeScreen]: {
                    ...prev[activeScreen],
                    [elementId]: {
                        ...prev[activeScreen]?.[elementId],
                        ...updates,
                    }
                }
            }));
        }
    }, [activeScreen, setElements, setResponsiveStyles]);

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

    // Generate CSS code from elements with media queries
    const generateCSS = () => {
        let css = `body {\n  background-color: ${canvasBackground};\n}\n\n`;
        css += `.container {\n  position: relative;\n  width: 100%;\n  max-width: ${screenSize.width}px;\n  min-height: ${screenSize.height}px;\n  margin: 0 auto;\n}\n\n`;

        // Base styles (desktop)
        elements.forEach((el) => {
            const styles = getElementStyles(el);
            css += generateElementCSS(el.id, styles);
        });

        // Media queries for tablet and mobile
        ['tablet', 'mobile'].forEach(screen => {
            const preset = screenPresets.find(s => s.id === screen);
            const overrides = responsiveStyles[screen] || {};

            if (Object.keys(overrides).length > 0) {
                css += `\n${preset.mediaQuery} {\n`;
                Object.entries(overrides).forEach(([elementId, styles]) => {
                    const el = elements.find(e => e.id === parseInt(elementId));
                    if (el) {
                        css += generateElementCSS(el.id, { ...el, ...styles }, '  ');
                    }
                });
                css += `}\n`;
            }
        });

        return css;
    };

    // Generate CSS for a single element
    const generateElementCSS = (id, el, indent = '') => {
        let css = `${indent}.element-${id} {\n`;
        css += `${indent}  position: absolute;\n`;
        css += `${indent}  left: ${el.x}px;\n`;
        css += `${indent}  top: ${el.y}px;\n`;
        css += `${indent}  width: ${el.width}px;\n`;
        css += `${indent}  height: ${el.height}px;\n`;

        // Rotation
        if (el.rotation && el.rotation !== 0) {
            css += `${indent}  transform: rotate(${el.rotation}deg);\n`;
        }

        // Border styles
        if (el.borderWidth && el.borderWidth > 0) {
            css += `${indent}  border: ${el.borderWidth}px solid ${el.borderColor || '#000'};\n`;
        }
        if (el.borderRadius !== undefined) {
            css += `${indent}  border-radius: ${el.borderRadius}px;\n`;
        }

        if (el.type === 'circle') {
            css += `${indent}  border-radius: 50%;\n`;
            css += `${indent}  background-color: ${el.backgroundColor};\n`;
        } else if (el.type === 'rectangle' || el.type === 'square') {
            css += `${indent}  background-color: ${el.backgroundColor};\n`;
        } else if (el.type === 'text') {
            css += `${indent}  color: ${el.color};\n`;
            css += `${indent}  font-size: ${el.fontSize || 16}px;\n`;
        } else if (el.type === 'button') {
            css += `${indent}  background-color: ${el.backgroundColor};\n`;
            css += `${indent}  color: ${el.color};\n`;
            css += `${indent}  font-size: ${el.fontSize || 16}px;\n`;
            if (el.variant === 'outline') {
                css += `${indent}  border: 2px solid ${el.backgroundColor};\n`;
                css += `${indent}  background-color: transparent;\n`;
            }
            css += `${indent}  cursor: pointer;\n`;
        }
        css += `${indent}}\n\n`;
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
        const x = (e.clientX - rect.left) / zoomLevel;
        const y = (e.clientY - rect.top) / zoomLevel;

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
                        fontSize: 16,
                    };
                case 'text':
                    return { width: 100, height: 30, backgroundColor: 'transparent', color: '#ffffff', content: 'Text', fontSize: 16 };
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
            borderRadius: draggedShape.type === 'circle' ? 50 : 4,
            borderWidth: 0,
            borderColor: '#000000',
            locked: false,
            rotation: 0,
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
        const element = elements.find(el => el.id === elementId);
        if (isResizing || !canvasRef.current || element?.locked) return;

        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const styles = getElementStyles(element);
        const startElX = styles.x;
        const startElY = styles.y;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            let newX = startElX + dx;
            let newY = startElY + dy;

            // Alignment calculations
            const newAlignmentLines = [];
            if (showAlignmentHelpers) {
                const threshold = 5;
                const center = newX + styles.width / 2;
                const right = newX + styles.width;
                const middle = newY + styles.height / 2;
                const bottom = newY + styles.height;

                elements.forEach(other => {
                    if (other.id === elementId) return;
                    const otherStyles = getElementStyles(other);
                    const otherRight = otherStyles.x + otherStyles.width;
                    const otherBottom = otherStyles.y + otherStyles.height;
                    const otherCenter = otherStyles.x + otherStyles.width / 2;
                    const otherMiddle = otherStyles.y + otherStyles.height / 2;

                    // Vertical Alignment
                    if (Math.abs(newX - otherStyles.x) < threshold) {
                        newAlignmentLines.push({ type: 'v', x: otherStyles.x, y1: Math.min(newY, otherStyles.y), y2: Math.max(bottom, otherBottom) });
                        newX = otherStyles.x;
                    } else if (Math.abs(newX - otherRight) < threshold) {
                        newAlignmentLines.push({ type: 'v', x: otherRight, y1: Math.min(newY, otherStyles.y), y2: Math.max(bottom, otherBottom) });
                        newX = otherRight;
                    } else if (Math.abs(center - otherCenter) < threshold) { // Center alignment
                        newAlignmentLines.push({ type: 'v', x: otherCenter, y1: Math.min(newY, otherStyles.y), y2: Math.max(bottom, otherBottom) });
                        newX = otherCenter - styles.width / 2;
                    }

                    if (Math.abs(right - otherStyles.x) < threshold) {
                        newAlignmentLines.push({ type: 'v', x: otherStyles.x, y1: Math.min(newY, otherStyles.y), y2: Math.max(bottom, otherBottom) });
                        newX = otherStyles.x - styles.width;
                    } else if (Math.abs(right - otherRight) < threshold) {
                        newAlignmentLines.push({ type: 'v', x: otherRight, y1: Math.min(newY, otherStyles.y), y2: Math.max(bottom, otherBottom) });
                        newX = otherRight - styles.width;
                    }

                    // Horizontal Alignment
                    if (Math.abs(newY - otherStyles.y) < threshold) {
                        newAlignmentLines.push({ type: 'h', y: otherStyles.y, x1: Math.min(newX, otherStyles.x), x2: Math.max(right, otherRight) });
                        newY = otherStyles.y;
                    } else if (Math.abs(newY - otherBottom) < threshold) {
                        newAlignmentLines.push({ type: 'h', y: otherBottom, x1: Math.min(newX, otherStyles.x), x2: Math.max(right, otherRight) });
                        newY = otherBottom;
                    } else if (Math.abs(middle - otherMiddle) < threshold) { // Middle alignment
                        newAlignmentLines.push({ type: 'h', y: otherMiddle, x1: Math.min(newX, otherStyles.x), x2: Math.max(right, otherRight) });
                        newY = otherMiddle - styles.height / 2;
                    }

                    if (Math.abs(bottom - otherStyles.y) < threshold) {
                        newAlignmentLines.push({ type: 'h', y: otherStyles.y, x1: Math.min(newX, otherStyles.x), x2: Math.max(right, otherRight) });
                        newY = otherStyles.y - styles.height;
                    } else if (Math.abs(bottom - otherBottom) < threshold) {
                        newAlignmentLines.push({ type: 'h', y: otherBottom, x1: Math.min(newX, otherStyles.x), x2: Math.max(right, otherRight) });
                        newY = otherBottom - styles.height;
                    }
                });
            }
            setAlignmentLines(newAlignmentLines);

            updateElementForScreen(elementId, { x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setAlignmentLines([]);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle resize
    const handleResize = useCallback((e, elementId, corner) => {
        const element = elements.find(el => el.id === elementId);
        if (element?.locked) return;

        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const styles = getElementStyles(element);
        const startWidth = styles.width;
        const startHeight = styles.height;
        const startElX = styles.x;
        const startElY = styles.y;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startElX;
            let newY = startElY;

            switch (corner) {
                case 'se':
                    newWidth = startWidth + dx;
                    newHeight = startHeight + dy;
                    break;
                case 'sw':
                    newWidth = startWidth - dx;
                    newHeight = startHeight + dy;
                    newX = startElX + (startWidth - newWidth);
                    break;
                case 'ne':
                    newWidth = startWidth + dx;
                    newHeight = startHeight - dy;
                    newY = startElY + (startHeight - newHeight);
                    break;
                case 'nw':
                    newWidth = startWidth - dx;
                    newHeight = startHeight - dy;
                    newX = startElX + (startWidth - newWidth);
                    newY = startElY + (startHeight - newHeight);
                    break;
                case 'n':
                    newHeight = startHeight - dy;
                    newY = startElY + (startHeight - newHeight);
                    break;
                case 's':
                    newHeight = startHeight + dy;
                    break;
                case 'e':
                    newWidth = startWidth + dx;
                    break;
                case 'w':
                    newWidth = startWidth - dx;
                    newX = startElX + (startWidth - newWidth);
                    break;
                default:
                    break;
            }

            updateElementForScreen(elementId, {
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [elements, getElementStyles, updateElementForScreen]);

    // Handle canvas click to deselect
    const handleCanvasClick = () => {
        setSelectedElement(null);
    };

    // Delete selected element
    const handleDeleteSelected = () => {
        if (selectedElement) {
            setElements(elements.filter(el => el.id !== selectedElement));
            // Also clean up responsive styles
            setResponsiveStyles(prev => {
                const newStyles = { ...prev };
                Object.keys(newStyles).forEach(screen => {
                    if (newStyles[screen][selectedElement]) {
                        delete newStyles[screen][selectedElement];
                    }
                });
                return newStyles;
            });
            setSelectedElement(null);
        }
    };

    // Toggle element lock
    const handleToggleLock = () => {
        if (selectedElement) {
            setElements(prev => prev.map(el =>
                el.id === selectedElement ? { ...el, locked: !el.locked } : el
            ));
        }
    };

    // Update element property
    const updateElementProperty = (property, value) => {
        if (selectedElement) {
            const element = elements.find(el => el.id === selectedElement);
            if (element?.locked && property !== 'locked') return;

            if (property === 'backgroundColor' || property === 'color') {
                updateElementForScreen(selectedElement, { [property]: value });
            } else {
                // Base properties update directly
                setElements(prev => prev.map(el =>
                    el.id === selectedElement ? { ...el, [property]: value } : el
                ));
            }
        }
    };

    // Update element size manually
    const handleSizeChange = (dimension, value) => {
        if (selectedElement) {
            const element = elements.find(el => el.id === selectedElement);
            if (element?.locked) return;

            const numValue = parseInt(value) || 0;
            updateElementForScreen(selectedElement, { [dimension]: numValue });
        }
    };

    // Copy code to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // Clear workspace
    const clearWorkspace = () => {
        if (window.confirm('Are you sure you want to clear the workspace?')) {
            setElements([]);
            setResponsiveStyles({ desktop: {}, tablet: {}, mobile: {} });
            setSelectedElement(null);
            elementIdRef.current = 1;
        }
    };

    // Render element on canvas
    const renderElement = (element) => {
        const styles = getElementStyles(element);
        const isButton = element.type === 'button';

        const style = {
            left: styles.x,
            top: styles.y,
            width: styles.width,
            height: styles.height,
            backgroundColor: element.type === 'text' ? 'transparent' :
                (element.variant === 'outline' ? 'transparent' : styles.backgroundColor),
            color: styles.color,
            border: element.variant === 'outline'
                ? `2px solid ${styles.backgroundColor}`
                : (styles.borderWidth > 0 ? `${styles.borderWidth}px solid ${styles.borderColor}` : 'none'),
            borderRadius: element.type === 'circle' ? '50%' : `${styles.borderRadius || 0}px`,
            opacity: element.locked ? 0.7 : 1,
            transform: styles.rotation ? `rotate(${styles.rotation}deg)` : undefined,
            fontSize: (element.type === 'text' || element.type === 'button') ? `${styles.fontSize || 16}px` : undefined,
        };

        return (
            <div
                key={element.id}
                className={`canvas-element ${element.type} ${element.variant || ''} ${selectedElement === element.id ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
                style={style}
                onClick={(e) => handleElementClick(e, element)}
                onMouseDown={(e) => !element.locked && handleElementDrag(e, element.id)}
            >
                {element.type === 'text' && (
                    <span className="text-content">{element.content}</span>
                )}
                {isButton && (
                    <span className="button-content">{element.content}</span>
                )}

                {/* Lock indicator */}
                {element.locked && (
                    <div className="lock-indicator"></div>
                )}

                {/* Resize Handles */}
                {selectedElement === element.id && !element.locked && (
                    <>
                        <div className="resize-handle nw" onMouseDown={(e) => handleResize(e, element.id, 'nw')} />
                        <div className="resize-handle ne" onMouseDown={(e) => handleResize(e, element.id, 'ne')} />
                        <div className="resize-handle sw" onMouseDown={(e) => handleResize(e, element.id, 'sw')} />
                        <div className="resize-handle se" onMouseDown={(e) => handleResize(e, element.id, 'se')} />
                        {element.useEightJoints && (
                            <>
                                <div className="resize-handle n" onMouseDown={(e) => handleResize(e, element.id, 'n')} />
                                <div className="resize-handle s" onMouseDown={(e) => handleResize(e, element.id, 's')} />
                                <div className="resize-handle e" onMouseDown={(e) => handleResize(e, element.id, 'e')} />
                                <div className="resize-handle w" onMouseDown={(e) => handleResize(e, element.id, 'w')} />
                            </>
                        )}
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

                {/* Global Settings */}
                <div className="sidebar-section">
                    <h2 className="sidebar-title">Settings</h2>
                    <div className="checkbox-row">
                        <input
                            type="checkbox"
                            id="showAlignmentHelpers"
                            checked={showAlignmentHelpers}
                            onChange={(e) => setShowAlignmentHelpers(e.target.checked)}
                        />
                        <label htmlFor="showAlignmentHelpers" className="checkbox-label">Alignment Helper</label>
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

                        {/* Lock Toggle */}
                        <div className="property-group">
                            <button
                                className={`lock-btn ${selectedElementData.locked ? 'locked' : ''}`}
                                onClick={handleToggleLock}
                            >
                                {selectedElementData.locked ? ' Unlock Element' : ' Lock Element'}
                            </button>
                        </div>

                        {/* Text Content Editing */}
                        {(selectedElementData.type === 'text' || selectedElementData.type === 'button') && (
                            <div className="property-group">
                                <label>Text Content</label>
                                <input
                                    type="text"
                                    className="text-content-input"
                                    value={selectedElementData.content || ''}
                                    onChange={(e) => updateElementProperty('content', e.target.value)}
                                    disabled={selectedElementData.locked}
                                />
                            </div>
                        )}

                        {/* Text Color Picker */}
                        {(selectedElementData.type === 'text' || selectedElementData.type === 'button') && (
                            <div className="property-group">
                                <label>Text Color</label>
                                <div className="color-input-row">
                                    <input
                                        type="color"
                                        className="color-picker"
                                        value={getElementStyles(selectedElementData).color || '#ffffff'}
                                        onChange={(e) => updateElementProperty('color', e.target.value)}
                                        disabled={selectedElementData.locked}
                                    />
                                    <input
                                        type="text"
                                        className="color-text-input"
                                        value={getElementStyles(selectedElementData).color || '#ffffff'}
                                        onChange={(e) => updateElementProperty('color', e.target.value)}
                                        disabled={selectedElementData.locked}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Font Size Control */}
                        {(selectedElementData.type === 'text' || selectedElementData.type === 'button') && (
                            <div className="property-group">
                                <label>Font Size</label>
                                <div className="slider-input">
                                    <input
                                        type="range"
                                        min="8"
                                        max="72"
                                        value={getElementStyles(selectedElementData).fontSize || 16}
                                        onChange={(e) => updateElementProperty('fontSize', parseInt(e.target.value))}
                                        disabled={selectedElementData.locked}
                                    />
                                    <span>{getElementStyles(selectedElementData).fontSize || 16}px</span>
                                </div>
                            </div>
                        )}

                        {/* Rotation Control */}
                        <div className="property-group">
                            <label>Rotation</label>
                            <div className="slider-input">
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={getElementStyles(selectedElementData).rotation || 0}
                                    onChange={(e) => updateElementProperty('rotation', parseInt(e.target.value))}
                                    disabled={selectedElementData.locked}
                                />
                                <span>{getElementStyles(selectedElementData).rotation || 0}°</span>
                            </div>
                        </div>

                        {/* 8-Point Resizing Toggle */}
                        <div className="property-group">
                            <div className="checkbox-row">
                                <input
                                    type="checkbox"
                                    id="useEightJoints"
                                    checked={selectedElementData.useEightJoints || false}
                                    onChange={(e) => updateElementProperty('useEightJoints', e.target.checked)}
                                    disabled={selectedElementData.locked}
                                />
                                <label htmlFor="useEightJoints" className="checkbox-label">Use 8 Resize Joints</label>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="property-group">
                            <label>Fill Color</label>
                            <div className="color-input-row">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={getElementStyles(selectedElementData).backgroundColor || '#3498db'}
                                    onChange={(e) => updateElementProperty('backgroundColor', e.target.value)}
                                    disabled={selectedElementData.locked}
                                />
                                <input
                                    type="text"
                                    className="color-text-input"
                                    value={getElementStyles(selectedElementData).backgroundColor || '#3498db'}
                                    onChange={(e) => updateElementProperty('backgroundColor', e.target.value)}
                                    disabled={selectedElementData.locked}
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
                                        onClick={() => !selectedElementData.locked && updateElementProperty('backgroundColor', color)}
                                        disabled={selectedElementData.locked}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Border Controls */}
                        <div className="property-group">
                            <label>Border Radius</label>
                            <div className="slider-input">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={selectedElementData.borderRadius || 0}
                                    onChange={(e) => updateElementProperty('borderRadius', parseInt(e.target.value))}
                                    disabled={selectedElementData.locked || selectedElementData.type === 'circle'}
                                />
                                <span>{selectedElementData.borderRadius || 0}px</span>
                            </div>
                        </div>

                        <div className="property-group">
                            <label>Border Width</label>
                            <div className="slider-input">
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={selectedElementData.borderWidth || 0}
                                    onChange={(e) => updateElementProperty('borderWidth', parseInt(e.target.value))}
                                    disabled={selectedElementData.locked}
                                />
                                <span>{selectedElementData.borderWidth || 0}px</span>
                            </div>
                        </div>

                        <div className="property-group">
                            <label>Border Color</label>
                            <div className="color-input-row">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={selectedElementData.borderColor || '#000000'}
                                    onChange={(e) => updateElementProperty('borderColor', e.target.value)}
                                    disabled={selectedElementData.locked}
                                />
                                <input
                                    type="text"
                                    className="color-text-input"
                                    value={selectedElementData.borderColor || '#000000'}
                                    onChange={(e) => updateElementProperty('borderColor', e.target.value)}
                                    disabled={selectedElementData.locked}
                                />
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
                                        value={Math.round(getElementStyles(selectedElementData).width)}
                                        onChange={(e) => handleSizeChange('width', e.target.value)}
                                        disabled={selectedElementData.locked}
                                    />
                                </div>
                                <span className="size-separator">×</span>
                                <div className="size-input-group">
                                    <span>H</span>
                                    <input
                                        type="number"
                                        value={Math.round(getElementStyles(selectedElementData).height)}
                                        onChange={(e) => handleSizeChange('height', e.target.value)}
                                        disabled={selectedElementData.locked}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Element Actions */}
                <div className="element-actions">
                    {selectedElement && (
                        <button className="delete-btn" onClick={handleDeleteSelected}>
                            Delete Selected
                        </button>
                    )}
                    <button className="clear-btn" onClick={clearWorkspace}>
                        Clear Workspace
                    </button>
                </div>
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
                                title={preset.mediaQuery || 'Custom size'}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>

                    {/* Responsive indicator */}
                    {activeScreen !== 'desktop' && activeScreen !== 'custom' && (
                        <span className="responsive-indicator">
                            Editing {activeScreen} styles
                        </span>
                    )}

                    {/* Custom Size Inputs */}
                    {activeScreen === 'custom' && (
                        <div className="custom-size-inputs">
                            <input
                                type="number"
                                value={customSize.width}
                                onChange={(e) => setCustomSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                            />
                            <span>×</span>
                            <input
                                type="number"
                                value={customSize.height}
                                onChange={(e) => setCustomSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
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
                        />
                    </div>

                    {/* Zoom Controls */}
                    <div className="zoom-controls">
                        <button
                            className="zoom-btn"
                            onClick={() => setZoomLevel(prev => Math.max(0.25, prev - 0.25))}
                            disabled={zoomLevel <= 0.25}
                        >
                            −
                        </button>
                        <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                        <button
                            className="zoom-btn"
                            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
                            disabled={zoomLevel >= 2}
                        >
                            +
                        </button>
                        <button
                            className="zoom-btn reset"
                            onClick={() => setZoomLevel(1)}
                        >
                            Reset
                        </button>
                    </div>

                    {/* See Code Button */}
                    <button
                        className={`see-code-btn ${showCodePanel ? 'active' : ''}`}
                        onClick={() => setShowCodePanel(!showCodePanel)}
                    >
                        {showCodePanel ? '✕ Hide Code' : '{ } See Code'}
                    </button>
                </div>

                {/* Canvas */}
                <div className="canvas-wrapper" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
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

                        {/* Alignment Lines */}
                        {alignmentLines.map((line, index) => (
                            <div
                                key={index}
                                className="alignment-line"
                                style={{
                                    left: line.type === 'v' ? line.x : line.x1,
                                    top: line.type === 'h' ? line.y : line.y1,
                                    width: line.type === 'h' ? (line.x2 - line.x1) : 1,
                                    height: line.type === 'v' ? (line.y2 - line.y1) : 1,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Code Panel Overlay */}
            {showCodePanel && (
                <aside className="code-panel overlay-panel">
                    <div className="code-panel-header">
                        <h2>Generated Code</h2>
                        <button className="close-panel-btn" onClick={() => setShowCodePanel(false)}>✕</button>
                    </div>
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
            )}
        </div>
    );
}

export default Home;
