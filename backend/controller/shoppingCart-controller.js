import { ormCreateShoppingCart, ormPutLineItem, ormGetShoppingCart, ormDeleteShoppingCart } from "../model/shoppingCart-orm.js"

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
    const resp = await ormGetShoppingCart(id)
    
    if (resp === null) {
      return res.status(404).json({ message: `Cart with id ${id} does not exist!`})
    }

    if (resp.err) {
      return res.status(400).json({ message: 'Could not get shopping cart!' })
    } else {
      console.log(`Retrieved shopping cart successfully!`)
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