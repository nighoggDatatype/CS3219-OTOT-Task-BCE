import { createShoppingCart, putLineItemInShoppingCart, getShoppingCart, deleteShoppingCart } from "./controller/shoppingCart-controller.js"
import express from "express";

let app = express();// Setup server port
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

var port = process.env.PORT || 8080;// Send message for default URL

app.get('/', (req, res) => res.send('Hello World with Express'));// Launch app to listen to specified port

app.post('/api/v1/shoppingCart', createShoppingCart)
app.put('/api/v1/shoppingCart/:id', putLineItemInShoppingCart)
app.get('/api/v1/shoppingCart/:id', getShoppingCart)
app.delete('/api/v1/shoppingCart/:id', deleteShoppingCart)


app.listen(port, function () {
     console.log("Running Backend Server on port " + port);
});