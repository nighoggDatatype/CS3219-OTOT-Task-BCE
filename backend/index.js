import { createShoppingCart, putLineItemInShoppingCart, getShoppingCart, deleteShoppingCart } from "./controller/shoppingCart-controller.js"
import express from "express";
import cors from 'cors'

let app = express();// Setup server port

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

var port = process.env.PORT || 8080;// Send message for default URL

app.get('/', (req, res) => res.send('Hello World with Express'));// Launch app to listen to specified port

app.post('/api/v1/shoppingCart', createShoppingCart)
app.put('/api/v1/shoppingCart/:id', putLineItemInShoppingCart)
app.get('/api/v1/shoppingCart/:id', getShoppingCart)
app.delete('/api/v1/shoppingCart/:id', deleteShoppingCart)


app.listen(port, function () {
     console.log("Running Backend Server on port " + port);
});

//Export app for testing
export default app;