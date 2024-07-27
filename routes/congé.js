const express = require("express");
const congeRoutes = express.Router();
const Conge = require("../models/congé"); 
const controller=require('../controllers/congé')

congeRoutes.post("/add-conge", async (req, res) => {
  try {
    const { dateDébut, dateFin, employeur } = req.body;

    const nouveauConge = new Conge({
        dateDébut,
      dateFin,
      
      employeur,
    });
    await nouveauConge.save();
    res.status(201).json({
      message: "Congé ajouté avec succès !",
      type: "success",
      conge: nouveauConge,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création du congé",
      type: "danger",
    });
  }
});
congeRoutes.delete("/api/deleteConge/:id", controller.deleteConge);
congeRoutes.patch("/api/update/:id", controller.update);
congeRoutes.get("/api/findID/:id", controller.findID);
congeRoutes.get("/api/find", controller.findAll);
congeRoutes.get("/conge/:id", async (req, res) => {
  try {
    const conges = await Conge.find({
      employeur: req.params.id,
    });
    res.json(conges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = congeRoutes;
