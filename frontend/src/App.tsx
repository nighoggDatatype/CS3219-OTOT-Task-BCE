import React, { useState } from 'react';
import './App.css';
import CartDisplay from './components/CartDisplay';
import CartForm from './components/CartForm';

function App() {
  const [id, setId] = useState({"id" : null});
  let app = null
  if (id.id === null) {
    app = <CartForm setId={setId}/>
  } else {
    const wipeId = () => {setId({"id" : null})}
    app = <CartDisplay id={id.id} wipeId={wipeId}/>
  }
  return (
    <div className="App">
      <header className="App-header">
        {app}
      </header>
    </div>
  );
}

export default App;
