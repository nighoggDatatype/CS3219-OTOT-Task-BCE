import mongoose from 'mongoose';
var Schema = mongoose.Schema
let LineEntrySchema = new Schema({
    cost: { //Stored as SGD cents, not in SGD dollars nor in any other currency like Yen
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
})

export default mongoose.model('ShoppingCartModel', ShoppingCartModelSchema)
