import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import axios from 'axios';

function LineForm({id, setFresh}:{id:String, setFresh:Function}) {
  const [putForm, setPutForm] = useState({ //Initial values for form
    "id"   : id, 
    "item" : "", 
    "cost" : 99, 
    "qty"  : 1
  })

  const submitForm = async (e:any) => { 
    e.preventDefault()
    if (putForm.item.trim().length == 0) {
        return //Need non empty item name
    }
    if (putForm.cost <= 0 || putForm.qty <= 0) {
        return //Need positive values for cost and qty
    }
    const res = await axios.put(`http://localhost:8080/api/v1/shoppingCart/${id}`, putForm)
    if (res && res.status === 200) {
      setFresh(false);
    }
  }
  const itemChange = (e:any) => {
    e.preventDefault()
    setPutForm((prevForm) => {return {...prevForm, "item" : e.target.value}})
  }
  
  const hasOnlyDigits = (str:string):boolean => /^\d*$/.test(str);

  const dollarChange = (e:any):void => {
    setPutForm((prevForm) => {
        if (!hasOnlyDigits(e.target.value)) {
            return prevForm
        }
        const newValue = parseInt(e.target.value.padStart(1,"0"))
        if (isNaN(newValue)) {
            return prevForm
        }
        //Max 999,999 dollars
        if (newValue > 999_999) {
            return prevForm
        }
        const newCost = (newValue * 100) + (prevForm.cost % 100)
        return {...prevForm, "cost" : newCost}
    })
  }
  const centsChange = (e:any):void => {
    setPutForm((prevForm) => {
        const newValueString = e.target.value
        if (!hasOnlyDigits(newValueString)) {
            return prevForm
        }
        //Get last 2 digits as int
        const newValue = parseInt(newValueString.padStart(2,"0").slice(-2))
        if (isNaN(newValue)) {
            return prevForm
        }
        const oldDollars = ~~(prevForm.cost/100)
        const newCost = oldDollars * 100 + newValue

        return {...prevForm, "cost" : newCost}
    })
  }
  const toDollarsQuotientString = (totalCents:number):string => {
    return (~~(totalCents/100)).toString()
  }
  const toCentsRemainderString = (totalCents:number):string => {
    return (totalCents % 100).toString().padStart(2,"0")
  }
  const qtyChange = (e:any):void => {
    setPutForm((prevForm) => {
        if (!hasOnlyDigits(e.target.value)) {
            return prevForm
        }
        const newValue = parseInt(e.target.value.padStart(1,'0'))
        if (isNaN(newValue)) {
            return prevForm
        }
        if (newValue > 999_999) {
            return prevForm
        }
        return {...prevForm, "qty" : newValue}
    })
  }
  return (
    <Form>
      <Container>
        <Row><Col className="mb-2">Add/Modify line item</Col></Row>
        <Row>
          <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text>Item:</InputGroup.Text>
            <Form.Control value={putForm.item} onChange={itemChange} aria-label="Item name" /> 
          </InputGroup>
          </Col>
          <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text>Cost:</InputGroup.Text>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control 
              value={toDollarsQuotientString(putForm.cost)}
              onChange={dollarChange}
              aria-label="Dollars" /> 
            <InputGroup.Text>.</InputGroup.Text>
            <Form.Control
              value={toCentsRemainderString(putForm.cost)}
              onChange={centsChange}
              aria-label="Cents" />
          </InputGroup>
          </Col>
          <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text>Qty:</InputGroup.Text>
            <Form.Control 
              value={putForm.qty}
              onChange={qtyChange}
              aria-label="Quantity of item(s)" /> 
          </InputGroup>
          </Col>
          <Col md="auto">
            <Button variant="primary" onClick={submitForm}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

export default LineForm;