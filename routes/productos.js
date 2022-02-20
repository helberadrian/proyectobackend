const fs = require("fs");
const {Router} = require("express");
const router = Router();
let file = "./data/data.json";

// GET RAIZ
router.get("/", (req, res) => {
    res.json({
        "Aviso": "Servidor Listo"
    });
});

// GET
router.get("/productos", (req, res) => {
    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
        
        res.json(data);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

// GET ID
router.get("/productos/:id", (req, res) =>{
    const id = parseInt(req.params.id);

    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
        
        const producto = data.find(producto => producto.id == id);
        res.send(`Se encontro el producto ${JSON.stringify(producto)}`);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});
    
// POST
router.post("/productos", (req, res) => {
    const productoNuevo = req.body;
    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
            
        let num = data.length + 1;
        const id = {id: num}
        const producto = Object.assign(productoNuevo, id);

        data.push(producto);
        const final = JSON.stringify(data);
        fs.writeFileSync(file, final);

        res.send(`Se guardo el producto ${JSON.stringify(producto)}`);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

// PUT
router.put("/productos/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    const productoNuevo = req.body;

    fs.promises.readFile(file, "utf-8")
        .then(contenido =>{
            const resultado = [];
            const data = JSON.parse(contenido); // Descargo el contenido del JSON

            for (const indice of data) { // Elimino el producto existente creando un nuevo array sin el
                if (indice.id != id){
                    resultado.push(indice);
                }
            }

            const productoFinal = Object.assign(productoNuevo, {id: id}); // Asigno el id al producto nuevo
            resultado.push(productoFinal); // Agrego el producto al array que se va a escribir

            fs.writeFileSync(file, JSON.stringify(resultado)); // Se guardan los datos en el archivo

            res.send(`Se modifico el producto con el ID ${id} con: ${JSON.stringify(productoFinal)}`);
        })
        .catch( error => {
            console.log("Error en la lectura", error);
        })
});

// DELETE
router.delete("/productos/:id", (req, res) =>{
    const id = parseInt(req.params.id);

    fs.promises.readFile(file, "utf-8")
        .then(contenido => {
            const data = JSON.parse(contenido);
            const resultado = [];

            for (const indice of data) {
                if (indice.id != id){
                    resultado.push(indice);
                }
            }

            fs.writeFileSync(file, JSON.stringify(resultado));

            res.send(`Se elimino el producto de ${id} con exito`);
        })
        .catch( error => {
            console.log("Error en la lectura", error);
        });
});

module.exports = router;