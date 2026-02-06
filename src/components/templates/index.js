import blueNightNavbar from './navbars/BlueNight';
import simpleLogin from './loginForms/SimpleLogin';
import modernHero from './heroes/ModernHero';

export const templates = {
    navbars: {
        name: 'Navbars',
        items: [
            { id: 'blue-night', name: 'Blue Night', elements: blueNightNavbar, preview: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)' }
        ]
    },
    heroes: {
        name: 'Heroes',
        items: [
            { id: 'modern-hero', name: 'Modern Hero', elements: modernHero, preview: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' }
        ]
    },
    loginForms: {
        name: 'Login Forms',
        items: [
            { id: 'simple-login', name: 'Simple Login', elements: simpleLogin, preview: '#ffffff' }
        ]
    }
};
