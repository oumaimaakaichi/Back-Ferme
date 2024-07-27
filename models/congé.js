const mongoose = require("mongoose");

const congeSchema = new mongoose.Schema({
  dateDébut: {
    type: String,
    required: true,
  },
  dateFin: {
    type: String,
  },
  status: { 
    type: String,
    enum: ['en attente', 'accepter', 'refuser'],
    default: 'en attente',
  },
  employeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
});

const Conge = mongoose.model("Conge", congeSchema);

module.exports = Conge;
