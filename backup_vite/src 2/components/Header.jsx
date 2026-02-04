import React from 'react';
import '../index.css';

const Header = () => {
  const navItems = ['Home', 'About', 'Menu', 'Feed me menu', 'Contact us', 'Gift Vouchers'];

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 3rem',
      width: '100%',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
        KEKO
      </div>
      
      <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }}>
          {navItems.map((item) => (
            <li key={item}>
              <a href={`#${item.replace(/\s+/g, '-').toLowerCase()}`} style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase',
                fontWeight: 500,
                letterSpacing: '0.05em'
              }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
        <a href="#bookings" style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          fontWeight: 600,
          borderBottom: '1px solid currentColor',
          paddingBottom: '2px'
        }}>
          Bookings
        </a>
      </nav>
    </header>
  );
};

export default Header;
