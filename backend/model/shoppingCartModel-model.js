import mongoose from 'mongoose';
var Schema = mongoose.Schema
let ShoppingCartModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
    },
    //TODO: Add list here
})

export default mongoose.model('ShoppingCartModel', ShoppingCartModelSchema)
