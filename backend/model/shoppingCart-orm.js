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
        console.log('ERROR: Could not create new pending match'); //TODO: handle edge case better
        return { err };
    }
}
export async function ormGetShoppingCart(id) {
    return getShoppingCartById(id);
}

