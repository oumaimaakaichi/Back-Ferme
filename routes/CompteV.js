const express = require("express");
const CompteVRoute = express.Router();
const Utilisateur =require('../models/utilisateur')
const CompteV = require("../models/CompteVéterinaire");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require('dotenv').config();

CompteVRoute.post("/add-CompteV", async (req, res) => {
  try {
    const { nom , prenom , Num_tel , email , cin , adresse, proprietaire  } = req.body;

    const nouveauCompte = new CompteV({
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




CompteVRoute.get("/Compte-by-proprietaireV/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const comptes = await CompteV.find({ proprietaire: ownerId });
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


CompteVRoute.post("/deplacer-compteV/:compteId", async (req, res) => {
    const { compteId } = req.params;
  
    try {
     
      const compte = await CompteV.findById(compteId);
      if (!compte) return res.status(404).json({ message: "Compte non trouvé" });
  
     
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      const utilisateur = new Utilisateur({
        nom: compte.nom,
        prenom: compte.prenom,
        role: "vétérinaire",
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
        subject: 'Détails de Votre Compte - Mot de Passe Inclus',
        text: `Cher Dr. ${compte.nom} ${compte.prenom},
      
      Nous sommes heureux de vous accueillir parmi notre communauté. Vous trouverez ci-dessous les informations nécessaires pour accéder à votre compte.
      
      Identifiants de connexion:
      - Nom d'utilisateur: ${compte.email}
      - Mot de passe: ${password}
      
      Nous vous recommandons de changer votre mot de passe dès votre première connexion pour garantir la sécurité de votre compte.
      
      Si vous avez des questions ou avez besoin d'assistance supplémentaire, n'hésitez pas à nous contacter à tout moment. Nous sommes là pour vous aider.
      
      Cordialement,
     
      
      ---
      Cet email a été envoyé automatiquement, merci de ne pas y répondre.
      `,
      };
      
  
      await transporter.sendMail(mailOptions);
  
     
      await CompteV.findByIdAndDelete(compteId);
  
      res.status(200).json({ message: "Compte déplacé vers utilisateur et supprimé" });
    } catch (error) {
      console.error("Erreur lors du déplacement du compte :", error);
      res.status(500).json({ message: error.message });
    }
  });
module.exports = CompteVRoute;
