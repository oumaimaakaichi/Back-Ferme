const express = require("express");
const userController = require("../controllers/utilisateur");
const userRoutes = express.Router();
const utilisateur = require("../models/utilisateur"); 
const multer = require("multer");
const bcrypt = require("bcrypt");
const storage = require("../midleware/upload");
const Utilisateur = require("../models/utilisateur");

const upload = multer({ storage: storage });


userRoutes.post("/add-user", upload.single("avatar"), async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const {
        nom,
        prenom,
        email,
        password,
        Num_tel,
        cin,
        adresse,
        avatar,
        role
      } = req.body;
  
      const nouveauUtilisateur = new utilisateur({
        nom,
        prenom,
        email,
        password: hashedPassword,
        Num_tel,
        cin,
        adresse,
        avatar,
        role
      });
  
      if (req.file) {
        nouveauUtilisateur.avatar = "http://192.168.244.216:3000/uploads/" + req.file.filename;
      }
  
      await nouveauUtilisateur.save();
  
      res.status(201).json({
        message: "Utilisateur ajouté avec succès !",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        type: "danger",
      });
    }
  });
  
  userRoutes.post("/upload-image", upload.single("avatar"), (req, res) => {
    res.send("http://192.168.244.216:3000/uploads/" + req.file.filename);
  });


userRoutes.post("/upload-doc", upload.single("image"), (req, res) => {
 
  res.send("http://192.168.244.216:3000/uploads/" + req.file.filename);
});


userRoutes.get("/userById/:id", userController.getbyid);
userRoutes.post("/login", userController.login);
userRoutes.put("/modifier/:id", userController.modifier);
userRoutes.post("/emailyni", userController.emailyni);
userRoutes.get("/users-by-owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const users = await Utilisateur.find({ proprietaire: ownerId ,role:"Employeur"});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});




userRoutes.get("/Vete-by-owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const users = await Utilisateur.find({ proprietaire: ownerId ,role:"vétérinaire"});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
userRoutes.get("/AllFermes", async (req, res) => {
  try {
   
    const users = await Utilisateur.find({ role: "Ferme"});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


userRoutes.get('/employeur/:id/taches', async (req, res) => {
  try {
    const employeurId = req.params.id;

  
    const employeur = await Utilisateur.findById(employeurId)
      .populate({
        path: 'taches.tache',
        select: 'tache description' 
      })
      .exec();
    
    if (!employeur) {
      return res.status(404).json({ message: 'Employeur not found' });
    }

  
    const taches = employeur.taches.map(tacheEntry => ({
      tache: tacheEntry.tache, 
      description:tacheEntry.description,
      status: tacheEntry.status 
    }));

    res.json(taches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


userRoutes.get('/statistics', async (req, res) => {
  try {
   
    const statistics = await Utilisateur.aggregate([
   
      { $match: { role: 'Ferme' } },
      {
        $lookup: {
          from: 'utilisateurs', 
          localField: '_id',
          foreignField: 'proprietaire',
          as: 'employeurs',
        },
      },
      {
        $lookup: {
          from: 'animals', 
          localField: '_id',
          foreignField: 'proprietaire',
          as: 'animaux',
        },
      },
      {
        $project: {
          _id: 1,
          nom: 1,
          prenom: 1,
          numEmployeurs: { $size: '$employeurs' },
          numAnimaux: { $size: '$animaux' },
        },
      },
    ]);

    
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching statistics.' });
  }
});


userRoutes.get('/total-users', async (req, res) => {
  try {
    const totalEmployeurs = await Utilisateur.countDocuments({ role: 'Employeur' });
    const totalVeterinaires = await Utilisateur.countDocuments({ role: 'vétérinaire' });
    const totalFermes = await Utilisateur.countDocuments({ role: 'Ferme' });

    res.status(200).json({
      totalEmployeurs,
      totalVeterinaires,
      totalFermes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users count', error });
  }
});
module.exports = userRoutes;
