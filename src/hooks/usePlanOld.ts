import { useState, useEffect } from 'react';
import { PlanType } from '@/lib/planMatrix';

// Hook para gerenciar o plano do usuário
export function useUserPlan() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('basico');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar plano do usuário da API/session
    // Por enquanto, vamos simular
    const fetchUserPlan = async () => {
      try {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Por enquanto, retornar 'profissional' como padrão
        // Em produção, isso viria da sessão/API
        setCurrentPlan('profissional');
      } catch (error) {
        console.error('Erro ao buscar plano do usuário:', error);
        setCurrentPlan('basico'); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  return { currentPlan, loading, setCurrentPlan };
}

// Hook para buscar uso atual de add-ons
export function useAddOnUsage(addOnId: string) {
  const [usage, setUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        // TODO: Buscar uso atual da API
        // Por enquanto, vamos simular alguns valores
        const mockUsage: Record<string, number> = {
          'gateway-ble-extra': 1,
          'tags-ble-100': 2,
          'sensor-temp-umid': 3,
          'balanca-nao-fiscal': 1,
          'copiloto-adm-extra': 1,
        };
        
        await new Promise(resolve => setTimeout(resolve, 100));
        setUsage(mockUsage[addOnId] || 0);
      } catch (error) {
        console.error('Erro ao buscar uso do add-on:', error);
        setUsage(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [addOnId]);

  return { usage, loading };
}