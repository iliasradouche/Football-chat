document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    //take data from form
    try {
        const response = await axios.post('/api/users', {
          name,
          email,
          password,
      });
        
        //respond with a success message
        document.getElementById('message').textContent = 'Registration successful!';

        Toastify({
            text: "Registration successful! Redirecting...",
            duration: 3000,
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
          setTimeout(() => {
            window.location.href = '/login';    
          }, 3000);
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById('message').textContent = error.response.data.message || 'Registration failed';
    }
});