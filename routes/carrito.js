const fs = require("fs");
const {Router} = require("express");
const router = Router();
let file = "./data/carrito.json";

// GET
router.get("/carrito", (req, res) => {
    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
        
        res.json(data);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});