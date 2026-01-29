import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ArrowLeft } from 'lucide-react';
import './DesktopOnly.css';

const DesktopOnly = ({ children }) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isDesktop) {
        return (
            <div className="do-overlay">
                <div className="do-container">
                    <div className="do-icon">
                        <Monitor size={64} />
                    </div>
                    <h1 className="do-title">Desktop Required</h1>
                    <p className="do-message">
                        You are using a mobile device, DesignByDrop is built for desktop use.
                        Please switch to a computer to start creating :)
                    </p>
                    <Link to="/" className="do-back-link">
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return children;
};

export default DesktopOnly;
