const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Ferme", "Employeur" , "vétérinaire"],
  },
  etat:{
    type:String,
    enum:["Actif" , "Inactif"],
    default:"Actif"
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },

  password: {
    type: String,
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
    required: true,
  },

});

const Utilisateur = mongoose.model("Utilisateur", schema);

module.exports = Utilisateur;
