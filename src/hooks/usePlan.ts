"use client";

import { useState, useEffect } from 'react';
import { PlanType } from '@/lib/planMatrix';

// Hook para gerenciar plano do usuário
export function useUserPlan() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('profissional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carregamento do plano do usuário
  // Em produção, isso faria uma requisição para API
  useEffect(() => {
    const loadUserPlan = async () => {
      setLoading(true);
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Por enquanto, retorna um plano fixo
        // Em produção, viria da sessão/API
        setCurrentPlan('profissional');
      } catch (err) {
        setError('Erro ao carregar plano do usuário');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserPlan();
  }, []);

  const upgradePlan = async (newPlan: PlanType) => {
    setLoading(true);
    try {
      // Simular upgrade de plano
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPlan(newPlan);
    } catch (err) {
      setError('Erro ao fazer upgrade do plano');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentPlan,
    loading,
    error,
    upgradePlan
  };
}

// Hook para gerenciar uso de add-ons
export function useAddOnUsage(addOnId: string) {
  const [usage, setUsage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAddOnUsage = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/addons?addOnId=${addOnId}`);
        
        if (!response.ok) {
          throw new Error('Erro ao carregar informações do add-on');
        }
        
        const data = await response.json();
        setUsage(data.usage || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao carregar uso do add-on:', err);
      } finally {
        setLoading(false);
      }
    };

    if (addOnId) {
      loadAddOnUsage();
    }
  }, [addOnId]);

  const subscribeAddOn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/addons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addOnId,
          action: 'subscribe'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao contratar add-on');
      }

      if (data.success) {
        setUsage(data.newUsage);
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Falha ao contratar add-on');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeAddOn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/addons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addOnId,
          action: 'unsubscribe'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cancelar add-on');
      }

      if (data.success) {
        setUsage(data.newUsage);
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Falha ao cancelar add-on');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    usage,
    loading,
    error,
    subscribeAddOn,
    unsubscribeAddOn
  };
}

// Hook para validar disponibilidade de add-ons
export function useAddOnAvailability() {
  const [allAddOns, setAllAddOns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAddOnAvailability = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/addons');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar disponibilidade de add-ons');
        }
        
        const data = await response.json();
        setAllAddOns(data.addOns || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao carregar add-ons:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAddOnAvailability();
  }, []);

  const getAddOnInfo = (addOnId: string) => {
    return allAddOns.find(addon => 
      addon.addOnId === addOnId || 
      addon.addOnId.replace('-', '_') === addOnId ||
      addon.addOnId.replace('_', '-') === addOnId
    );
  };

  return {
    allAddOns,
    loading,
    error,
    getAddOnInfo
  };
}