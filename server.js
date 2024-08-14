const express=require('express');
const mongoConnection=require('./database');
const userRoutes=require('./routes/utilisateur')
const bodyParser = require("body-parser");
const congeRoutes=require("./routes/congé")
const animalRoutes = require("./routes/animal");
const stockRoute =require('./routes/stock')
const tacheRoute =require('./routes/tache')
const app =express();
app.use(express.json())

mongoConnection();
app.use('/' , userRoutes)
app.use('/' , congeRoutes)
app.use('/' , animalRoutes)
app.use('/' , stockRoute)
app.use('/' , tacheRoute)
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.get("/uploads/:image", function (req, res) {
    res.sendFile(__dirname + "/uploads/" + req.params.image);
  });
app.listen(3000 , '192.168.195.216',()=>{
    console.log('Application connecteé sur le port 3000...');
});










