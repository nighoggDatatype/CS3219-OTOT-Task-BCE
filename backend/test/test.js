import { expect } from 'chai'
import axios from 'axios'

const test_axios = axios.create({
    validateStatus: null //Leave validation to test case
});

describe('Backend API', function () {
    let validButNonExistantId = null
    before(async function () { //Retrieve current id format in use that will not be existant
        let res = await axios.post("http://localhost:8080/api/v1/shoppingCart",
                                    {"username" : 'Normal Username'})
        if (res && res.status == 201) {
            validButNonExistantId = res.data.id
        } else {
            throw new Error("Post failed in test setup!")
        }
        res = await axios.delete(`http://localhost:8080/api/v1/shoppingCart/${validButNonExistantId}`)
        if (!(res && res.status == 200)) {
            throw new Error("Unable to delete cart in cleanup")
        }
    })
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
                if (!(res && res.status == 200)) {
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
            it('should not work with invalid id format', async function () {
                const res = await test_axios.get("http://localhost:8080/api/v1/shoppingCart/badIdFormat")
                expect(res).to.have.property('status',400)
            });
            it('should not work with valid but non-existant id', async function () {
                const res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${validButNonExistantId}`)
                expect(res).to.have.property('status',404)
                expect(res).to.have.nested.property('data.message', `Cart with id ${validButNonExistantId} does not exist!`)
            });
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
                if (!(res && res.status == 200)) {
                    throw new Error("Unable to delete cart in cleanup")
                }
            });
            context('and no line items are added', function () {
                it('should show the cart just fine', async function () {
                    const res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object').that.is.empty;
                });
            });
            context('and one line item is added exactly', function () {
                before(async function () {
                    const putForm = {
                        item: "item", 
                        cost: 99, 
                        qty: 5
                    }
                    const res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to add line item")
                    }                        
                });
                it('should show the cart just fine', async function () {
                    const res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object')
                        .that.deep.equals({"item":{"cost": 99, "qty": 5}})
                });
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
                it('should show the cart just fine', async function () {
                    const res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object')
                        .that.deep.equals({
                            "item_alpha":{"cost": 99, "qty": 5},
                            "item_beta":{"cost": 42069, "qty": 1},
                        })
                });
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
    describe("#Put", function () {
        const goodPutForm = {
            item: "item_alpha", 
            cost: 99, 
            qty: 5
        }
        context("When no cart has been created yet", function () {
            it("should give an error with no id", async function () {
                let res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/`, goodPutForm)
                expect(res).to.have.property('status',404)
            })
            it("should give an error with a non-existant id", async function () {
                let res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${validButNonExistantId}`, goodPutForm)
                expect(res).to.have.property('status',404)
                expect(res).to.have.nested.property('data.message',`Cart with id ${validButNonExistantId} does not exist!`)
            })
        })
        context("When a valid id is provided", function () {
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
                if (!(res && res.status == 200)) {
                    throw new Error("Unable to delete cart in cleanup")
                }
            });
            context("and no line item is present", function () {
                afterEach(async function () {
                    const stillGoodPutForm = {...goodPutForm, qty: 0, cost: undefined}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, stillGoodPutForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to delete line item")
                    }
                })
                it("should reject if there is no put body", async function () {
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Item name is missing!")
                })
                it("should reject whitespace only name", async function () {
                    const badPutForm = {...goodPutForm, item: "   "}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, badPutForm)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Item name must have non-whitespace characters!")
                })
                it("should reject cost passed as float", async function () {
                    const badPutForm = {...goodPutForm, cost: 4.5}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, badPutForm)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Must have postive integer cost if qty is positive!")
                })
                it("should reject cost passed as string", async function () {
                    const badPutForm = {...goodPutForm, cost: "450"}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, badPutForm)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Must have postive integer cost if qty is positive!")
                })
                it("should reject qty passed as string", async function () {
                    const badPutForm = {...goodPutForm, qty: "4"}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, badPutForm)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Item qty is missing or non-integer!")
                })
                it("should reject negative qty", async function () {
                    const badPutForm = {...goodPutForm, qty: -4}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, badPutForm)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Item qty cannot be negative!")
                })
                it("should reject non-positive cost when qty is present", async function () {
                    const badPutForm = {...goodPutForm, cost: -4}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, badPutForm)
                    expect(res).to.have.property('status',400)
                    expect(res).to.have.nested.property('data.message',"Must have postive integer cost if qty is positive!")
                })
                it("should accept well formatted request", async function () {
                    let res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, goodPutForm)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.nested.property('data.message',"Added/Modified line item successfully!")

                    res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object')
                        .that.has.property(goodPutForm.item)
                    expect(res.data.contents[goodPutForm.item])
                        .to.be.an("object")
                        .that.deep.equals({qty : goodPutForm.qty, cost : goodPutForm.cost})
                })
                it("should accept request with missing cost but zero qty", async function () {
                    const stillGoodPutForm = {...goodPutForm, qty: 0, cost: undefined}
                    let res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, stillGoodPutForm)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.nested.property('data.message',"Added/Modified line item successfully!")
                    
                    res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object').that.is.empty;
                })
            })
            context("and a line item is already present", function () {
                beforeEach(async function () {
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, goodPutForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to add line item")
                    }
                })
                it("should accept request to delete line item by setting qty to 0", async function () {
                    const stillGoodPutForm = {...goodPutForm, qty: 0, cost: undefined}
                    let res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, stillGoodPutForm)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.nested.property('data.message',"Added/Modified line item successfully!")

                    res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object').that.is.empty;
                })
                it("should be possible to modify the existing line item", async function () {
                    const stillGoodPutForm = {...goodPutForm, qty: 1, cost: 420}
                    let res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, stillGoodPutForm)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.nested.property('data.message',"Added/Modified line item successfully!")

                    res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                    expect(res).to.have.property('status',200)
                    expect(res).to.have.property('data')
                        .and.be.an('object')
                    expect(res.data).to.have.property('username',"Normal Username")
                    expect(res.data).to.have.property('contents')
                        .that.is.an('object')
                        .that.has.property(stillGoodPutForm.item)
                    expect(res.data.contents[stillGoodPutForm.item])
                        .to.be.an("object")
                        .that.deep.equals({qty: 1, cost: 420})

                })
                afterEach(async function () {
                    const stillGoodPutForm = {...goodPutForm, qty: 0, cost: undefined}
                    const res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, stillGoodPutForm)
                    if (!(res && res.status == 200)) {
                        throw new Error("Unable to delete line item")
                    }
                })
            })
        })
    });
    describe("#Delete", function () {
        context("With no cart present", function () {
            it("should be idempotent", async function () {
                const res = await test_axios.delete(`http://localhost:8080/api/v1/shoppingCart/${validButNonExistantId}`)
                expect(res).to.have.property('status',200)
                expect(res).to.have.nested.property('data.message', "Deleted shopping cart successfully!")
            })
        })
        context("With a cart present", function () {
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
            it("Should delete a cart, with GET and PUT not working on the id, and be idempotent", async function () {
                let res = await test_axios.delete(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                expect(res).to.have.property('status',200)
                expect(res).to.have.nested.property('data.message', "Deleted shopping cart successfully!")
                
                const goodPutForm = {
                    item: "item_alpha", 
                    cost: 99, 
                    qty: 5
                }
                res = await test_axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, goodPutForm)
                expect(res).to.have.property('status',404)
                expect(res).to.have.nested.property('data.message',`Cart with id ${id} does not exist!`)
                
                res = await test_axios.get(`http://localhost:8080/api/v1/shoppingCart/${validButNonExistantId}`)
                expect(res).to.have.property('status',404)
                expect(res).to.have.nested.property('data.message', `Cart with id ${validButNonExistantId} does not exist!`)
                
                res = await test_axios.delete(`http://localhost:8080/api/v1/shoppingCart/${id}`)
                expect(res).to.have.property('status',200)
                expect(res).to.have.nested.property('data.message', "Deleted shopping cart successfully!")
            })
            
        })
    })
});