document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const continueBtn = document.getElementById('continue-btn');
    const backBtn = document.getElementById('back-btn');
    const signupBtn = document.getElementById('signup-btn');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Continue button click event
    continueBtn.addEventListener('click', function() {
        // Basic email validation
        const email = emailInput.value.trim();
        if (!email || !isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Transition to step 2
        step1.classList.add('fade-out');
        setTimeout(() => {
            step1.style.display = 'none';
            step2.style.display = 'block';
            setTimeout(() => {
                step2.classList.add('fade-in');
            }, 50);
        }, 300);
    });

    // Back button click event
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Transition back to step 1
        step2.classList.remove('fade-in');
        setTimeout(() => {
            step2.style.display = 'none';
            step1.style.display = 'block';
            setTimeout(() => {
                step1.classList.remove('fade-out');
            }, 50);
        }, 300);
    });

    // Sign up button click event
    signupBtn.addEventListener('click', function() {
        // Get values
        const name = nameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validate inputs
        if (!name) {
            alert('Please enter your name');
            return;
        }

        if (!password) {
            alert('Please enter a password');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Here you would typically send the data to your server
        // For now, we'll just show a success message
        alert('Account created successfully!');
        
        // Redirect to login page or dashboard
        // window.location.href = 'login.html';
    });

    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
