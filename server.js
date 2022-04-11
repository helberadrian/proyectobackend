// Server
const express = require("express");
const productos = require("./routes/app");
const morgan = require("morgan");
const PORT = 3000;

// settings
const app = express();
app.set("json spaces", 2);
app.use(require("./routes/app"));

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname, + "./public"));
app.use("/api", productos);

// starting the server
const server = app.listen(PORT, () =>{
    console.log(`Servidor conectado en puerto ${server.address().port}`);
});