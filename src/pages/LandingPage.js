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
                    <div className="lp-card lp-card-visual">
                        <div className="lp-card-icon">1</div>
                        <h3>Visual Editing</h3>
                        <p>Drag, drop, resize, and style elements with complete freedom. No coding knowledge required to visualize ideas. Experience the power of absolute positioning paired with intuitive transform controls.</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>Whether you're building a simple hero section or a complex multi-layered interface, our visual engine ensures what you see is exactly what you get in the final code.</p>
                    </div>

                    <div className="lp-card lp-card-responsive">
                        <div className="lp-card-icon">2</div>
                        <h3>Responsive Design</h3>
                        <p>Switch between Desktop, Tablet, and Mobile views effortlessly.</p>
                    </div>

                    <div className="lp-card lp-card-code">
                        <div className="lp-card-icon">3</div>
                        <h3>Code Export</h3>
                        <p>Instantly generate clean HTML and CSS code ready for production.</p>
                    </div>

                    <div className="lp-card lp-card-lock">
                        <div className="lp-card-icon">4</div>
                        <h3>Precision Control</h3>
                        <p>Lock elements, use alignment helpers, and fine-tune properties to pixel perfection. Gain full control over radii, borders, and spacing with our advanced property panel.</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>Every element can be locked to prevent accidental moves, allowing you to build complex layouts with total confidence and zero frustration.</p>
                    </div>

                    <div className="lp-card lp-card-save">
                        <div className="lp-card-icon">5</div>
                        <h3>Auto-Save</h3>
                        <p>Your work is automatically saved to your browser's local store.</p>
                    </div>

                    <div className="lp-card lp-card-speed">
                        <div className="lp-card-icon">6</div>
                        <h3>Fast Workflow</h3>
                        <p>Use keyboard shortcuts, quick color palettes, and rapid element creation to work at the speed of thought. Spend less time in menus and more time in the flow state of design.</p>
                    </div>
                </div>
            </section>

            {/* about section */}
            <section id="about" className="lp-about">
                <div className="lp-about-container">
                    <div className="lp-about-header">
                        <span className="lp-about-sup">The Story</span>
                        <h2 className="lp-about-title">Behind DesignByDrop</h2>
                    </div>

                    <div className="lp-about-grid">
                        <div className="lp-about-text-block">
                            <h3>Reson of the idea</h3>
                            <p>
                                Hi, I'm <strong>ALi Abdellatif</strong>, a Sudanese software engineer who believes that web development should be easier and more fun than it is today, not just boring syntax. For years there was a question in my mind, why we are still using code to build software, with all this technology and people still write code to build software? The "Vibe Coding" era showed us that AI can help write code, but the "Vibe Designing" era is where the real magic happens where you see what you build, instantly.
                            </p>
                            <p>
                                DesignByDrop started as a small personal project and right now it's just the beginning with the current beta version. A place where you can drag a shape, change a color, and walk away with a ready to copy HTML and CSS code.
                            </p>
                        </div>

                        <div className="lp-about-text-block">
                            <h3>Why it's free?</h3>
                            <p>
                                My goal is to keep this tool free and open-source forever. I want to empower creators in Sudan and across the globe to build their digital presence without being held back by complex setups or expensive subscriptions.
                            </p>
                            <div className="lp-about-quote">
                                "My Vision was: with all this technology and pepole still write code to build software !!! "
                            </div>
                            <div className="lp-about-support">
                                <p>If you find this tool helpful, a star on GitHub is the best way to support the journey. Feel free to drop your reviews and feedback on any social media platform.</p>
                                <div className="lp-about-socials">
                                    <Link to="https://github.com/249f" className="lp-social-link" title="GitHub"><Github size={20} /></Link>
                                    <Link to="https://instagram.com/otp_ali" className="lp-social-link" title="Instagram"><Instagram size={20} /></Link>
                                    <Link to="https://www.linkedin.com/in/ali-abdellatif-1482693a1" className="lp-social-link" title="LinkedIn"><Linkedin size={20} /></Link>
                                    <Link to="https://www.facebook.com/249ff" className="lp-social-link" title="Facebook"><Facebook size={20} /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
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
