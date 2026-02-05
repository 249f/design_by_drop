const blueNightNavbar = [
    {
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 1200,
        height: 60,
        backgroundColor: '#1a1a2e',
        borderRadius: 0,
        id: 'nav-bg',
        locked: true
    },
    {
        type: 'paragraph',
        x: 40,
        y: 15,
        width: 150,
        height: 30,
        content: 'BrandName',
        color: '#ffffff',
        fontSize: 24,
        id: 'nav-logo'
    },
    {
        type: 'button',
        x: 800,
        y: 10,
        width: 100,
        height: 40,
        content: 'Home',
        backgroundColor: 'transparent',
        color: '#ffffff',
        variant: 'text',
        id: 'nav-home'
    },
    {
        type: 'button',
        x: 910,
        y: 10,
        width: 100,
        height: 40,
        content: 'About',
        backgroundColor: 'transparent',
        color: '#ffffff',
        variant: 'text',
        id: 'nav-about'
    },
    {
        type: 'button',
        x: 1020,
        y: 10,
        width: 120,
        height: 40,
        content: 'Contact',
        backgroundColor: '#4ecca3',
        color: '#1a1a2e',
        variant: 'primary',
        id: 'nav-contact'
    }
];

export default blueNightNavbar;
