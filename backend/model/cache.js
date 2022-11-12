import { createClient } from 'redis';

var client = undefined;

export async function startRedis() {
    client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
}


export async function cacheCart(cartID, cart) {
    await client.set(cartID, JSON.stringify(cart)) 
}

export async function invalidateCart(cartID) {
    await client.del(cartID)
}

export async function getCachedCart(cartID) {
    return JSON.parse(await client.get(cartID))
}

export async function closeRedis() {
    await client.disconnect();
}