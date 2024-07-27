const express = require("express");
const animalRoutes = express.Router();
const Animal = require("../models/animal");
const controller=require('../controllers/animal')
animalRoutes.post("/ajouter-animal", async (req, res) => {
  try {
    const { nom, espece, race, age, poids, proprietaire, historiqueMedical, vaccinations, estPuce, numeroPuce } = req.body;

    const nouvelAnimal = new Animal({
      nom,
      espece,
      race,
      age,
      poids,
      proprietaire,
      historiqueMedical,
      vaccinations,
      estPuce,
      numeroPuce,
    });

    await nouvelAnimal.save();
    res.status(201).json({
      message: "Animal ajouté avec succès !",
      type: "success",
      animal: nouvelAnimal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'animal",
      type: "danger",
    });
  }
});
animalRoutes.delete("/api/deleteAni/:id", controller.deleteConge);
animalRoutes.patch("/api/updateAn/:id", controller.updatee);
animalRoutes.get("/api/findIDAni/:id", controller.findID);


animalRoutes.get("/AnimalParFerme/:id", async (req, res) => {
    try {
      const animals = await Animal.find({
        proprietaire: req.params.id,
      });
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = animalRoutes;
