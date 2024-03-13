require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;
require('./db/config');
const router = require("./Routes/userRouter")




app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).json("Server Start")
})
app.use(router)

app.listen(PORT, () => {
    console.log(`Server Start at ${PORT} `)
})

