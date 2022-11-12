import { 
     createShoppingCart, 
     putLineItemInShoppingCart, 
     getShoppingCart, 
     deleteShoppingCart, 
     createTestCart } from "./controller/shoppingCart-controller.js"
import express from "express";
import cors from 'cors'

//Import for graceful disconnect
import mongoose from 'mongoose';

//Import for Task E
import 'dotenv/config'
import { closeRedis } from './model/cache.js'

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

//Task E only path
if (process.env.TASK_E) {
     app.post('/api/taskE/shoppingCart', createTestCart)
}

const server = app.listen(port, function () {
     console.log("Running Backend Server on port " + port);
});

//Export server closer for testing
export async function closeServer () {
     console.log('Shutting down gracefully');
     const mongooseClosePromise = mongoose.disconnect()
     server.close(async () => {
          console.log('Closed out express server connections');
          try {
               await mongooseClosePromise;
               console.log('Mongoose connection also closed')
          } catch {
               console.log("Could not close mongoose connection gracefully, forcefully shutting down");
          }
          if (process.env.TASK_E) {
               try {
                    await closeRedis()
                    console.log("Closed Redis connection")
               } catch {
                    console.log("Could not close Redis connection gracefully, forcefully shutting down");
               }
          }
          process.exit(0);
          
     });

     setTimeout(() => {
          console.error('Could not close connections in time, forcefully shutting down');
          process.exit(1);
     }, 10000);
}