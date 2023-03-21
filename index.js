const mongo = require("./database/connection");

const express = require('express');
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const indexRoutes = require("./routes/index.route")


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT;

const main = async () => {

    const connect = await mongo.connectToDB();
    app.use("/",indexRoutes)
    
    app.listen(PORT,() =>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    
}

main();