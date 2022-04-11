const fs = require("fs");
const {Router} = require("express");
const router = Router();
let file = "./data/data.json";
let file_carrito = "./data/carrito.json";

// GET RAIZ
router.get("/", (req, res) => {
    res.json({
        "Aviso": "Servidor Listo"
    });
});

// ROUTES PRODUCTOS
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

//ROUTES CARRITO
// GET ID
router.get("/carrito/:id/productos", (req, res) =>{
    const id = parseInt(req.params.id);

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);

        for (const element of carritos) {
            if (element.id == id){
                res.send(`Los productos del carrito son: ${JSON.stringify(element.carrito)}`);
            }
        } 
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

// POST
router.post("/carrito", (req, res) => {
    const nuevo_carrito = [];
    const imprimir = [];

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const productos = JSON.parse(contenido);

        let n = productos.length;
        console.log(n);
        n += 1;
        imprimir.push({id: n, carrito: nuevo_carrito})
        console.log(imprimir);

        fs.writeFileSync(file_carrito, JSON.stringify(imprimir));
        res.send(`Se creo un nuevo carrito con la id: ${n}`);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

// POST ID
router.post("/carrito/:id/productos", (req, res) => {
    const id = parseInt(req.params.id);
    const producto = [];

    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
        producto = data.find(producto => producto.id == id);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });


    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);

        producto.forEach(element => {
            const producto_nuevo = {id: element.id, nombre: element.nombre, codigo: element.codigo, precio: element.precio, stock: element.stock};
            let n = carritos.length;
            const filtrados = carritos.filter(carrito => carrito.id != n);

            for (const index of carritos) {
                if (index.id == n){
                    index.carrito.push(producto_nuevo);
                    filtrados.push({id: n, carrito: index.carrito});
                    fs.writeFileSync(file_carrito, JSON.stringify(filtrados));
                }
            }
            res.send(`Se agrego el producto ${producto_nuevo} al carrito de ID: ${n}`);
        });
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

// DELETE CARRITO
router.delete("/carrito/:id", (req, res) => {
    const id = parseInt(req.params.id);

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);
        const filtrados = carritos.filter(carrito => carrito.id != id);

        fs.writeFileSync(file_carrito, JSON.stringify(filtrados));
        res.send(`Se ha eliminado el carrito con ID: ${id}`);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

// DELETE PRODUCTO DEL CARRITO
router.delete("/carrito/:id/productos/:id_prod", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);
        const filtrados = carritos.filter(carrito => carrito.id != id);

        for (const index of carritos) {
            if (index.id == id){
                const productos = index.carrito;
                const extraidos = productos.filter(producto => producto.id != id_prod);

                filtrados.push({id: id, carrito: extraidos});
                fs.writeFileSync(file_carrito, JSON.stringify(filtrados));
                res.send(`Eliminado el producto con ID: ${id_prod} del carrito ID: ${id}`);
            }
        }
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

module.exports = router;