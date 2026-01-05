import Gallery from './components/Gallery';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <nav className="nav-left">
          <a href="#about" className="nav-link">About</a>
          <a href="#collection" className="nav-link">Collection</a>
        </nav>
        
        <h1 className="site-title">Aesthetic Home</h1>
        
        <nav className="nav-right">
          <a href="#journal" className="nav-link">Journal</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </header>

      <main>
        <Gallery />
      </main>
    </div>
  );
}

export default App;
