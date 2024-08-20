const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom: {
    type: String,
  
  },
  prenom: {
    type: String,
  },
 
  
  email: {
    type: String,
  
    unique: true,
  },
 
  Num_tel: {
    type: Number,
    maxLength: 8,
  },

  cin: {
    type: Number,
    maxLength: 8,
  },
  adresse: {
    type: String,
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
   
  },




});

const Compte = mongoose.model("Compte", schema);

module.exports = Compte;
