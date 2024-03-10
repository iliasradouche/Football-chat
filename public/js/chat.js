/* ================ INITIALIZATION ================ */
// Initialize socket connection
const socket = io();

// Extract gameId from the URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('gameId');

// Global var to store the current user's id
let currentUserId;

/* ================ UTILITY FUNCTIONS ================ */
// gets current user's ID from the server
async function setCurrentUserId() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        currentUserId = response.data._id;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
    }
}

// gets current user's info
async function fetchUserInfo() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data._id;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw new Error('Failed to fetch user info');
    }
}

// handles sending a new message
async function sendMessage(text) {
    try {
        const userId = await fetchUserInfo();
        socket.emit('sendMessage', { gameId, userId, text });
    } catch (error) {
        console.error('Failed to retrieve user ID. Cannot send message.', error);
    }
}

// Loads old messages from db
async function loadInitialMessages() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token is missing');

        const response = await axios.get(`/api/messages/${gameId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        response.data.forEach(message => addMessageToDOM(message, true));
    } catch (error) {
        console.error('Failed to load messages:', error);
    }
}

// Adding new message to the DOM
function addMessageToDOM(message, isInitialLoad = false) {
    const messageArea = document.getElementById('messageArea');
    const messageDiv = document.createElement('div');
    const isCurrentUser = isInitialLoad ? message.userId._id === currentUserId : message.userId === currentUserId;
    const messageClass = isCurrentUser ? 'self-end p-3 mb-2 ml-80 bg-zinc-800 text-zinc-50 rounded-lg w-1/3' : 'p-3 mb-2 mr-80 bg-[#e1ff57] bg-opacity-5 text-zinc-50 rounded-lg w-1/3';

    messageDiv.classList.add(...messageClass.split(' '));
    const displayName = isInitialLoad ? message.userId.name : (message.userName || "Someone");
    messageDiv.innerHTML = `<strong><p class="text-[#e1ff57]">${displayName}:</p></strong>${message.text}`;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}

async function fetchUserGames() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token is missing');
        }
        
        const response = await axios.get('/api/games/inbox', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user games:', error);
    }
}

function scrollToBottom() {
    const messageArea = document.getElementById('messageArea');
    messageArea.scrollTop = messageArea.scrollHeight;
}

async function displayUserGames() {
    const games = await fetchUserGames();
    
    const gamesList = document.getElementById('gamesList'); // Assume you have a <div id="gamesList"></div> in your HTML
    
    games.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game-preview'); 
        
        const gameImg = document.createElement('img');
        gameImg.src = "./images/soccer.jpg"; 
        gameImg.alt = `Image for ${game.name}`;
        gameImg.classList.add('game-image'); 

        // create a container for newest text content
        const textContent = document.createElement('div');
        const gameName = document.createElement('p');
        gameName.textContent = game.name;
        gameName.classList.add('game-name'); 

        // Last message preview inbox
        const lastMessagePreview = document.createElement('p');
        if (game.lastMessage) {
            lastMessagePreview.textContent = `${game.lastMessage.senderName}: ${game.lastMessage.text}`;
        } else {
            lastMessagePreview.textContent = "No messages yet";
        }
        lastMessagePreview.classList.add('last-message-preview'); 

        // Append paragraphs to the text content div
        textContent.appendChild(gameName);
        textContent.appendChild(lastMessagePreview);

        // Append img and text content to the game element
        gameElement.appendChild(gameImg);
        gameElement.appendChild(textContent);

        // Add click event listener to the gameElement
        gameElement.addEventListener('click', () => {
            // Redirect to the chat page for the clicked game
            window.location.href = `http://localhost:8080/chat?gameId=${game._id}`;
        });

        // Append the game element to the games list
        gamesList.appendChild(gameElement);
    });
}
async function fetchCurrentGame(gameId) {
    const token = localStorage.getItem('token');
    return axios.get(`/api/games/details/${gameId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
        console.log('Game Name:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Failed to fetch game name:', error);
        return '';
    });
}

// creates and appends game info elements
async function createAndAppendGameInfo(gameId) {
    const game = await fetchCurrentGame(gameId);
    const gameName = game.name
    const gameInfoElement = document.createElement('div');
    gameInfoElement.classList.add('flex', 'items-center');

    const gameImage = document.createElement('img');
    gameImage.src = "./images/soccer.jpg"; 
    gameImage.alt = "Game Logo";
    gameImage.classList.add('w-12', 'h-12', 'mr-3', 'rounded-full');

    const gameNameElement = document.createElement('h3');
    gameNameElement.textContent = gameName; 
    gameNameElement.classList.add('text-zinc-50', 'font-bold');

    gameInfoElement.appendChild(gameImage);
    gameInfoElement.appendChild(gameNameElement);

    document.getElementById('chat-header').appendChild(gameInfoElement);
}

createAndAppendGameInfo(gameId);

async function fetchUserDetails(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Failed to fetch user details:', error);
        return null; 
    }
}

function createParticipantElement(name, profilePictureUrl) {
    const participantElement = document.createElement('div');
    participantElement.classList.add('flex', 'items-center', 'p-2', 'my-2', 'bg-zinc-800', 'rounded-lg');

    const img = document.createElement('img');
    img.src = profilePictureUrl || './images/avatara.jpg';
    img.alt = 'Participant Profile';
    img.classList.add('w-6', 'h-6', 'mr-3', 'rounded-full');

    const nameElement = document.createElement('p');
    nameElement.textContent = name;
    nameElement.classList.add('text-sm', 'font-small', 'text-zinc-50');

    participantElement.appendChild(img);
    participantElement.appendChild(nameElement);

    document.getElementById('participant-list').appendChild(participantElement);
}

async function listGameParticipants(gameId) {
    const gameData = await fetchCurrentGame(gameId);
    if (!gameData || !gameData.participants) {
        console.error('No participants found or failed to fetch game data');
        return;
    }

    // get details of all participants
    const participantDetailsPromises = gameData.participants.map(participantId => fetchUserDetails(participantId));
    const participantsDetails = await Promise.all(participantDetailsPromises);

    // participantsDetails contains details of all participants including their names and profile pictures
    participantsDetails.forEach(participant => {
        if (participant) {
            createParticipantElement(participant.name, participant.avatar);
        }
    });
}
listGameParticipants(gameId)


/* ================ EVENT LISTENERS ================ */
// listen for the messageform submission to send a message
document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    if (messageText) {
        sendMessage(messageText);
        messageInput.value = ''; 
    }
});

document.addEventListener('DOMContentLoaded', displayUserGames);

/* ================ SOCKET COMMUNICATION ================ */
// Join the game chat
socket.emit('joinGameChat', { gameId });

// listen for incoming messsages
socket.on('message', message => addMessageToDOM(message));

/* ================ INITIAL SETUP ================ */
// Set current user ID and load old messages
setCurrentUserId().then(() => {
    console.log("Current user ID set:", currentUserId);
    loadInitialMessages();
});
scrollToBottom();
