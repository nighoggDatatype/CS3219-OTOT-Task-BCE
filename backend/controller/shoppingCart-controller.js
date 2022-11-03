import { ormCreateShoppingCart } from "../model/shoppingCart-orm.js"

export async function createShoppingCart(req, res) {
    try {
      const { username } = req.body
      if (username) {
  
        const resp = await ormCreateShoppingCart(username)
  
        if (resp.err) {
          return res.status(400).json({ message: 'Could not create a new user!' })
        } else {
          console.log(`Created new user ${username} successfully!`)
          return res
            .status(201)
            .json({ 
                message: `Created new user ${username} successfully!`, 
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