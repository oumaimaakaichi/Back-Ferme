const express = require("express");
const animalRoutes = express.Router();
const Animal = require("../models/animal");
const controller = require('../controllers/animal');
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage });

animalRoutes.post("/ajouter-animal", upload.fields([
  { name: "image", maxCount: 1 }
]), async (req, res) => {
  try {
    console.log(req.files); 

    let imagePath = "";

    if (req.files && req.files["image"] && req.files["image"][0]) {
      imagePath = "http://192.168.177.216:3000/uploads/" + req.files["image"][0].filename;
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



animalRoutes.delete("/api/deleteAni/:id", controller.deleteConge);
animalRoutes.patch("/api/updateAn/:id", controller.updatee);
animalRoutes.get("/api/findIDAni/:id", controller.findID);
animalRoutes.post("/addVaccination/:animalId", controller.addVaccination);
animalRoutes.get("/getAllVaccinations/:animalId", controller.getAllVaccinations);
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

animalRoutes.get('/animals-by-year', async (req, res) => {
  try {
    const results = await Animal.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalAnimals: { $sum: 1 } 
        }
      },
      {
        $sort: { _id: 1 } 
      }
    ]);

   
    const formattedResults = results.map(item => ({
      year: item._id,
      totalAnimals: item.totalAnimals
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Erreur lors de la récupération des données des animaux par année :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }
});

animalRoutes.get('/total-animals', async (req, res) => {
  try {
    const totalAnimals = await Animal.countDocuments();
    res.status(200).json({ totalAnimals });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving total animals', error });
  }
});

module.exports = animalRoutes;
