import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Branch } from '../types';
import { useAuth } from './AuthContext';

interface BranchContextType {
  branches: Branch[];
  selectedBranchId: number;
  selectedBranch: Branch | null;
  setSelectedBranchId: (id: number) => void;
  isLoading: boolean;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchIdState] = useState<number>(() => {
    const saved = localStorage.getItem('restaurantiq_branch_id');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBranches = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const restId = user?.restaurant_id || 1;
      const resp = await apiClient.get<Branch[]>(`/restaurants/${restId}/branches`);
      setBranches(resp.data);
      if (resp.data.length > 0) {
        // If current selectedBranchId not in branches, select first
        const exists = resp.data.some((b) => b.id === selectedBranchId);
        if (!exists) {
          setSelectedBranchIdState(resp.data[0].id);
          localStorage.setItem('restaurantiq_branch_id', resp.data[0].id.toString());
        }
      }
    } catch (e) {
      console.error('Failed to fetch branches:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBranches();
    }
  }, [isAuthenticated]);

  const setSelectedBranchId = (id: number) => {
    setSelectedBranchIdState(id);
    localStorage.setItem('restaurantiq_branch_id', id.toString());
  };

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || (branches.length > 0 ? branches[0] : null);

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedBranchId,
        selectedBranch,
        setSelectedBranchId,
        isLoading,
        refreshBranches: fetchBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
