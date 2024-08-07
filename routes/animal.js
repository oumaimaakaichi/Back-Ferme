const express = require("express");
const animalRoutes = express.Router();
const Animal = require("../models/animal");
const controller = require('../controllers/animal');
const multer = require("multer");

// Configuration du stockage avec Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dossier de destination pour les fichiers téléchargés
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // Nom du fichier enregistré avec un horodatage pour éviter les doublons
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Configuration de Multer avec le stockage défini
const upload = multer({ storage: storage });

animalRoutes.post("/ajouter-animal", upload.fields([
  { name: "image", maxCount: 1 }
]), async (req, res) => {
  try {
    console.log(req.files); // Vérifiez la structure ici

    let imagePath = "";

    if (req.files && req.files["image"] && req.files["image"][0]) {
      imagePath = "http://192.168.148.216:3000/uploads/" + req.files["image"][0].filename;
    } else {
      console.log("Aucun fichier image trouvé");
    }

    const { animal, espece, race, age, poids, proprietaire, historiqueMedical, vaccinations, estPuce, numeroPuce } = req.body;

    const nouvelAnimal = new Animal({
      animal,
      espece,
      race,
      age,
      poids,
      proprietaire,
      historiqueMedical,
      vaccinations,
      estPuce,
      image: imagePath,
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


// Routes pour d'autres opérations
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
