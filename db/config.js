const mongoose = require("mongoose");
const DB = process.env.DATABASE
mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => { console.log("Dtatabase connected") })
    .catch((error) => {
        console.log("error", error)
    })