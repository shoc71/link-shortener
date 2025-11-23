import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NavBar } from './components/NavBar';

function App() {
  return (
    
    <div className="App">
      <NavBar />
      <main className="App-header">
        <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          />
        <div className="p-4 d-flex">
          <label htmlFor="" className='mx-2'>OG</label>
          <textarea className='form-control' name="" id=""></textarea>
          <button className='btn btn-primary'>Shorten Link</button>
        </div>
        <div className="">
          <label htmlFor="" className='mx-2'>New</label>
          <input type="text" placeholder='New Link' value={'test'}/>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>I don't like this format</p>
      </main>
    </div>
  );
}

export default App;
