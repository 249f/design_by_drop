const modernHero = [
    // Background
    {
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        backgroundColor: '#2d3748',
        borderRadius: 0,
        id: 'hero-bg',
        locked: true
    },
    // Eyebrow Text
    {
        type: 'paragraph',
        x: 100,
        y: 150,
        width: 600,
        height: 30,
        content: 'Launch Your Idea',
        color: '#63b3ed',
        fontSize: 16,
        id: 'hero-eyebrow'
    },
    // Main Headline
    {
        type: 'paragraph',
        x: 100,
        y: 190,
        width: 700,
        height: 120,
        content: 'Build faster with\nready-made blocks.',
        color: '#ffffff',
        fontSize: 64,
        id: 'hero-headline'
    },
    // Subheadline
    {
        type: 'paragraph',
        x: 100,
        y: 330,
        width: 600,
        height: 60,
        content: 'Drag, drop, and customize. Create stunning layouts in minutes without writing code.',
        color: '#a0aec0',
        fontSize: 20,
        id: 'hero-subhead'
    },
    // Primary CTA
    {
        type: 'button',
        x: 100,
        y: 420,
        width: 180,
        height: 56,
        content: 'Get Started',
        backgroundColor: '#4299e1',
        color: '#ffffff',
        variant: 'primary',
        borderRadius: 8,
        fontSize: 18,
        id: 'hero-cta-primary'
    },
    // Secondary CTA
    {
        type: 'button',
        x: 300,
        y: 420,
        width: 180,
        height: 56,
        content: 'Learn More',
        backgroundColor: 'transparent',
        color: '#a0aec0',
        variant: 'outline',
        borderRadius: 8,
        fontSize: 18,
        borderColor: '#4a5568',
        borderWidth: 2,
        id: 'hero-cta-secondary'
    }
];

export default modernHero;
