import { ormCreateShoppingCart, ormPutLineItem } from "../model/shoppingCart-orm.js"

export async function createShoppingCart(req, res) {
    try {
      const { username } = req.body
      if (username) {
  
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
      } else {
        return res
          .status(400)
          .json({ message: 'Username is missing!' })
      }
    } catch (err) {
      console.log(err)
      return res
        .status(500)
        .json({ message: 'Database failure when creating new user!' })
    }
}
export async function putLineItemInShoppingCart(req, res) {
  const id = req.params.id //TODO: Check this
  const { item, cost, qty } = req.body
  if ( !(id) ) {
    return res.status(400).json({ message: 'Card ID is missing!' })
  }
  if ( !(item) ) {
    return res.status(400).json({ message: 'Item name is missing!' })
  }
  if ( !(qty) || !Number.isInteger(qty)) {
    return res.status(400).json({ message: 'Item qty is missing!' })
  }
  if ( qty < 0 ) {
    return res.status(400).json({ message: 'Item qty cannot be negative!' })
  }
  if ( qty > 0 && (!Number.isInteger(cost) || cost <= 0) ) {
    return res.status(400).json({ message: 'Must have postive cost if qty is positve!' })
  }
  try {
    const resp = await ormPutLineItem(id, item, cost, qty)

    if (resp.err) {
      return res.status(400).json({ message: 'Could not put a new line item!' })
    } else {
      console.log(`Added new line item successfully!`)
      return res
        .status(200)
        .json({ 
            message: `Added new line item successfully!`
        })
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Database failure when creating new user!' })
  }
}