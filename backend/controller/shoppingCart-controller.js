import { ormCreateShoppingCart, ormPutLineItem, ormGetShoppingCart, ormDeleteShoppingCart } from "../model/shoppingCart-orm.js"

//Import for Task E
import 'dotenv/config'
import { startRedis, cacheCart, invalidateCart, getCachedCart } from "../model/cache.js"
if (process.env.TASK_E) {
  await startRedis()
}
const TEST_CART_LINE_COUNT = 1_000


export async function createShoppingCart(req, res) {
    const { username } = req.body
    if (username == null) {
      return res.status(400).json({ message: 'Username is missing!' })
    }
    if (!(typeof username === 'string' || username instanceof String)) {
      return res.status(400).json({ message: 'Username must be a string!' })
    }
    if (username.trim().length === 0) {
      return res.status(400).json({ message: 'Username must contain non-whitespace characters!' })
    }
    try {
      const resp = await ormCreateShoppingCart(username)

      if (resp.err) {
        return res.status(400).json({ message: 'Could not create a new cart!' })
      } else {
        console.log(`Created new cart with owner ${username} successfully!`)
        return res
          .status(201)
          .json({ 
              message: `Created new cart with owner ${username} successfully!`, 
              id: resp._id.toHexString()
          })
      }
    } catch (err) {
      console.log(err)
      return res
        .status(500)
        .json({ message: 'Database failure when creating new cart!' })
    }
}
export async function putLineItemInShoppingCart(req, res) {
  const id = req.params.id
  const { item, cost, qty } = req.body
  if (id == null) {
    console.log('Cart ID is missing!')
    return res.status(400).json({ message: 'Cart ID is missing!' })
  }
  if (item == null) {
    console.log('Item name is missing!')
    return res.status(400).json({ message: 'Item name is missing!' })
  }
  if (item.trim().length === 0) {
    console.log('Item name must have non-whitespace characters!')
    return res.status(400).json({ message: 'Item name must have non-whitespace characters!' })
  }
  if ( !Number.isInteger(qty) ) {
    console.log('Item qty is missing or non-integer!')
    return res.status(400).json({ message: 'Item qty is missing or non-integer!' })
  }
  if ( qty < 0 ) {
    console.log('Item qty cannot be negative!')
    return res.status(400).json({ message: 'Item qty cannot be negative!' })
  }
  if ( qty > 0 && (!Number.isInteger(cost) || cost <= 0) ) {
    console.log('Must have postive integer cost if qty is positive!')
    return res.status(400).json({ message: 'Must have postive integer cost if qty is positive!' })
  }
  try {
    const resp = await ormPutLineItem(id, item, cost, qty)

    if (resp.err) {
      return res.status(400).json({ message: 'Could not put a new line item!' })
    } 
    if (!resp) {
      return res.status(404).json({ message: `Cart with id ${id} does not exist!`})
    }

    console.log(`Added/Modified line item successfully!`)
    if (process.env.TASK_E) {
      await invalidateCart(id)
    }
    return res
      .status(200)
      .json({ 
          message: `Added/Modified line item successfully!`
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Database failure when modifing cart!' })
  }
}
export async function getShoppingCart(req, res) {
  const id = req.params.id
  if ( !(id) ) {
    return res.status(400).json({ message: 'Cart ID is missing!' })
  }
  try {
    if (process.env.TASK_E) {
      const cache = await getCachedCart(id)
      if (cache) {
        console.log(`Retrieved shopping cart successfully!`)
        return res
          .status(200)
          .json(cache)
      }
    }

    const resp = await ormGetShoppingCart(id)
    
    if (resp === null) {
      return res.status(404).json({ message: `Cart with id ${id} does not exist!`})
    }

    if (resp.err) {
      return res.status(400).json({ message: 'Could not get shopping cart!' })
    } else {
      console.log(`Retrieved shopping cart successfully!`)
      if (process.env.TASK_E) {
        await cacheCart(id, resp)
      }
      return res
        .status(200)
        .json(resp)
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Database failure when finding cart!' })
  }
}
export async function deleteShoppingCart (req, res) {
  const id = req.params.id
  if ( !(id) ) {
    return res.status(400).json({ message: 'Cart ID is missing!' })
  }
  try {
    const resp = await ormDeleteShoppingCart(id)

    if (resp.err) {
      return res.status(400).json({ message: 'Could not delete shopping cart!' })
    } else {
      console.log(`Deleted shopping cart successfully!`)
      if (process.env.TASK_E) {
        await invalidateCart(id)
      }
      return res
        .status(200) //We use 200 instead of 204 because we also send a emssage
        .json({ message: 'Deleted shopping cart successfully!' })
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Database failure when deleting cart!' })
  }
}
export async function createTestCart(req, res) {
  const { username } = req.body
  if (username == null) {
    return res.status(400).json({ message: 'Error' })
  }
  if (!(typeof username === 'string' || username instanceof String)) {
    return res.status(400).json({ message: 'Error' })
  }
  if (username.trim().length === 0) {
    return res.status(400).json({ message: 'Error' })
  }
  var cartID
  try {
    var resp = await ormCreateShoppingCart(username)

    if (resp.err) {
      return res.status(400).json({ message: 'Error' })
    }

    cartID = resp._id.toHexString()

    const getRandomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
    for (var i = 0; i < TEST_CART_LINE_COUNT; i++) {
      
      const item = `item_${i}`
      const cost = getRandomInt(99,100_00)
      const qty = getRandomInt(1,100)

      resp = await ormPutLineItem(cartID, item, cost, qty)

      if (resp.err || !resp) {
        throw new Error("Error in creating line item")
      }
    }

    return res
      .status(201)
      .json({ 
          lineCount: TEST_CART_LINE_COUNT, 
          id: cartID
      })
  } catch (err) {
    console.log(err)

    if (cartID) {
      await ormDeleteShoppingCart(cartID)
    }
    return res
      .status(500)
      .json({ message: 'Database error!' })
  }
}