const mongoose = require("mongoose");

const stock = new mongoose.Schema({
  nomProduit: {
    type: String,
    required: true,
  },
  quantite: {
    type: String,
  },
  date_peremption: { 
    type: Date,
   
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
});



const Stock = mongoose.model("stock", stock);

module.exports = Stock;
