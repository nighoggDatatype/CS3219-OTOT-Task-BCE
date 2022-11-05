import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from 'axios';

function CartForm({setId}:{setId:Function}) {
  const [postForm, setPostForm] = useState({"username": ""})

  const handleChange = (e:any) => {
    e.preventDefault(); // prevent the default action
    setPostForm({"username" : e.target.value}); // set name to e.target.value (event)
  };

  const submitForm = async (e:any) => { 
    e.preventDefault()
    if (postForm.username.trim().length == 0) {
      return
    }
    const res = await axios.post("http://localhost:8080/api/v1/shoppingCart", postForm)
    if (res && res.status === 201) {
      setId({"id" : res.data.id})
    }
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username: </Form.Label>
        <Form.Control
            value={postForm.username}
            type="text"
            onChange={handleChange}
          ></Form.Control>
      </Form.Group>
      <Button variant="primary" onClick={submitForm}>
        Submit
      </Button>
    </Form>
  );
}

export default CartForm;