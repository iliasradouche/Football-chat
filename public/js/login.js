document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('/api/users/login', {
            email,
            password
        });
        
        //destructured token from response.data
        const { token } = response.data; 
        //saved token to localStorage
        localStorage.setItem('token', token); 

        Toastify({
            text: "Login successful! Redirecting...",
            duration: 3000,
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();

          
          setTimeout(() => {
            window.location.href = '/dashboard';    
          }, 3000);
        
        
    } catch (error) {
        console.error('Login error:', error);
        Toastify({
            text: "Login error",
            className: "warning",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              }
          }).showToast();
        document.getElementById('message').textContent = error.response && error.response.data ? error.response.data.message : error.message;
    }

});