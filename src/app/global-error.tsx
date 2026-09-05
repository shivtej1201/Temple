'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafaf9',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e7e5e4',
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1c1917', margin: '0 0 0.5rem 0' }}>
              Critical Application Error
            </h2>
            <p style={{ color: '#57534e', margin: '0 0 2rem 0' }}>
              A fatal error occurred at the root level of the application.
            </p>
            <button
              onClick={() => reset()}
              style={{
                width: '100%',
                backgroundColor: '#ea580c',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
