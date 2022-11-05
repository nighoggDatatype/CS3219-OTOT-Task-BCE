import { useState, useEffect } from 'react';

import Stack from "react-bootstrap/Stack"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import Badge from "react-bootstrap/Badge"

import axios from 'axios';
import LineForm from './LineForm'
import { Button } from 'react-bootstrap';

type LineItemValue = {centCost:number, qty:number}
type Contents = {
  [LineItemName: string] : LineItemValue
}
type Cart = {"username" : String, "contents" :Contents}

const NullCart:Cart = {"username": "", "contents": {}}

function CartDisplay({id, wipeId}:{id:String, wipeId:()=>void}) {
  const [cart , setCart]= useState(NullCart);
  const [fresh, setFresh] = useState(false)

  useEffect(() => {
    if (id && !fresh) {
        axios
          .get(`http://localhost:8080/api/v1/shoppingCart/${id}`)
          .then((res) => {
            if (res && res.status === 200) {
                setCart(res.data)
                setFresh(true)
              }
          })
    }
  })

  if (fresh) {
    const lineItems = 
      Object.getOwnPropertyNames(cart.contents).map((key) => {
        const {centCost, qty} = cart.contents[key]
        const deleteItem = async (e:any) => {
          e.preventDefault()
          const putForm = {
            "id" : id,
            "item" : key,
            "qty" : 0
          }
          const res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
          if (res && res.status === 200) {
            setFresh(false);
          }
        }
        return (
          <ListGroup.Item 
            variant="dark" 
            className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{key}</div>
                {`$${centCost/100}`}
            </div>
            <div>
              <Badge bg="primary" pill>{qty}</Badge>
            </div>
            <div className="mx-1">
              <Button variant='danger' onClick={deleteItem}>Delete line item</Button>
            </div>
          </ListGroup.Item>
        )
      })
    const deleteCart = async (e:any) => {
      e.preventDefault()
      const res = await axios.delete(`http://localhost:8080/api/v1/shoppingCart/${id}`)
      if (res && res.status === 200) {
        wipeId()
        setFresh(false)
      }
    }
    return (
        <Stack gap={3} className="col-md-11 mx-auto">
        <Card 
          bg="dark"
          key="Dark"
          text='white'
          className="mx-3">
          <Card.Body>
            <Card.Title>{`"${cart.username}"'s Shopping Cart`}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
            <ListGroup variant="flush">
            {lineItems}
            </ListGroup>
          </Card.Body>
        </Card>
        <LineForm id={id} setFresh={setFresh} />
        <div className="d-flex justify-content-center">
          <Button variant="danger" size="lg" onClick={deleteCart}>
            Delete Shopping Cart
          </Button>
        </div>
        </Stack>
    );
  } else {
    return (
        <p>Loading Cart...</p>
    );
  }
}

export default CartDisplay;