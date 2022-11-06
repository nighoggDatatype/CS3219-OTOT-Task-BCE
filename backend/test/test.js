import { expect } from 'chai'
import axios from 'axios'
import '../index.js'; //Ensure server has started

const test_axios = axios.create({
    validateStatus: null //Leave validation to test case
  });

//TODO: Run test
describe('Backend API', function () {
    //TODO: Check if we need to start and end backend api explictly, and how to
        // Potentially see beforeAll()
    describe('#Post', function () {
        var id = null;
        it('should give me an id with a normal username', async function () {
            const res = await test_axios.post("http://localhost:8080/api/v1/shoppingCart",
                                         {"username" : 'Normal Username'})
            expect(res).to.have.property('status',201)
            expect(res).to.have.nested.property('data.message', 'Created new cart with owner Normal Username successfully!')
            expect(res).to.have.nested.property('data.id');
            id = res.data.id
        });
        it('should reject me with an empty username', async function () {
            const res = await test_axios.post("http://localhost:8080/api/v1/shoppingCart",
                                         {"username" : ''})
            expect(res).to.have.property('status',400)
            expect(res).to.have.nested.property('data.message', 'Username must contain non-whitespace characters!')
            expect(res).to.not.have.nested.property('data.id');
            id = null
        });
        it('should reject me with whitespace-only username', async function () {
            const res = await test_axios.post("http://localhost:8080/api/v1/shoppingCart",
                                         {"username" : '   '})
            expect(res).to.have.property('status',400)
            expect(res).to.have.nested.property('data.message', 'Username must contain non-whitespace characters!')
            expect(res).to.not.have.nested.property('data.id');
            id = null
        });
        it('should reject me with non-string username', async function () {
            const res = await test_axios.post("http://localhost:8080/api/v1/shoppingCart",
                                         {"username" : 0})
            expect(res).to.have.property('status',400)
            expect(res).to.have.nested.property('data.message', 'Username must be a string!')
            expect(res).to.not.have.nested.property('data.id');
            id = null
        });
        it('should reject me with no username', async function () {
            const res = await test_axios.post("http://localhost:8080/api/v1/shoppingCart")
            expect(res).to.have.property('status',400)
            expect(res).to.have.nested.property('data.message', 'Username is missing!')
            expect(res).to.not.have.nested.property('data.id');
            id = null
        });

        afterEach(async function () {
            if (id) {
                const res = await axios.delete(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                if (!(res && res.status == 200)) { //TODO: Replace error code here
                    throw new Error("Unable to delete cart in cleanup")
                }
            }
        });
    });
    describe('#Get', function () {
        context('when not provided a valid id', function () {
            it('should not work with no id', async function () {
                const res = await test_axios.get("http://localhost:8080/api/v1/shoppingCart")
                expect(res).to.have.property('status',404)
            });
            it('should not work with empty id', async function () {
                const res = await test_axios.get("http://localhost:8080/api/v1/shoppingCart/")
                expect(res).to.have.property('status',404)
            });
            it('should not work with invalid id format')//TODO: Handle invalid id format
            it('should not work with valid but non-existant id')//TODO: Handle valid but non-existant id
        });
        context('when provided a valid id', function () {
            var id = null;
            before(async function () {
                const res = await axios.post("http://localhost:8080/api/v1/shoppingCart",
                                             {"username" : 'Normal Username'})
                if (res && res.status == 201) {
                    id = res.data.id
                } else {
                    throw new Error("Post failed in test setup!")
                }
            });

            after(async function () {
                const res = await axios.delete(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                if (!(res && res.status == 200)) { //TODO: Replace error code here
                    throw new Error("Unable to delete cart in cleanup")
                }
            });
            context('and no line items are added', function () {
                it('should show the cart just fine') //TODO: Implement
            });
            context('and one line item is added exactly', function () {
                before(async function () {
                    const putForm = {
                        item: "item", 
                        cost: 99, 
                        qty: 5
                    }
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to add line item")
                    }                        
                });
                it('should show the cart just fine'); //TODO: Implement
                after(async function () {
                    const putForm = {
                        item: "item", 
                        cost: 99, 
                        qty: 0
                    }
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to remove line item")
                    }                        
                });
            });
            context('and more than one line item is added', function () {
                before(async function () {
                    //Add first line item
                    let putForm = {
                        item: "item_alpha", 
                        cost: 99, 
                        qty: 5
                    }
                    let res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to add line item")
                    }
                    //Add second line item
                    putForm = {
                        item: "item_beta", 
                        cost: 42069, 
                        qty: 1
                    }
                    res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to add line item")
                    }                        
                })
                it('should show the cart just fine') //TODO: Implement
                after(async function () {
                    //Remove first line item
                    let putForm = {
                        item: "item_alpha", 
                        cost: 99, 
                        qty: 0
                    }
                    let res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to remove line item")
                    }
                    //Remove second line item
                    putForm = {
                        item: "item_beta", 
                        cost: 42069, 
                        qty: 0
                    }
                    res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to add line item")
                    }                        
                });
            });
        });
    });
    //TODO: Create other tests
});