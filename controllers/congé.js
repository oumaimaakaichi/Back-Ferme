
var conge = require('../models/congé')


exports.deleteConge = (req, res)=>{
    const id = req.params.id;

    conge.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete congé with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "congé was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete congé with id=" + id
            });
        });
}
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    conge.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update conge with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update congé information"})
        })
}


exports.findID = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        conge.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found congé with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        conge.find()
            .then(cong => {
                res.send(cong)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

exports.findAll = (req, res)=>{

    if(req.query.id){
       

        conge.find()
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found congé with id "})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id "})
            })

    }else{
        conge.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

