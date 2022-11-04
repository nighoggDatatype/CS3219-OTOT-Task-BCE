import ShoppingCartModel from './shoppingCartModel-model.js';
import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createShoppingCart(params) { 
  return new ShoppingCartModel(params)
}

export async function getShoppingCartById(id, isPlain) {
  const query = ShoppingCartModel.findById(id)
  return  query.lean(isPlain).exec()
}
export async function deleteShoppingCartById(id) {
  return ShoppingCartModel.deleteOne({ _id: {$eq: id} })
}
