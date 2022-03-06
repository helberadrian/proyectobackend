const fs = require("fs");
const {Router} = require("express");
const router = Router();
let file = "./data/carrito.json";
let file_products = "./data/data.json";

// GET ID
router.get("/carrito/:id/productos", (req, res) =>{
    const id = parseInt(req.params.id);

    fs.promises.readFile(file, "utf-8")
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

    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const productos = JSON.parse(contenido);

        let n = productos.length;
        console.log(n);
        n += 1;
        imprimir.push({id: n, carrito: nuevo_carrito})
        console.log(imprimir);

        fs.writeFileSync(file, JSON.stringify(imprimir));
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

    fs.promises.readFile(file_products, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
        producto = data.find(producto => producto.id == id);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });


    fs.promises.readFile(file, "utf-8")
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
                    fs.writeFileSync(file, JSON.stringify(filtrados));
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

    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);
        const filtrados = carritos.filter(carrito => carrito.id != id);

        fs.writeFileSync(file, JSON.stringify(filtrados));
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

    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);
        const filtrados = carritos.filter(carrito => carrito.id != id);

        for (const index of carritos) {
            if (index.id == id){
                const productos = index.carrito;
                const extraidos = productos.filter(producto => producto.id != id_prod);

                filtrados.push({id: id, carrito: extraidos});
                fs.writeFileSync(file, JSON.stringify(filtrados));
                res.send(`Eliminado el producto con ID: ${id_prod} del carrito ID: ${id}`);
            }
        }
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

