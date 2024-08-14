const mongoose = require("mongoose");

const congeSchema = new mongoose.Schema({
  dateDébut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
  },
  raison:{
type:String
  },
  status: { 
    type: String,
    enum: ['En attente', 'Accepter', 'Refuser'],
    default: 'En attente',
  },
  employeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
});

const Conge = mongoose.model("Conge", congeSchema);

module.exports = Conge;
