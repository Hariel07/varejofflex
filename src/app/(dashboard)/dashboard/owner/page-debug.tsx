"use client";

export default function OwnerDashboardDebug() {
  return (
    <div className="dashboard-wrapper">
      <div style={{ padding: '20px', background: 'white', color: 'black' }}>
        <h1>DEBUG: Dashboard Owner</h1>
        <p>Se você está vendo isso, o componente está renderizando.</p>
        <div style={{ background: 'red', color: 'white', padding: '10px' }}>
          TESTE DE VISIBILIDADE
        </div>
      </div>
    </div>
  );
}