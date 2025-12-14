import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c5964f01`;
const USER_ID = "demo-user";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  icon?: string;
  template?: string;
  locked?: boolean;
  penaltyRate?: number;
  boostRate?: number;
  createdAt: string;
}

interface Group {
  id: string;
  name: string;
  members: number;
  balance: number;
  nextPayout: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  role: string;
  balance: number;
  employees: number;
  pendingApprovals: number;
  createdAt: string;
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      "X-User-Id": USER_ID,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

export function useKolaWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize demo data on first load
  useEffect(() => {
    const initDemo = async () => {
      try {
        await apiFetch("/init-demo", { method: "POST" });
      } catch (error) {
        console.error("Error initializing demo:", error);
      }
    };
    initDemo();
  }, []);

  // Calculate balance from transactions
  const calculateBalance = (txs: Transaction[]): number => {
    return txs.reduce((acc, tx) => {
      if (tx.type === "sent") {
        return acc - tx.amount - 0.5; // Transaction fee
      } else if (tx.type === "received") {
        return acc + tx.amount;
      }
      return acc;
    }, 5000); // Starting balance
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceRes, txRes, goalsRes, groupsRes, orgsRes] =
        await Promise.all([
          apiFetch("/balance"),
          apiFetch("/transactions"),
          apiFetch("/savings-goals"),
          apiFetch("/groups"),
          apiFetch("/organizations"),
        ]);

      setTransactions(txRes.transactions);
      // Recalculate balance from transactions to ensure accuracy
      const calculatedBalance = calculateBalance(txRes.transactions);
      setBalance(calculatedBalance);
      setSavingsGoals(goalsRes.goals);
      setGroups(groupsRes.groups);
      setOrganizations(orgsRes.organizations);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait a bit for demo init
    setTimeout(fetchData, 500);
  }, []);

  // Create transaction
  const createTransaction = async (
    type: "sent" | "received",
    recipient: string,
    amount: number,
    method: string
  ) => {
    try {
      // Optimistic update
      const optimisticBalance =
        type === "sent" ? balance - amount - 0.5 : balance + amount;
      setBalance(optimisticBalance);

      const result = await apiFetch("/transaction", {
        method: "POST",
        body: JSON.stringify({ type, recipient, amount, method }),
      });

      // Fetch fresh data and recalculate balance from transactions
      await fetchData();

      return result;
    } catch (error) {
      console.error("Error creating transaction:", error);
      // Revert optimistic update and refresh
      await fetchData();
      throw error;
    }
  };

  // Create savings goal
  type CreateGoalInput = {
    name: string;
    target: number;
    color: string;
    icon?: string;
    template?: string;
    locked?: boolean;
    penaltyRate?: number;
    boostRate?: number;
  };

  const createSavingsGoal = async (input: CreateGoalInput) => {
    try {
      const result = await apiFetch("/savings-goal", {
        method: "POST",
        body: JSON.stringify({ ...input, current: 0 }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error creating savings goal:", error);
      throw error;
    }
  };

  // Update savings goal
  const updateSavingsGoal = async (
    id: string,
    updates: Partial<SavingsGoal>
  ) => {
    try {
      const result = await apiFetch(`/savings-goal/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error updating savings goal:", error);
      throw error;
    }
  };

  // Deposit to savings goal
  const depositToSavings = async (goalId: string, amount: number) => {
    try {
      const result = await apiFetch(`/savings-goal/${goalId}/deposit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error depositing to savings:", error);
      throw error;
    }
  };

  // Withdraw from savings goal
  const withdrawFromSavings = async (goalId: string, amount: number) => {
    try {
      const result = await apiFetch(`/savings-goal/${goalId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error withdrawing from savings:", error);
      throw error;
    }
  };

  // Emergency withdraw with penalty (for locked goals)
  const emergencyWithdrawFromSavings = async (
    goalId: string,
    amount: number
  ) => {
    try {
      const result = await apiFetch(
        `/savings-goal/${goalId}/emergency-withdraw`,
        {
          method: "POST",
          body: JSON.stringify({ amount }),
        }
      );

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error in emergency withdrawal:", error);
      throw error;
    }
  };

  // Deposit to group
  const depositToGroup = async (groupId: string, amount: number) => {
    try {
      const result = await apiFetch(`/group/${groupId}/deposit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error depositing to group:", error);
      throw error;
    }
  };

  // Withdraw from group
  const withdrawFromGroup = async (groupId: string, amount: number) => {
    try {
      const result = await apiFetch(`/group/${groupId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error withdrawing from group:", error);
      throw error;
    }
  };

  // Deposit to organization
  const depositToOrganization = async (orgId: string, amount: number) => {
    try {
      const result = await apiFetch(`/organization/${orgId}/deposit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error depositing to organization:", error);
      throw error;
    }
  };

  // Withdraw from organization
  const withdrawFromOrganization = async (orgId: string, amount: number) => {
    try {
      const result = await apiFetch(`/organization/${orgId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error withdrawing from organization:", error);
      throw error;
    }
  };

  // Create organization
  const createOrganization = async (data: {
    name: string;
    description?: string;
    category?: string;
  }) => {
    try {
      const result = await apiFetch("/organization", {
        method: "POST",
        body: JSON.stringify(data),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  };

  // Create group
  const createGroup = async (data: {
    name: string;
    description?: string;
    isOrganizationGroup?: boolean;
  }) => {
    try {
      const result = await apiFetch("/group", {
        method: "POST",
        body: JSON.stringify(data),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  // Add collector to group
  const addCollector = async (
    groupId: string,
    data: {
      name: string;
      email: string;
      role: string;
    }
  ) => {
    try {
      const result = await apiFetch(`/group/${groupId}/collector`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error adding collector:", error);
      throw error;
    }
  };

  // Remove collector from group
  const removeCollector = async (groupId: string, collectorId: string) => {
    try {
      const result = await apiFetch(
        `/group/${groupId}/collector/${collectorId}`,
        {
          method: "DELETE",
        }
      );

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error removing collector:", error);
      throw error;
    }
  };

  // Register manual collection (collector action)
  const registerCollection = async (
    groupId: string,
    collectorId: string,
    data: {
      amount: number;
      description?: string;
      collectionDate?: string;
    }
  ) => {
    try {
      const result = await apiFetch(`/group/${groupId}/collection`, {
        method: "POST",
        body: JSON.stringify({
          collectorId,
          ...data,
        }),
      });

      await fetchData();
      return result;
    } catch (error) {
      console.error("Error registering collection:", error);
      throw error;
    }
  };

  return {
    balance,
    transactions,
    savingsGoals,
    groups,
    organizations,
    loading,
    createTransaction,
    createSavingsGoal,
    updateSavingsGoal,
    depositToSavings,
    withdrawFromSavings,
    emergencyWithdrawFromSavings,
    depositToGroup,
    withdrawFromGroup,
    depositToOrganization,
    withdrawFromOrganization,
    createOrganization,
    createGroup,
    addCollector,
    removeCollector,
    registerCollection,
    refreshData: fetchData,
  };
}
