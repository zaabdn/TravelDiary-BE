require("dotenv").config();

//init express
const express = require("express");
const cors = require("cors");

//init body-parser
const bodyParser = require("body-parser");

//gunakan express
const app = express();

app.use(cors());

//port
const port = 5001;

app.use(bodyParser.json())

//import router
const routerv1 = require("./routes/routev1");

app.use(express.json());

app.use("/api/v1", routerv1);

app.listen(port, () => console.log(`Listening on port ${port}`));