async function joinGame(gameId) {
    const token = localStorage.getItem('token');
    if (!token) {
        Toastify({
            text: `You must be logged in to join a game.`,
            duration: 3000,
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
        return;
    }

    try {
        const response = await axios.post(`/api/games/${gameId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        Toastify({
            text: `Joined game: ${response.data.name}`,
            duration: 3000,
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
          setTimeout(() => {
            window.location.href = `/chat?gameId=${gameId}`;  
          }, 3000);
         
    } catch (error) {
        console.error('Join game error:', error);
        Toastify({
            text: `You're already part of this game. You'll be redirected to the chat room shortly.`,
            duration: 3000,
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
          setTimeout(() => {
            window.location.href = `/chat?gameId=${gameId}`;  
          }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            // get user data
            const responseUser = await axios.get('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // update front with user data
            document.getElementById('welcomeMessage').innerText = `Welcome, ${responseUser.data.name}!`;

            // get games where the user is a participant
            const responseGames = await axios.get('/api/games/participant', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // update front with aallgames count
            document.getElementById('gamesCount').innerText = `${responseGames.data.length}`;


            // get games created by the user
            const responseUserGames = await axios.get('/api/games/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // update front with created games count
            document.getElementById('userGamesCount').innerText = `${responseUserGames.data.length}`;

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    document.getElementById('createGameForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        const maxParticipants = document.getElementById('maxParticipants').value;
        const date = document.getElementById('date').value;

        axios.post('/api/games', { name, city, maxParticipants, date }, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            const gameId = response.data._id;
            Toastify({
                text: `Joined game: ${response.data.name}`,
                duration: 3000,
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
              }).showToast();
              setTimeout(() => {
                window.location.href = `/chat?gameId=${gameId}`;  
              }, 3000);
        }).catch(error => {
            console.error('Error creating game:', error);
        });
    });
});