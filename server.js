const express = require('express');
const mongoConnection = require('./database');
const userRoutes = require('./routes/utilisateur');
const congeRoutes = require('./routes/congé');
const animalRoutes = require('./routes/animal');
const stockRoute = require('./routes/stock');
const tacheRoute = require('./routes/tache');
const CompteRoutee = require('./routes/compte');
const CompteVRoute = require('./routes/CompteV');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});


app.use(express.json());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));


const corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true 
};
app.use(cors(corsOptions));


mongoConnection();


app.use('/', userRoutes);
app.use('/', congeRoutes);
app.use('/', animalRoutes);
app.use('/', stockRoute);
app.use('/', tacheRoute);
app.use('/', CompteRoutee(io));
app.use('/', CompteVRoute);


app.get('/uploads/:image', (req, res) => {
    res.sendFile(__dirname + '/uploads/' + req.params.image);
});


io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});


httpServer.listen(3000, '192.168.244.216', () => {
    console.log('Application connectée sur le port 3000...');
});
