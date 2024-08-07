const express = require("express");
const StockRoute = express.Router();
const Stock = require("../models/stock");

StockRoute.post("/add-stock", async (req, res) => {
  try {
    const { nomProduit, quantite, date_peremption, proprietaire } = req.body;

    const nouveauStock = new Stock({
      nomProduit,
      quantite,
      date_peremption,
      proprietaire,
    });
    await nouveauStock.save();
    res.status(201).json({
      message: "Stock ajouté avec succès !",
      type: "success",
      stock: nouveauStock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création du stock",
      type: "danger",
    });
  }
});

StockRoute.delete("/delete-stock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStock = await Stock.findByIdAndDelete(id);
    if (!deletedStock) {
      return res.status(404).json({ message: "Stock non trouvé" });
    }
    res.status(200).json({
      message: "Stock supprimé avec succès !",
      type: "success",
      stock: deletedStock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la suppression du stock",
      type: "danger",
    });
  }
});


StockRoute.patch("/update-stock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: "Stock non trouvé" });
    }
    res.status(200).json({
      message: "Stock mis à jour avec succès !",
      type: "success",
      stock: updatedStock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du stock",
      type: "danger",
    });
  }
});


StockRoute.get("/find-stock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock non trouvé" });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


StockRoute.get("/find-all", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


StockRoute.get("/stocks-by-owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const stocks = await Stock.find({ proprietaire: ownerId });
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = StockRoute;
