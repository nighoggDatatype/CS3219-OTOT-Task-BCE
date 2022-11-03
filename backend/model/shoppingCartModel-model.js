import mongoose from 'mongoose';
var Schema = mongoose.Schema
let LineEntrySchema = new Schema({
    centCost: { //Stored as SGD cents, not in SGD dollars nor in any other currency like Yen
        type: Number,
        required: true,
        unique: false
    },
    qty: {
        type: Number,
        required: true,
        unique: false
    }
})
let ShoppingCartModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
    },
    contents: {
        type: Map,
        of: LineEntrySchema,
        default: {}
    }
    //TODO: Add list here
})

export default mongoose.model('ShoppingCartModel', ShoppingCartModelSchema)
