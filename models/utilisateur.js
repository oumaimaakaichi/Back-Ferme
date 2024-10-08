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
    enum: ["Ferme", "Employeur" , "vétérinaire" , "admin"],
  },
  etat:{
    type:String,
    enum:["Actif" , "Inactif"],
    default:"Actif"
  },
  email: {
    type: String,
    required: true,
  
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
   
  },


  taches: [{
    tache: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tache',
    },
    status: {
      type: String,
      enum: ['En attente', 'Terminé'],
      default: 'En attente'
    },
  }],

});

const Utilisateur = mongoose.model("Utilisateur", schema);

module.exports = Utilisateur;
