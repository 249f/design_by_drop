import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { Github, Instagram, Linkedin, Facebook } from 'lucide-react';


const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="lp-navbar">
                <div className="lp-logo">DesignByDrop</div>
                <div className="lp-nav-links">
                    <a href="#features" className="lp-nav-link">Features</a>
                    <a href="#about" className="lp-nav-link">About</a>
                    <a href="https://github.com/249f" className="lp-nav-link">GitHub</a>
                </div>
                <Link to="/creativity/home" className="lp-btn-primary">creativity Home</Link>
            </nav>

            {/* Hero Section */}
            <section className="lp-hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-badge">This is a beta version, much more to come :)</div>
                    <h1 className="lp-hero-title">
                        <span>I Hate Coding Syntax</span><br />
                        This is why I created DesignByDrop
                    </h1>
                    <p className="lp-hero-subtitle">
                        done with vibe coding era now its time to vibe designing, the free open source tool for visual web design giving you a ready to copy code, say goodbye to coding syntax and hello to visual design :)
                    </p>
                    <div className="lp-cta-group">
                        <Link to="/creativity/home" className="lp-btn-primary lp-btn-large">Start Creating</Link>
                        <a href="#features" className="lp-btn-secondary">Learn More</a>
                    </div>
                </div>
                <div className="lp-scroll-down">
                    <span>︾</span>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="lp-features">
                <div className="lp-section-header">
                    <h2 className="lp-section-title">Everything you need</h2>
                    <p style={{ color: 'var(--lp-text-muted)' }}>Powerful tools for visual creation</p>
                </div>

                <div className="lp-grid">
                    <div className="lp-card">
                        <div className="lp-card-icon">1</div>
                        <h3>Visual Editing</h3>
                        <p>Drag, drop, resize, and style elements with complete freedom. No coding knowledge required to visualize ideas.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">2</div>
                        <h3>Responsive Design</h3>
                        <p>Switch between Desktop, Tablet, and Mobile views. Auto-generates @media queries for perfect responsiveness.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">3</div>
                        <h3>Code Export</h3>
                        <p>Instantly generate clean HTML and CSS code ready to be used in your projects. Just copy and paste.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">4</div>
                        <h3>Precision Control</h3>
                        <p>Lock elements, use alignment helpers, and fine-tune properties to pixel perfection.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">5</div>
                        <h3>Auto-Save</h3>
                        <p>Your work is automatically saved to your browser. Close the tab and come back later without losing progress.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">6</div>
                        <h3>Fast Workflow</h3>
                        <p>Use keyboard shortcuts, multi-select (coming soon), and quick color palettes to work at the speed of thought.</p>
                    </div>
                </div>
            </section>

            {/* about section */}
            <section id="about" className="lp-about">
                <div className="lp-section-header">
                    <h2 className="lp-section-title">About</h2>
                    <p style={{ color: 'var(--lp-text-muted)' }}>Learn more about DesignByDrop Developer</p>
                </div>
                <div className="lp-about-content">
                    <h1>ALi Abdellatif</h1>
                    <p>I'm a sudanese software engineer who loves building software but not a big fan of writing code syntax, so i decided to create a tool that helps me and others to create websites visually without writing code, and this is how DesignByDrop was born :)</p>
                    <h2>want to support me ? a star on github would be great :)</h2>
                    <Link to="https://github.com/249f" className="lp-btn-primary"><Github size={20} /></Link>
                    <Link to="https://instagram.com/otp_ali" className="lp-btn-primary"><Instagram size={20} /></Link>
                    <Link to="https://www.linkedin.com/in/ali-abdellatif-1482693a1" className="lp-btn-primary"><Linkedin size={20} /></Link>
                    <Link to="https://www.facebook.com/249ff" className="lp-btn-primary"><Facebook size={20} /></Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp-footer">
                <p>© 2026 DesignByDrop. Built for creators.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
