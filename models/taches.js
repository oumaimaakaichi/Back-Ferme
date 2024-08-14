const mongoose = require("mongoose");

const TacheSchema = new mongoose.Schema({
  tache: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },



  
});

const Tache = mongoose.model("Tache", TacheSchema);

module.exports = Tache;
