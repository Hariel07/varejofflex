import { useState, useEffect } from 'react';
import { IPlan } from '@/models/Plan';

interface UsePlansReturn {
  plans: IPlan[];
  loading: boolean;
  error: string | null;
  refreshPlans: () => Promise<void>;
  getPlanById: (planId: string) => IPlan | null;
  getActivePlans: () => IPlan[];
  getPopularPlan: () => IPlan | null;
}

export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/plans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar planos');
      }

      const data = await response.json();
      
      if (data.success) {
        setPlans(data.plans || []);
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar planos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const refreshPlans = async () => {
    await fetchPlans();
  };

  const getPlanById = (planId: string): IPlan | null => {
    return plans.find(plan => plan.planId === planId) || null;
  };

  const getActivePlans = (): IPlan[] => {
    return plans.filter(plan => plan.enabled);
  };

  const getPopularPlan = (): IPlan | null => {
    return plans.find(plan => plan.popular && plan.enabled) || null;
  };

  return {
    plans,
    loading,
    error,
    refreshPlans,
    getPlanById,
    getActivePlans,
    getPopularPlan
  };
}

// Hook para gerenciamento de planos (apenas para owners)
interface UsePlansManagerReturn extends UsePlansReturn {
  savePlan: (planData: Partial<IPlan>) => Promise<boolean>;
  deletePlan: (planId: string) => Promise<boolean>;
  initializePlans: (force?: boolean) => Promise<boolean>;
  saving: boolean;
}

export function usePlansManager(): UsePlansManagerReturn {
  const plansHook = usePlans();
  const [saving, setSaving] = useState(false);

  const savePlan = async (planData: Partial<IPlan>): Promise<boolean> => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      const data = await response.json();
      
      if (data.success) {
        await plansHook.refreshPlans();
        return true;
      } else {
        throw new Error(data.error || 'Erro ao salvar plano');
      }
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (planId: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/plans?planId=${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await plansHook.refreshPlans();
        return true;
      } else {
        throw new Error(data.error || 'Erro ao deletar plano');
      }
    } catch (err) {
      console.error('Erro ao deletar plano:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const initializePlans = async (force: boolean = false): Promise<boolean> => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/plans/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });

      const data = await response.json();
      
      if (data.success) {
        await plansHook.refreshPlans();
        return true;
      } else {
        throw new Error(data.error || 'Erro ao inicializar planos');
      }
    } catch (err) {
      console.error('Erro ao inicializar planos:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    ...plansHook,
    savePlan,
    deletePlan,
    initializePlans,
    saving
  };
}