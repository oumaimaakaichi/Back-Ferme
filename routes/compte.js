const express = require("express");
const CompteRoute = express.Router();
const Utilisateur =require('../models/utilisateur')
const Compte = require("../models/Compte");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require('dotenv').config();

CompteRoute.post("/add-Compte", async (req, res) => {
  try {
    const { nom , prenom , Num_tel , email , cin , adresse, proprietaire  } = req.body;

    const nouveauCompte = new Compte({
      nom,
      prenom,
      email,
      Num_tel , 
      cin,
      adresse,
     
      proprietaire
    });
    await nouveauCompte.save();
    res.status(201).json({
      message: "Compte ajouté avec succès !",
      type: "success",
      Tache: nouveauCompte,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création du Compte",
      type: "danger",
    });
  }
});




CompteRoute.get("/Compte-by-proprietaire/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const comptes = await Compte.find({ proprietaire: ownerId });
    res.status(200).json(comptes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
  },
});


  CompteRoute.post("/deplacer-compte/:compteId", async (req, res) => {
    const { compteId } = req.params;
  
    try {
     
      const compte = await Compte.findById(compteId);
      if (!compte) return res.status(404).json({ message: "Compte non trouvé" });
  
     
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      const utilisateur = new Utilisateur({
        nom: compte.nom,
        prenom: compte.prenom,
        role: "Employeur",
        email: compte.email,
        password: hashedPassword,
        Num_tel: compte.Num_tel,
        cin: compte.cin,
        adresse: compte.adresse,
        proprietaire: compte.proprietaire,
      });
  
     
      await utilisateur.save();
  
    
      const mailOptions = {
        from: 'oumaimaakaichi00@gmail.com',
        to: compte.email,
        subject: 'Votre mot de passe',
        text: `Votre mot de passe est : ${password}`,
      };
  
      await transporter.sendMail(mailOptions);
  
     
      await Compte.findByIdAndDelete(compteId);
  
      res.status(200).json({ message: "Compte déplacé vers utilisateur et supprimé" });
    } catch (error) {
      console.error("Erreur lors du déplacement du compte :", error);
      res.status(500).json({ message: error.message });
    }
  });
module.exports = CompteRoute;
