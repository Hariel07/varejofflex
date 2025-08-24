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
              <div className="text-center pt-3" style={{ visibility: 'hidden' }}>
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow">
                  placeholder
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-3 pb-3">
                <h4 className="fw-bold text-primary mb-3">Básico</h4>
                <div className="price-display mb-2">
                  <span className="h2 fw-bold text-dark">R$ 99</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 75/mês anual</strong> (25% desconto)
                </div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 150 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>1 usuário</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PDV básico</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Relatórios essenciais</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte por email</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>14 dias grátis</strong></li>
                  <li className="mb-2"><i className="bi bi-robot text-info me-2"></i><strong>IA de Suporte:</strong> chat de suporte ao cliente (site/WhatsApp*), até 1.000 interações/mês</li>
                  <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i><strong>Sem IoT</strong></li>
                </ul>
                <div className="mt-auto p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Ideal para:</strong> Pequenos negócios<br/>
                    <span className="text-warning">*taxas do provedor WhatsApp/Meta não inclusas</span>
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=basico" className="btn btn-outline-primary w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Plano Profissional */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
                backdropFilter: 'blur(15px)',
                border: '3px solid rgba(13, 110, 253, 0.5)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '750px',
                display: 'flex',
                flexDirection: 'column',
                transform: 'scale(1.05)',
                zIndex: 2
              }}
            >
              <div className="text-center pt-3">
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow">
                  <i className="bi bi-star-fill me-1"></i>Mais Popular
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-3 pb-3">
                <h4 className="fw-bold text-primary mb-3">Profissional</h4>
                <div className="price-display mb-2">
                  <span className="h2 fw-bold text-dark">R$ 199</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 149/mês anual</strong> (25% desconto)
                </div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 2.000 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>5 usuários</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PDV completo</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Relatórios avançados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Gestão de estoque</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte prioritário</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>14 dias grátis</strong></li>
                  <li className="mb-2"><i className="bi bi-robot text-info me-2"></i><strong>IA Avançada:</strong> Suporte até 5.000 interações/mês + Copiloto do ADM (1 assento)</li>
                  <li className="mb-2"><i className="bi bi-broadcast text-primary me-2"></i><strong>IoT Essencial:</strong> cadastro via QR/NFC + Inventário PWA, 1 gateway BLE + 50 tags BLE, 1 balança não-fiscal</li>
                </ul>
                <div className="mt-auto p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Ideal para:</strong> Empresas em crescimento
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
                background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(25, 135, 84, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '750px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="text-center pt-3" style={{ visibility: 'hidden' }}>
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow">
                  placeholder
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-3 pb-3">
                <h4 className="fw-bold text-success mb-3">Empresarial</h4>
                <div className="price-display mb-2">
                  <span className="h2 fw-bold text-dark">R$ 399</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 299/mês anual</strong> (25% desconto)
                </div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 10.000 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Usuários ilimitados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Multi-loja</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>BI & Analytics</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>API completa</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte 24/7</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>14 dias grátis</strong></li>
                  <li className="mb-2"><i className="bi bi-robot text-info me-2"></i><strong>IA Premium:</strong> Suporte até 50.000 interações/mês, multi-canais, Copiloto ADM até 10 assentos</li>
                  <li className="mb-2"><i className="bi bi-broadcast text-primary me-2"></i><strong>IoT Avançado:</strong> tudo do Profissional + Rastreamento BLE antifurto (até 5 gateways + 500 tags), Logística M2M (2 trackers), Integração com balanças fiscais (EAN/GS1), Alertas avançados</li>
                </ul>
                <div className="mt-auto p-3 bg-light rounded">
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
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-display fs-3 text-primary mb-2"></i>
                      <h6 className="fw-bold mb-2">PDV Extra</h6>
                      <p className="small text-muted mb-2">Terminal de vendas adicional para atender mais clientes simultaneamente ou ter backup em caso de falha</p>
                      <span className="badge bg-primary mb-2">R$ 29/mês</span>
                      <div className="text-muted small">Por terminal adicional</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-tv fs-3 text-info mb-2"></i>
                      <h6 className="fw-bold mb-2">KDS - Display de Cozinha</h6>
                      <p className="small text-muted mb-2">Tela exclusiva para a cozinha visualizar pedidos em tempo real, otimizando o fluxo de preparo</p>
                      <span className="badge bg-info mb-2">R$ 19/mês</span>
                      <div className="text-muted small">Por display adicional</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-truck fs-3 text-warning mb-2"></i>
                      <h6 className="fw-bold mb-2">Delivery Pro</h6>
                      <p className="small text-muted mb-2">Sistema avançado de gestão de entregas com rastreamento GPS, otimização de rotas e notificações automáticas</p>
                      <span className="badge bg-warning mb-2">R$ 39/mês</span>
                      <div className="text-muted small">Funcionalidades completas</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-shop fs-3 text-success mb-2"></i>
                      <h6 className="fw-bold mb-2">Loja Extra</h6>
                      <p className="small text-muted mb-2">Adicione uma filial ao seu sistema com estoque independente e relatórios consolidados</p>
                      <span className="badge bg-success mb-2">R$ 59/mês</span>
                      <div className="text-muted small">Por filial adicional</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIA: IOT & AUTOMAÇÃO */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-primary mb-2">
                  <i className="bi bi-broadcast me-2"></i>IoT & Automação
                </h4>
                <p className="text-muted">Tecnologias inteligentes para monitoramento e automação do seu negócio</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-broadcast fs-3 text-primary mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Gateway BLE Extra</h6>
                      <p className="small text-muted mb-2">Hub adicional para expandir cobertura Bluetooth e conectar mais dispositivos IoT</p>
                      <span className="badge bg-primary mb-1">R$ 39/mês</span>
                      <div className="text-muted small">Por gateway</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-tags fs-3 text-info mb-2"></i>
                      <h6 className="fw-bold mb-2 small">+100 Tags BLE</h6>
                      <p className="small text-muted mb-2">Etiquetas inteligentes para rastrear produtos, detectar movimento e prevenir furtos</p>
                      <span className="badge bg-info mb-1">R$ 19/mês</span>
                      <div className="text-muted small">Pacote c/ 100 unidades</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-thermometer fs-3 text-warning mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Sensor Temp/Umid</h6>
                      <p className="small text-muted mb-2">Monitor ambiental para geladeiras, freezers e ambientes que precisam controle de temperatura</p>
                      <span className="badge bg-warning mb-1">R$ 10/mês</span>
                      <div className="text-muted small">Por sensor</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-speedometer2 fs-3 text-success mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Balança Não-Fiscal</h6>
                      <p className="small text-muted mb-2">Balança inteligente para pesagem automática com integração ao sistema de vendas</p>
                      <span className="badge bg-success mb-1">R$ 15/mês</span>
                      <div className="text-muted small">Por balança</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-calculator fs-3 text-primary mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Balança Fiscal</h6>
                      <p className="small text-muted mb-2">Integração com balanças fiscais existentes para leitura automática de códigos EAN-13 e GS1</p>
                      <span className="badge bg-primary mb-1">R$ 39/mês</span>
                      <div className="text-muted small">+ setup R$ 149</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-geo-alt fs-3 text-info mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Rastreador M2M</h6>
                      <p className="small text-muted mb-2">GPS para veículos de entrega com monitoramento em tempo real e histórico de rotas</p>
                      <span className="badge bg-info mb-1">R$ 35/mês</span>
                      <div className="text-muted small">Chip não incluso</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIA: INTELIGÊNCIA ARTIFICIAL */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-primary mb-2">
                  <i className="bi bi-robot me-2"></i>Inteligência Artificial
                </h4>
                <p className="text-muted">Recursos de IA para automação de atendimento e insights inteligentes</p>
              </div>
              <div className="row g-3 justify-content-center">
                <div className="col-lg-3 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-chat-dots fs-3 text-warning mb-2"></i>
                      <h6 className="fw-bold mb-2">Canal IA Extra</h6>
                      <p className="small text-muted mb-2">Adicione atendimento IA em novos canais como Telegram, Instagram ou sistemas próprios</p>
                      <span className="badge bg-warning mb-2">R$ 29/mês</span>
                      <div className="text-muted small">Por canal adicional</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-robot fs-3 text-success mb-2"></i>
                      <h6 className="fw-bold mb-2">+1.000 Interações IA</h6>
                      <p className="small text-muted mb-2">Expanda o limite de conversas da IA para atender mais clientes sem interrupções</p>
                      <span className="badge bg-success mb-2">R$ 49/mês</span>
                      <div className="text-muted small">Pacote c/ 1.000 extras</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-person-gear fs-3 text-primary mb-2"></i>
                      <h6 className="fw-bold mb-2">Assento Copiloto ADM</h6>
                      <p className="small text-muted mb-2">IA administrativa que ajuda com relatórios, análises e tomada de decisões estratégicas</p>
                      <span className="badge bg-primary mb-2">R$ 39/mês</span>
                      <div className="text-muted small">Por usuário adicional</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIA: DADOS & INTEGRAÇÕES */}
            <div className="mb-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-primary mb-2">
                  <i className="bi bi-database me-2"></i>Dados & Integrações
                </h4>
                <p className="text-muted">Backup, retenção de dados e conectividade com sistemas externos</p>
              </div>
              <div className="row g-3">
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-archive fs-3 text-info mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Retenção 180 dias</h6>
                      <p className="small text-muted mb-2">Armazene dados de telemetria IoT por 6 meses para análises históricas detalhadas</p>
                      <span className="badge bg-info mb-1">R$ 29/mês</span>
                      <div className="text-muted small">Telemetria estendida</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-archive-fill fs-3 text-warning mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Retenção 365 dias</h6>
                      <p className="small text-muted mb-2">Arquivo completo de 1 ano para compliance, auditoria e análises sazonais</p>
                      <span className="badge bg-warning mb-1">R$ 79/mês</span>
                      <div className="text-muted small">Arquivo anual completo</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-link-45deg fs-3 text-success mb-2"></i>
                      <h6 className="fw-bold mb-2 small">API/ERP Connector</h6>
                      <p className="small text-muted mb-2">Conecte com seu ERP, sistema contábil ou qualquer software de gestão existente</p>
                      <span className="badge bg-success mb-1">R$ 99/mês</span>
                      <div className="text-muted small">Por integração</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-bell fs-3 text-primary mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Webhooks Premium</h6>
                      <p className="small text-muted mb-2">Notificações automáticas para sistemas externos em tempo real com retry inteligente</p>
                      <span className="badge bg-primary mb-1">R$ 29/mês</span>
                      <div className="text-muted small">Notificações avançadas</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-cloud-download fs-3 text-info mb-2"></i>
                      <h6 className="fw-bold mb-2 small">Backup Automático</h6>
                      <p className="small text-muted mb-2">Backup diário automatizado com export para planilhas e recuperação de emergência</p>
                      <span className="badge bg-info mb-1">R$ 19/mês</span>
                      <div className="text-muted small">Proteção total</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-graph-up-arrow fs-3 text-success mb-2"></i>
                      <h6 className="fw-bold mb-2 small">BI Personalizado</h6>
                      <p className="small text-muted mb-2">Dashboards customizados com métricas específicas do seu negócio e relatórios sob medida</p>
                      <span className="badge bg-success mb-1">R$ 149/mês</span>
                      <div className="text-muted small">Análises exclusivas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIA: SUPORTE & SERVIÇOS */}
            <div className="mb-4">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-primary mb-2">
                  <i className="bi bi-headset me-2"></i>Suporte & Serviços
                </h4>
                <p className="text-muted">Upgrades de atendimento e suporte técnico especializado</p>
              </div>
              <div className="row g-3 justify-content-center">
                <div className="col-lg-4 col-md-6">
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <i className="bi bi-headset fs-3 text-warning mb-2"></i>
                      <h6 className="fw-bold mb-2">SLA 24/7 Premium</h6>
                      <p className="small text-muted mb-2">Upgrade para suporte 24/7 nos planos Básico e Profissional com SLA de resposta garantido</p>
                      <span className="badge bg-warning mb-2">R$ 99/mês</span>
                      <div className="text-muted small">Para Básico e Profissional</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota sobre configurações */}
            <div className="row justify-content-center mt-4">
              <div className="col-lg-10">
                <div className="alert alert-info text-center">
                  <h6 className="fw-bold mb-2">
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
    </section>
  )
}
