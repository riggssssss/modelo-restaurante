import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
      </main>

      {/* Footer / Copyright placeholder */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        fontSize: '0.75rem',
        opacity: 0.5,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        © 2025 Keko Restaurant. Found by ilovecreatives.
      </footer>
    </div>
  );
}

export default App;
