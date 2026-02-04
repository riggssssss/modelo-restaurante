import React from 'react';
import '../index.css';

const Hero = () => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            height: 'calc(100vh - 100px)', /* adjust for header roughly */
            width: '100%',
            padding: '0 3rem 3rem 3rem',
            gap: '2rem'
        }}>
            {/* Left side: Image Grid/Placeholder */}
            <div style={{
                backgroundColor: '#e6e0d4',
                borderRadius: '2rem',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Placeholder for the dining table image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.9
                }}></div>
            </div>

            {/* Right side: Text Content */}
            <div style={{
                backgroundColor: '#fbf8f1', /* Matches body bg */
                borderRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '4rem'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    lineHeight: 1.1,
                    maxWidth: '12ch',
                    marginBottom: '2rem',
                    color: '#1a1a1a'
                }}>
                    A MEETING PLACE FOR LOCALS.
                </h1>

                <p style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '4rem',
                    fontWeight: 600
                }}>
                    (AND EVERYONE ELSE).
                </p>

                {/* Decorative cloud/scribble at bottom */}
                <div style={{ marginTop: 'auto' }}>
                    <svg width="60" height="40" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10,50 Q30,20 50,50 T90,50" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Hero;
