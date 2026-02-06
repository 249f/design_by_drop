const simpleLogin = [
    // Container Card
    {
        type: 'rectangle',
        x: 400,
        y: 200,
        width: 400,
        height: 350,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        id: 'login-card',
        locked: false
    },
    // Title
    {
        type: 'paragraph',
        x: 440,
        y: 230,
        width: 320,
        height: 40,
        content: 'Welcome Back',
        color: '#1a202c',
        fontSize: 28,
        id: 'login-title'
    },
    // Email Input
    {
        type: 'input',
        x: 440,
        y: 290,
        width: 320,
        height: 45,
        content: 'Email Address',
        backgroundColor: '#f7fafc',
        color: '#2d3748',
        borderColor: '#cbd5e0',
        borderWidth: 1,
        fontSize: 16,
        id: 'login-email'
    },
    // Password Input
    {
        type: 'input',
        x: 440,
        y: 350,
        width: 320,
        height: 45,
        content: 'Password',
        backgroundColor: '#f7fafc',
        color: '#2d3748',
        borderColor: '#cbd5e0',
        borderWidth: 1,
        fontSize: 16,
        id: 'login-password'
    },
    // Submit Button
    {
        type: 'button',
        x: 440,
        y: 430,
        width: 320,
        height: 50,
        content: 'Sign In',
        backgroundColor: '#3182ce',
        color: '#ffffff',
        variant: 'primary',
        fontSize: 16,
        borderRadius: 6,
        id: 'login-btn'
    },
    // Footer Text
    {
        type: 'paragraph',
        x: 440,
        y: 500,
        width: 320,
        height: 20,
        content: 'Forgot password?',
        color: '#718096',
        fontSize: 14,
        id: 'login-footer'
    }
];

export default simpleLogin;
