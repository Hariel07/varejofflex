"use client";

import { useState } from 'react';

export default function DebugLoginPage() {
  const [email, setEmail] = useState('carlos.teste@varejoflex.com');
  const [password, setPassword] = useState('123456'); // Tentar senha mais simples primeiro
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/debug/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      setResult({
        status: response.status,
        data
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>🔧 Debug Login Test</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={testLogin}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
              
              <div className="mt-3">
                <h6>Testar senhas comuns:</h6>
                <div className="btn-group-vertical w-100" role="group">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPassword('123456')}
                  >
                    Testar: 123456
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPassword('Thmpv1996@')}
                  >
                    Testar: Thmpv1996@
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPassword('senha123')}
                  >
                    Testar: senha123
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPassword('admin123')}
                  >
                    Testar: admin123
                  </button>
                </div>
              </div>
              
              {result && (
                <div className="mt-4">
                  <h5>Result:</h5>
                  <pre className="bg-light p-3 rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}