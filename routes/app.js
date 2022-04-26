const fs = require("fs");
const {Router} = require("express");
const router = Router();
let file = "./data/data.json";
let file_carrito = "./data/carrito.json";

const DAO = require("productDao");
const producto = new DAO;


// GET RAIZ
router.get("/", (req, res) => {
    res.json({
        "Aviso": "Servidor Listo"
    });
});

// ROUTES PRODUCTOS
// GET
router.get("/productos", (req, res) => {
    res.json(producto.getAll());
});

// GET ID
router.get("/productos/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    res.json(producto.getProduct(id));
});
    
// POST
router.post("/productos", (req, res) => {
    const productoNuevo = req.body;
    producto.createProduct(productoNuevo)
    res.render("index");
});

// PUT
router.put("/productos/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    const productoNuevo = req.body;

    producto.updateProduct(id, productoNuevo);
    res.render("index");
});

// DELETE
router.delete("/productos/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    producto.deleteProduct(id);
    res.render("index");
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