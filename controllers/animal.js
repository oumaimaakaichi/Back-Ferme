var Animal = require("../models/animal");

exports.deleteConge = (req, res) => {
  const id = req.params.id;

  Animal.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `Cannot Delete ANIMAL with id ${id}. Maybe id is wrong`,
          });
      } else {
        res.send({
          message: "ANimal was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete congé with id=" + id,
      });
    });
};
exports.updatee = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  const id = req.params.id;
  Animal.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `Cannot Update animal with ${id}. Maybe user not found!`,
          });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update congé information" });
    });
};

exports.findID = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Animal.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found congé with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Erro retrieving user with id " + id });
      });
  } else {
    Animal.find()
      .then((cong) => {
        res.send(cong);
      })
      .catch((err) => {
        res
          .status(500)
          .send({
            message:
              err.message || "Error Occurred while retriving user information",
          });
      });
  }
};
