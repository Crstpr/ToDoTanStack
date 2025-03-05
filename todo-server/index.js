const express = require("express");
const app = express();
const cors = require("cors");
const todoRoutes = require('./route/route')

//middleware
app.use(cors());
app.use(express.json());

app.use("/todo", todoRoutes);

app.listen(5000, ()=> {
    console.log("server started on port 5000");
})