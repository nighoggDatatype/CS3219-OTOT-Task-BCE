import { createShoppingCart, deleteShoppingCartById, getShoppingCartById } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateShoppingCart(username) {
    try {
        const newUser = await createShoppingCart({
            username: username, 
            //TODO: Add stuff here
        });
        newUser.save();
        return newUser;
    } catch (err) {
        console.log('ERROR: Could not create new pending match'); 
        return { err };
    }
}
export async function ormPutLineItem(id, item, cost, qty) {
    try {
        const cart = await getShoppingCartById(id, false)
        if (!cart) {
            return false;
        }
        if (qty > 0) {
            cart.contents.set(item, {centCost: cost, qty: qty})
        } else {
            cart.contents.delete(item)
        }
        cart.save()
        return true;
    } catch (err) {
        console.log('ERROR: Could not put line item');
        return { err };
    }
}
export async function ormGetShoppingCart(id) {
    try {
        const cart = await getShoppingCartById(id, true);

        if (!cart) {
            return cart
        }
        
        delete cart.__v
        for (const key in cart.contents) {
            delete cart.contents[key]._id
        }

        return cart
    } catch (err) {
        console.log('ERROR: Could not get shopping cart');
        return { err };
    }
}
export async function ormDeleteShoppingCart(id) {
    try {
        const cart = await deleteShoppingCartById(id);
        return true;
    } catch (err) {
        console.log('ERROR: Could not get shopping cart');
        return { err };
    }
}
