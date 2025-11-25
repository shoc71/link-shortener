import './App.css';
import Home from './components/Home';

function App() {
  return (
    <div className="">
      <header className="flex header">
        <div className="top bottom">
          <div className="logo">
            I am the header
          </div>
        </div>
      </header>
      <Home />
      <footer className='flex footer'>
        <div className="top bottom">
          <div className="right">
            footer
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
