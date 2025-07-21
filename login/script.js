document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSubmitBtn = document.getElementById('loginBtn');
    const registerSubmitBtn = document.getElementById('registerBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const modal = document.getElementById('forgotPasswordModal');
    const closeBtn = document.querySelector('.close');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    const registerSuccess = document.getElementById('registerSuccess');
    
    // Toggle between login and register forms
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });
    
    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });
    
    // Prevent viewport scaling on mobile when keyboard appears
    function preventViewportScale() {
        if (window.innerWidth <= 425) {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
            
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Handle input focus to prevent keyboard issues on mobile
    function handleInputFocus(e) {
        if (window.innerWidth <= 425) {
            setTimeout(() => {
                const input = e.target;
                const rect = input.getBoundingClientRect();
                const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                
                if (rect.bottom > viewportHeight * 0.6) {
                    input.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }
            }, 300);
        }
    }
    
    // Handle visual viewport changes (keyboard show/hide)
    function handleViewportChange() {
        if (window.visualViewport && window.innerWidth <= 425) {
            const viewport = window.visualViewport;
            const container = document.querySelector('.container');
            
            if (viewport.height < window.innerHeight * 0.75) {
                container.style.height = viewport.height + 'px';
            } else {
                container.style.height = '100vh';
                container.style.height = '100dvh';
            }
        }
    }
    
    // Initialize mobile optimizations
    preventViewportScale();
    
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
    }
    
    // Add input focus listeners
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && window.innerWidth <= 425) {
            input.style.fontSize = '16px';
        }
    });
    
    // Toggle password visibility
    const togglePassword = function(e) {
        if (e.target.classList.contains('bxs-lock-alt') || e.target.classList.contains('bxs-lock-open-alt')) {
            const icon = e.target;
            const input = icon.previousElementSibling || icon.parentElement.querySelector('input[type="password"], input[type="text"]');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bxs-lock-alt');
                icon.classList.add('bxs-lock-open-alt');
                icon.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('bxs-lock-open-alt');
                icon.classList.add('bxs-lock-alt');
                icon.setAttribute('aria-label', 'Show password');
            }
        }
    };
    
    // Add loading state to forms
    const handleFormSubmit = function(form, submitBtn) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = '';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = form.id === 'loginForm' ? 'Login' : 'Register';
                
                // Show success message for register form
                if (form.id === 'registerForm') {
                    registerSuccess.textContent = 'Registration successful!';
                    registerSuccess.style.display = 'block';
                    setTimeout(() => {
                        registerSuccess.style.display = 'none';
                    }, 5000);
                }
            }, 1500);
        });
    };
    
    // Modal functionality
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Make password icons clickable for toggling visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', togglePassword);
        icon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePassword(e);
            }
        });
    });
    
    // Add loading states
    handleFormSubmit(loginForm, loginSubmitBtn);
    handleFormSubmit(registerForm, registerSubmitBtn);
});

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrengthBar');
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    
    const width = (strength / 5) * 100;
    strengthBar.style.width = width + '%';
    
    if (width < 40) {
        strengthBar.style.backgroundColor = '#dc3545';
    } else if (width < 70) {
        strengthBar.style.backgroundColor = '#fd7e14';
    } else {
        strengthBar.style.backgroundColor = '#28a745';
    }
}