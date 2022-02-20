// Server
const express = require("express");
const productos = require("./routes/productos");
const carrito = require("./routes/carrito");
const morgan = require("morgan");
const PORT = 3000;

// settings
const app = express();
app.set("json spaces", 2);
app.use(require("./routes/productos"));
app.use(require("./routes/carrito"));

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname, + "./public"));
app.use("/api", productos);
app.use("/api", carrito);

// starting the server
const server = app.listen(PORT, () =>{
    console.log(`Servidor conectado en puerto ${server.address().port}`);
});