import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
            <p>Page Not Found</p>
          </div>
        </div>
      </body>
    </html>
  );
}
