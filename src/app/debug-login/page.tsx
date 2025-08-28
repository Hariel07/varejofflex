"use client";

import { useState } from 'react';

export default function DebugLoginPage() {
  const [email, setEmail] = useState('carlos.teste@varejoflex.com');
  const [password, setPassword] = useState('Thmpv1996@');
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