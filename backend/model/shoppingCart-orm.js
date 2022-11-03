import { createShoppingCart, getShoppingCartById } from './repository.js';

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
        const cart =  await getShoppingCartById(id)
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
    return await getShoppingCartById(id);
}

