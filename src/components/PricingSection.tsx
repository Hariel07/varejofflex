"use client";

import Link from "next/link";
import React, { useState } from 'react';
import AddOnCard, { UpgradeModal } from './AddOnCard';
import { PlanType, PLAN_INFO } from '@/lib/planMatrix';

export default function PricingSection() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<PlanType>('profissional');
  const [selectedAddOnName, setSelectedAddOnName] = useState('');

  const handleUpgrade = (targetPlan: PlanType, addOnName: string) => {
    setSelectedUpgradePlan(targetPlan);
    setSelectedAddOnName(addOnName);
    setShowUpgradeModal(true);
  };

  const handleSubscribe = (addOnId: string) => {
    // Implementar lógica de contratação
    console.log('Contratando add-on:', addOnId);
  };

  return (
    <section className="py-5 bg-light" id="pricing">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-4 fw-bold mb-3 text-dark">Escolha seu Plano</h2>
            <p className="lead text-muted">
              Soluções completas para diferentes tamanhos de negócio
            </p>
          </div>
        </div>

        <div className="row justify-content-center align-items-stretch">
          {/* Plano Básico */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '750px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="card-header border-0 bg-transparent text-center pt-4">
                <h4 className="fw-bold text-primary mb-0">Plano Básico</h4>
                <div className="mt-3">
                  <span className="h2 fw-bold text-dark">R$ 89</span>
                  <span className="text-muted">/mês</span>
                </div>
                <div className="text-success small fw-bold mb-2">
                  ou R$ 67/mês anual (25% off)
                </div>
              </div>
              <div className="card-body flex-grow-1 px-4">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <strong>Sistema de PDV Completo</strong>
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Gestão de Estoque
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Controle Financeiro
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Relatórios Básicos
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Suporte por Email
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-cpu text-primary me-2"></i>
                    <strong>IoT Básico:</strong> 2 dispositivos
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-robot text-warning me-2"></i>
                    <strong>IA Básica:</strong> Análise de vendas
                  </li>
                </ul>
                <div className="mt-auto">
                  <small className="text-muted">
                    <strong>Ideal para:</strong> Pequenos negócios
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=basico" className="btn btn-primary w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Plano Profissional */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100 position-relative"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(25, 135, 84, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid #0d6efd',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '750px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="position-absolute top-0 start-50 translate-middle">
                <span className="badge bg-primary px-3 py-2">MAIS POPULAR</span>
              </div>
              <div className="card-header border-0 bg-transparent text-center pt-4">
                <h4 className="fw-bold text-primary mb-0">Plano Profissional</h4>
                <div className="mt-3">
                  <span className="h2 fw-bold text-dark">R$ 189</span>
                  <span className="text-muted">/mês</span>
                </div>
                <div className="text-success small fw-bold mb-2">
                  ou R$ 142/mês anual (25% off)
                </div>
              </div>
              <div className="card-body flex-grow-1 px-4">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <strong>Tudo do Plano Básico</strong>
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    CRM Avançado
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Delivery/E-commerce
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Relatórios Avançados
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Suporte Prioritário
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-cpu text-primary me-2"></i>
                    <strong>IoT Avançado:</strong> 10 dispositivos
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-robot text-warning me-2"></i>
                    <strong>IA Pro:</strong> Chatbot + Análises
                  </li>
                </ul>
                <div className="mt-auto">
                  <small className="text-muted">
                    <strong>Ideal para:</strong> Médias empresas
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=profissional" className="btn btn-primary w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Plano Empresarial */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '750px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="card-header border-0 bg-transparent text-center pt-4">
                <h4 className="fw-bold text-success mb-0">Plano Empresarial</h4>
                <div className="mt-3">
                  <span className="h2 fw-bold text-dark">R$ 389</span>
                  <span className="text-muted">/mês</span>
                </div>
                <div className="text-success small fw-bold mb-2">
                  ou R$ 292/mês anual (25% off)
                </div>
              </div>
              <div className="card-body flex-grow-1 px-4">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <strong>Tudo do Plano Profissional</strong>
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Multi-loja (até 5)
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Integrações Avançadas
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    BI Personalizado
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Suporte 24/7
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-cpu text-primary me-2"></i>
                    <strong>IoT Enterprise:</strong> Dispositivos ilimitados
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-robot text-warning me-2"></i>
                    <strong>IA Total:</strong> Todos os recursos
                  </li>
                </ul>
                <div className="mt-auto">
                  <small className="text-muted">
                    <strong>Ideal para:</strong> Grandes empresas
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=empresarial" className="btn btn-success w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Addons Section - Sistema Inteligente de Disponibilidade */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-12">
            <div className="text-center mb-5">
              <h3 className="fw-bold text-dark">Serviços Adicionais (Add-ons)</h3>
              <p className="text-muted">Expanda suas funcionalidades com nossos addons premium - disponibilidade baseada no seu plano</p>
            </div>
            
            {/* CATEGORIA: OPERAÇÃO & PDV */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-primary mb-2">
                  <i className="bi bi-credit-card me-2"></i>Operação & PDV
                </h4>
                <p className="text-muted">Expanda sua operação com terminais e funcionalidades extras</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="pdv_extra"
                    icon="bi bi-display"
                    title="PDV Extra"
                    description="Terminal de vendas adicional para atender mais clientes simultaneamente"
                    price={29}
                    category="operacao"
                    onSubscribe={() => handleSubscribe('pdv_extra')}
                    onUpgrade={() => handleUpgrade('profissional', 'PDV Extra')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="kds"
                    icon="bi bi-tv"
                    title="KDS - Display de Cozinha"
                    description="Tela exclusiva para a cozinha visualizar pedidos em tempo real"
                    price={19}
                    category="operacao"
                    onSubscribe={() => handleSubscribe('kds')}
                    onUpgrade={() => handleUpgrade('basico', 'KDS - Display de Cozinha')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="delivery_pro"
                    icon="bi bi-truck"
                    title="Delivery Pro"
                    description="Sistema avançado de gestão de entregas com rastreamento GPS"
                    price={39}
                    category="operacao"
                    onSubscribe={() => handleSubscribe('delivery_pro')}
                    onUpgrade={() => handleUpgrade('profissional', 'Delivery Pro')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="self_checkout"
                    icon="bi bi-qr-code-scan"
                    title="Self-Checkout"
                    description="Permitir que clientes façam checkout usando QR code"
                    price={49}
                    category="operacao"
                    onSubscribe={() => handleSubscribe('self_checkout')}
                    onUpgrade={() => handleUpgrade('empresarial', 'Self-Checkout')}
                  />
                </div>
              </div>
            </div>

            {/* CATEGORIA: IOT & AUTOMAÇÃO */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-success mb-2">
                  <i className="bi bi-cpu me-2"></i>IoT & Automação
                </h4>
                <p className="text-muted">Conecte seus equipamentos e automatize processos</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="sensor_movimento"
                    icon="bi bi-eye"
                    title="Sensor Movimento"
                    description="Detecta movimento de clientes e funcionários na loja"
                    price={25}
                    setupFee={99}
                    category="iot"
                    onSubscribe={() => handleSubscribe('sensor_movimento')}
                    onUpgrade={() => handleUpgrade('profissional', 'Sensor Movimento')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="sensor_temperatura"
                    icon="bi bi-thermometer-half"
                    title="Sensor Temperatura"
                    description="Monitora temperatura de freezers, geladeiras e ambiente"
                    price={35}
                    setupFee={129}
                    category="iot"
                    onSubscribe={() => handleSubscribe('sensor_temperatura')}
                    onUpgrade={() => handleUpgrade('profissional', 'Sensor Temperatura')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="tag_produto"
                    icon="bi bi-tags"
                    title="Tag Produto"
                    description="Tags inteligentes para rastreamento de produtos em tempo real"
                    price={15}
                    setupFee={199}
                    category="iot"
                    onSubscribe={() => handleSubscribe('tag_produto')}
                    onUpgrade={() => handleUpgrade('empresarial', 'Tag Produto')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="automacao_luz"
                    icon="bi bi-lightbulb"
                    title="Automação de Luz"
                    description="Controle automático de iluminação baseado em presença"
                    price={45}
                    setupFee={249}
                    category="iot"
                    onSubscribe={() => handleSubscribe('automacao_luz')}
                    onUpgrade={() => handleUpgrade('empresarial', 'Automação de Luz')}
                  />
                </div>
              </div>
            </div>

            {/* CATEGORIA: INTELIGÊNCIA ARTIFICIAL */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-warning mb-2">
                  <i className="bi bi-robot me-2"></i>Inteligência Artificial
                </h4>
                <p className="text-muted">Otimize vendas e atendimento com IA avançada</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="chatbot_whatsapp"
                    icon="bi bi-whatsapp"
                    title="Chatbot WhatsApp"
                    description="IA para atendimento automático via WhatsApp"
                    price={89}
                    category="ia"
                    onSubscribe={() => handleSubscribe('chatbot_whatsapp')}
                    onUpgrade={() => handleUpgrade('profissional', 'Chatbot WhatsApp')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="recomendacao_produtos"
                    icon="bi bi-stars"
                    title="Recomendação Produtos"
                    description="IA que sugere produtos baseado no histórico de compras"
                    price={129}
                    category="ia"
                    onSubscribe={() => handleSubscribe('recomendacao_produtos')}
                    onUpgrade={() => handleUpgrade('empresarial', 'Recomendação Produtos')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="previsao_demanda"
                    icon="bi bi-graph-up"
                    title="Previsão de Demanda"
                    description="IA que prevê vendas futuras para otimizar estoque"
                    price={179}
                    category="ia"
                    onSubscribe={() => handleSubscribe('previsao_demanda')}
                    onUpgrade={() => handleUpgrade('empresarial', 'Previsão de Demanda')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="analise_sentimento"
                    icon="bi bi-emoji-smile"
                    title="Análise de Sentimento"
                    description="IA que analisa feedback dos clientes automaticamente"
                    price={99}
                    category="ia"
                    onSubscribe={() => handleSubscribe('analise_sentimento')}
                    onUpgrade={() => handleUpgrade('empresarial', 'Análise de Sentimento')}
                  />
                </div>
              </div>
            </div>

            {/* CATEGORIA: INTEGRAÇÃO & DADOS */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-info mb-2">
                  <i className="bi bi-diagram-3 me-2"></i>Integração & Dados
                </h4>
                <p className="text-muted">Conecte sistemas externos e expanda capacidade de dados</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="integracao_balanca"
                    icon="bi bi-calculator"
                    title="Integração Balança Fiscal"
                    description="Conecta com balanças fiscais para pesagem automática"
                    price={59}
                    setupFee={149}
                    category="integracao"
                    onSubscribe={() => handleSubscribe('integracao_balanca')}
                    onUpgrade={() => handleUpgrade('profissional', 'Integração Balança Fiscal')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="api_externa"
                    icon="bi bi-plug"
                    title="API Externa"
                    description="Conecte com sistemas de terceiros via API customizada"
                    price={79}
                    category="integracao"
                    onSubscribe={() => handleSubscribe('api_externa')}
                    onUpgrade={() => handleUpgrade('empresarial', 'API Externa')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="armazenamento_extra"
                    icon="bi bi-hdd-stack"
                    title="Armazenamento Extra"
                    description="Capacidade adicional para dados e relatórios históricos"
                    price={39}
                    category="dados"
                    onSubscribe={() => handleSubscribe('armazenamento_extra')}
                    onUpgrade={() => handleUpgrade('basico', 'Armazenamento Extra')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="backup_avancado"
                    icon="bi bi-shield-check"
                    title="Backup Avançado"
                    description="Backup redundante com restauração em até 15 minutos"
                    price={69}
                    category="dados"
                    onSubscribe={() => handleSubscribe('backup_avancado')}
                    onUpgrade={() => handleUpgrade('profissional', 'Backup Avançado')}
                  />
                </div>
              </div>
            </div>

            {/* CATEGORIA: RELATÓRIOS & BI */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-danger mb-2">
                  <i className="bi bi-bar-chart me-2"></i>Relatórios & BI
                </h4>
                <p className="text-muted">Análises avançadas e business intelligence</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="relatorio_avancado"
                    icon="bi bi-file-earmark-bar-graph"
                    title="Relatório Avançado"
                    description="Relatórios personalizados com métricas específicas do negócio"
                    price={99}
                    category="relatorios"
                    onSubscribe={() => handleSubscribe('relatorio_avancado')}
                    onUpgrade={() => handleUpgrade('profissional', 'Relatório Avançado')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="bi_personalizado"
                    icon="bi bi-graph-up-arrow"
                    title="BI Personalizado"
                    description="Dashboard customizado com KPIs específicos da empresa"
                    price={199}
                    category="relatorios"
                    onSubscribe={() => handleSubscribe('bi_personalizado')}
                    onUpgrade={() => handleUpgrade('empresarial', 'BI Personalizado')}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <AddOnCard
                    addOnId="exportacao_dados"
                    icon="bi bi-download"
                    title="Exportação de Dados"
                    description="Exportar dados para Excel, CSV e outros formatos"
                    price={29}
                    category="relatorios"
                    onSubscribe={() => handleSubscribe('exportacao_dados')}
                    onUpgrade={() => handleUpgrade('basico', 'Exportação de Dados')}
                  />
                </div>
              </div>
            </div>

            {/* Modal de Upgrade */}
            <UpgradeModal
              show={showUpgradeModal}
              onHide={() => setShowUpgradeModal(false)}
              targetPlan={selectedUpgradePlan}
              addOnName={selectedAddOnName}
            />

            {/* Seção de Informações */}
            <div className="row justify-content-center mt-5">
              <div className="col-lg-10">
                <div className="card bg-light border-0">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-center mb-3">
                      <i className="bi bi-info-circle me-2"></i>Informações Importantes
                    </h6>
                    <div className="row text-start">
                      <div className="col-md-6">
                        <small>
                          <strong>🔧 Setup Único:</strong> Integração Balança Fiscal cobra R$ 149 apenas uma vez<br/>
                          <strong>📱 WhatsApp:</strong> Taxas da Meta/WhatsApp não inclusas nos planos IA<br/>
                          <strong>📡 Rastreador M2M:</strong> Chip de dados da operadora não incluso
                        </small>
                      </div>
                      <div className="col-md-6">
                        <small>
                          <strong>⚡ IoT Hardware:</strong> Equipamentos físicos vendidos separadamente<br/>
                          <strong>🔒 Dados:</strong> Retenção padrão é 30 dias, addons estendem período<br/>
                          <strong>🎯 Personalização:</strong> BI Personalizado inclui consultoria técnica
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
