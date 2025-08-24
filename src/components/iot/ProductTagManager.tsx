"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface Product {
  sku: string;
  name: string;
  price: number;
  batch: string;
  expiry: string;
  qty: number;
  category: string;
  brand: string;
}

interface Tag {
  productSku: string;
  type: 'qr' | 'nfc' | 'ble';
  serial: string;
}

export default function ProductTagManager() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'products' | 'tags' | 'csv'>('products');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para formulários
  const [productForm, setProductForm] = useState<Product>({
    sku: '',
    name: '',
    price: 0,
    batch: '',
    expiry: '',
    qty: 0,
    category: '',
    brand: ''
  });

  const [tagForm, setTagForm] = useState<Tag>({
    productSku: '',
    type: 'nfc',
    serial: ''
  });

  const [csvData, setCsvData] = useState('');
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/iot/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          storeId: 'demo-store', // TODO: pegar do contexto
          userId: (session?.user as any)?.id || session?.user?.email,
          userRole: 'admin'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Produto cadastrado com sucesso!');
        setProductForm({
          sku: '',
          name: '',
          price: 0,
          batch: '',
          expiry: '',
          qty: 0,
          category: '',
          brand: ''
        });
      } else {
        alert('❌ Erro: ' + data.error);
      }
    } catch (error) {
      alert('❌ Erro ao cadastrar produto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/iot/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tagForm,
          storeId: 'demo-store', // TODO: pegar do contexto
          userId: (session?.user as any)?.id || session?.user?.email,
          userRole: 'admin'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Tag cadastrada com sucesso!');
        setTagForm({
          productSku: '',
          type: 'nfc',
          serial: ''
        });
      } else {
        alert('❌ Erro: ' + data.error);
      }
    } catch (error) {
      alert('❌ Erro ao cadastrar tag');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvProcess = () => {
    if (!csvData.trim()) return;

    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const preview = lines.slice(1, 6).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const row: any = { _index: index + 1 };
      
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      
      return row;
    });

    setCsvPreview(preview);
  };

  const handleCsvImport = async () => {
    if (!csvData.trim()) {
      alert('❌ Nenhum dado CSV para importar');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/iot/import/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData,
          type: 'products', // ou 'tags'
          storeId: 'demo-store',
          userId: (session?.user as any)?.id || session?.user?.email,
          userRole: 'admin'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Importação concluída! ${data.data.imported} itens processados`);
        setCsvData('');
        setCsvPreview([]);
      } else {
        alert('❌ Erro: ' + data.error);
      }
    } catch (error) {
      alert('❌ Erro na importação');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          color: '#1E293B',
          fontSize: '2rem',
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          🏷️ Cadastrar Adesivos e Produtos
        </h1>
        <p style={{
          color: '#64748B',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Cadastre produtos e vincule tags NFC, QR Code ou BLE
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '25px'
      }}>
        {[
          { id: 'products', label: '📦 Produtos', icon: '📦' },
          { id: 'tags', label: '🏷️ Tags', icon: '🏷️' },
          { id: 'csv', label: '📊 Importar CSV', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                : 'rgba(255, 255, 255, 0.9)',
              color: activeTab === tab.id ? 'white' : '#64748B',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backdropFilter: 'blur(20px)',
              boxShadow: activeTab === tab.id 
                ? '0 10px 25px rgba(16, 185, 129, 0.3)' 
                : '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Produtos Tab */}
        {activeTab === 'products' && (
          <form onSubmit={handleProductSubmit}>
            <h2 style={{ color: '#1E293B', marginBottom: '20px' }}>
              📦 Cadastrar Produto
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  🏷️ SKU *
                  <span style={{ color: '#64748B', fontWeight: 'normal', fontSize: '0.9rem' }}>
                    {' '}(Identificador único do produto)
                  </span>
                </label>
                <input
                  type="text"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                  placeholder="Ex: REFRI_COLA_350ML"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  📝 Nome do Produto *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Ex: Refrigerante Cola 350ml"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  💰 Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                  placeholder="Ex: 5.90"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  📊 Quantidade em Estoque
                </label>
                <input
                  type="number"
                  value={productForm.qty}
                  onChange={(e) => setProductForm({...productForm, qty: parseInt(e.target.value)})}
                  placeholder="Ex: 120"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  📦 Lote
                  <span style={{ color: '#64748B', fontWeight: 'normal', fontSize: '0.9rem' }}>
                    {' '}(Para rastreabilidade e controle de validade)
                  </span>
                </label>
                <input
                  type="text"
                  value={productForm.batch}
                  onChange={(e) => setProductForm({...productForm, batch: e.target.value})}
                  placeholder="Ex: L2025-08"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  📅 Data de Validade
                </label>
                <input
                  type="date"
                  value={productForm.expiry}
                  onChange={(e) => setProductForm({...productForm, expiry: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading 
                  ? '#94A3B8' 
                  : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
              }}
            >
              {loading ? '⏳ Cadastrando...' : '✅ Cadastrar Produto'}
            </button>
          </form>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <form onSubmit={handleTagSubmit}>
            <h2 style={{ color: '#1E293B', marginBottom: '20px' }}>
              🏷️ Cadastrar Tag IoT
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  📦 SKU do Produto *
                </label>
                <input
                  type="text"
                  value={tagForm.productSku}
                  onChange={(e) => setTagForm({...tagForm, productSku: e.target.value})}
                  placeholder="Ex: REFRI_COLA_350ML"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  🎯 Tipo de Tag *
                </label>
                <select
                  value={tagForm.type}
                  onChange={(e) => setTagForm({...tagForm, type: e.target.value as any})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="nfc">📱 NFC (Aproximação)</option>
                  <option value="qr">📱 QR Code (Câmera)</option>
                  <option value="ble">📡 BLE (Bluetooth)</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}>
                  🏷️ Serial/UID *
                  <span style={{ color: '#64748B', fontWeight: 'normal', fontSize: '0.9rem' }}>
                    {tagForm.type === 'nfc' && ' (UID impresso na tag NFC)'}
                    {tagForm.type === 'ble' && ' (MAC Address do dispositivo BLE)'}
                    {tagForm.type === 'qr' && ' (Código único do QR Code)'}
                  </span>
                </label>
                <input
                  type="text"
                  value={tagForm.serial}
                  onChange={(e) => setTagForm({...tagForm, serial: e.target.value})}
                  placeholder={
                    tagForm.type === 'nfc' ? 'Ex: 04:A3:B2:C1:D4:E5:F6' :
                    tagForm.type === 'ble' ? 'Ex: AA:BB:CC:DD:EE:FF' :
                    'Ex: QR_PROD_001'
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading 
                  ? '#94A3B8' 
                  : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
              }}
            >
              {loading ? '⏳ Cadastrando...' : '✅ Cadastrar Tag'}
            </button>
          </form>
        )}

        {/* CSV Tab */}
        {activeTab === 'csv' && (
          <div>
            <h2 style={{ color: '#1E293B', marginBottom: '20px' }}>
              📊 Importar via CSV
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#1E293B'
              }}>
                📝 Dados CSV
                <span style={{ color: '#64748B', fontWeight: 'normal', fontSize: '0.9rem' }}>
                  {' '}(Cole aqui ou faça upload de arquivo)
                </span>
              </label>
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="sku,name,price,qty,batch,expiry,category,brand&#10;REFRI_COLA_350ML,Refrigerante Cola 350ml,5.90,120,L2025-08,2025-11-30,Bebida,Coca-Cola&#10;AGUA_500ML,Água Mineral 500ml,2.50,200,L2025-09,2026-01-15,Bebida,Crystal"
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={handleCsvProcess}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}
              >
                👁️ Visualizar Preview
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCsvData(event.target?.result as string);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📁 Upload CSV
              </button>
            </div>

            {/* CSV Preview */}
            {csvPreview.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#1E293B', marginBottom: '10px' }}>
                  👁️ Preview (primeiras 5 linhas)
                </h3>
                <div style={{
                  overflow: 'auto',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  background: '#FFF7ED'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F59E0B', color: 'white' }}>
                        {Object.keys(csvPreview[0]).filter(k => k !== '_index').map(header => (
                          <th key={header} style={{ padding: '8px', textAlign: 'left' }}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.map((row, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.2)' }}>
                          {Object.keys(row).filter(k => k !== '_index').map(key => (
                            <td key={key} style={{ padding: '8px' }}>
                              {row[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleCsvImport}
                  disabled={loading}
                  style={{
                    background: loading 
                      ? '#94A3B8' 
                      : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    marginTop: '15px'
                  }}
                >
                  {loading ? '⏳ Importando...' : '✅ Importar Dados'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}