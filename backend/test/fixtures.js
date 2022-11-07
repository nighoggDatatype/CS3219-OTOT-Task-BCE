import { closeServer } from '../index.js'; //Ensure server has started

export async function mochaGlobalTeardown() {
    await closeServer()
}