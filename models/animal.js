const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  animal: {
    type: String,
    required: true,
  },
  espece: {
    type: String,
   
  },
  race: {
    type: String,
  },
  age: {
    type: Number,
  },
  image:{
    type:String
  },
  poids: {
    type: Number,
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
  historiqueMedical: {
    type: String,
  },
  vaccinations: [{
    nom: String,
    date: Date,
  }],
  estPuce: {
    type: Boolean,
    default: true,
  },
  numeroPuce: {
    type: String,
    required: function() { return this.estPuce; },
  },
}, {
  timestamps: true, 
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
