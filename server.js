require('dotenv').config();
// Server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 8080;

const asyncHandler = require('express-async-handler')
const Game = require('./models/gameModel')
const Message = require('./models/messageModel')
const User = require('./models/userModel')

// Connect to DB
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Middlewares
const { errorHandler } = require('./middleware/errorMiddleware');


// CORS set up access from any address
const cors = require('cors');
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

// IO initialization
const socketIo = require('socket.io');
const io = socketIo(server);

// DB connection
connectDB();

// use ejs to render our views
app.set('view engine', 'ejs');

app.use(cors(corsOptions));
app.use(express.json()) 
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
// app.use(express.static(__dirname + '/public'));
app.use(errorHandler)

app.use('/api/messages', require('./routes/messageRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/games', require('./routes/gameRoutes'))

//Render index page ejs 
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});
//Render registration page ejs 
app.get('/register', (req, res) => {
    res.render('register.ejs')
});

//Render login page ejs
app.get('/login', (req, res) => {
    res.render('login.ejs')
});

//Render dashboard ejs
app.get('/dashboard', asyncHandler(async (req, res) => {
    const games = await Game.find({});
    console.log(games);
    res.render('dashboard', { games });
}));

//Render chat page ejs
app.get('/chat', (req, res) => {
    res.render('chat.ejs')
});

// socket config
io.on('connection', (socket) => {
    socket.on('joinGameChat', ({ gameId }) => {
      socket.join(gameId);
      console.log(`User joined chat for game ${gameId}`);
    });

    socket.on('sendMessage', async ({ gameId, userId, text }) => {
        try {
          const validUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
      
          if (!validUserId) {
            console.error("Invalid userId:", userId);
            return; 
          }
          // get user's name using the userId
          const user = await User.findById(validUserId);
          if (!user) {
              console.error("User not found with id:", validUserId);
              return;
          }
          const userName = user.name;
      
          const message = await Message.create({ text, gameId, userId: validUserId });
      
          io.to(gameId).emit('message', { userId, userName, text, createdAt: message.createdAt });
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });
      
  });

server.listen(port, () => console.log(`Server started at port ${port}`));