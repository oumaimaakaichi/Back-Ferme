const express = require("express");
const congeRoutes = express.Router();
const Conge = require("../models/congé"); 
const controller=require('../controllers/congé')
const Utilisateur=require('../models/utilisateur')
congeRoutes.post("/add-conge", async (req, res) => {
  try {
    const { dateDébut, dateFin,raison, employeur  } = req.body;
    console.log('Employeur ID:', employeur);
    const nouveauConge = new Conge({
        dateDébut,
      dateFin,
      raison,
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
    }).populate('employeur', 'nom prenom email Num_tel cin');;
    res.json(conges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


congeRoutes.get('/conges/:proprietaireId', async (req, res) => {
  try {
    const { proprietaireId } = req.params;

   
    const utilisateurs = await Utilisateur.find({ proprietaire: proprietaireId , role:"Employeur" });
    if (!utilisateurs.length) {
      return res.status(404).json({ message: 'Aucun employé trouvé pour ce propriétaire.' });
    }

    
    const employeursIds = utilisateurs.map(user => user._id);

   
    const conges = await Conge.find({ employeur: { $in: employeursIds } }).populate('employeur', 'nom prenom email Num_tel cin');

    if (!conges.length) {
      return res.status(404).json({ message: 'Aucun congé trouvé pour ces employés.' });
    }

    res.status(200).json(conges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});




congeRoutes.patch('/conge/accepter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conge = await Conge.findByIdAndUpdate(
      id,
      { status: 'Accepter' },
      { new: true }
    );

    if (!conge) {
      return res.status(404).json({ message: 'Congé non trouvé.' });
    }

    res.status(200).json({
      message: 'Congé accepté avec succès !',
      type: 'success',
      conge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


congeRoutes.patch('/conge/refuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conge = await Conge.findByIdAndUpdate(
      id,
      { status: 'Refuser' },
      { new: true }
    );

    if (!conge) {
      return res.status(404).json({ message: 'Congé non trouvé.' });
    }

    res.status(200).json({
      message: 'Congé refusé avec succès !',
      type: 'success',
      conge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
module.exports = congeRoutes;
