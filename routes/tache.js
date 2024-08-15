const express = require("express");
const TacheRoute = express.Router();
const Tache = require("../models/taches");
const Utilisateur =require('../models/utilisateur')
TacheRoute.post("/add-tache", async (req, res) => {
  try {
    const { tache, proprietaire ,description } = req.body;

    const nouveauTache = new Tache({
      tache,
      description,
      proprietaire
    });
    await nouveauTache.save();
    res.status(201).json({
      message: "tache ajouté avec succès !",
      type: "success",
      Tache: nouveauTache,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création du tache",
      type: "danger",
    });
  }
});

TacheRoute.delete("/delete-tache/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTache = await Tache.findByIdAndDelete(id);
    if (!deleteTache) {
      return res.status(404).json({ message: "Tache non trouvé" });
    }
    res.status(200).json({
      message: "Tache supprimé avec succès !",
      type: "success",
      stock: deleteTache,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la suppression du Tache",
      type: "danger",
    });
  }
});


TacheRoute.patch("/update-Tache/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTache= await Tache.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTache) {
      return res.status(404).json({ message: "Tache non trouvé" });
    }
    res.status(200).json({
      message: "Tache mis à jour avec succès !",
      type: "success",
      stock: updatedTache,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du Tache",
      type: "danger",
    });
  }
});


TacheRoute.get("/find-Tache/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tache = await Tache.findById(id);
    if (!tache) {
      return res.status(404).json({ message: "Tache non trouvé" });
    }
    res.status(200).json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


TacheRoute.get("/find-all", async (req, res) => {
  try {
    const taches = await Tache.find();
    res.status(200).json(taches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


TacheRoute.get("/taches-by-proprietaire/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const taches = await Tache.find({ proprietaire: ownerId });
    res.status(200).json(taches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



TacheRoute.post('/assign-task', async (req, res) => {
    const { userId, taskId } = req.body;
  
    if (!userId || !taskId) {
      return res.status(400).json({ error: 'User ID and Task ID are required' });
    }
  
    try {
     
      const user = await Utilisateur.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const task = await Tache.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
     
      user.taches.push({ tache: taskId, status: 'En attente' });
  
      
      await user.save();
  
      res.status(200).json({ message: 'Task assigned successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred', details: error.message });
    }
  });




  TacheRoute.put('/utilisateur/:userId/taches/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
  
    try {
    
      const utilisateur = await Utilisateur.findOne({
        _id: userId,
        'taches.tache': taskId
      });
  
      if (!utilisateur) {
        return res.status(404).json({ message: 'Utilisateur or task not found' });
      }
  
     
      const taskIndex = utilisateur.taches.findIndex(t => t.tache.toString() === taskId);
  
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found in utilisateur' });
      }
  
    
      utilisateur.taches[taskIndex].status = 'Terminé';
  
   
      await utilisateur.save();
  
      res.json({ message: 'Task status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = TacheRoute;
