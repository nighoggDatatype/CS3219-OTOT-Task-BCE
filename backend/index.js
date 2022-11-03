import { createShoppingCart } from "./controller/shoppingCart-controller.js"
import express from "express";

let app = express();// Setup server port
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

var port = process.env.PORT || 8080;// Send message for default URL

app.get('/', (req, res) => res.send('Hello World with Express'));// Launch app to listen to specified port

app.post('/api/v1/shoppingCart', createShoppingCart)


app.listen(port, function () {
     console.log("Running Backend Server on port " + port);
});