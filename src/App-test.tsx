/**
 * Simple diagnostic version to test plugin loading
 */

import { useEffect } from 'react';
import { client, useConfig, useElementData } from '@sigmacomputing/plugin';

// Configure minimal panel
client.config.configureEditorPanel([
  { name: 'source', type: 'element' },
]);

function App() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);

  useEffect(() => {
    console.log('Plugin loaded!', { config, sigmaData });
  }, [config, sigmaData]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f3f4f6',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
          ✅ Plugin Loaded Successfully!
        </h1>
        <p style={{ color: '#666' }}>
          Config source: {config.source || 'Not configured'}
        </p>
        <p style={{ color: '#666' }}>
          Data rows: {sigmaData ? Object.keys(sigmaData).length : 0}
        </p>
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <pre style={{ fontSize: '12px', textAlign: 'left' }}>
            {JSON.stringify({ config, hasData: !!sigmaData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;

