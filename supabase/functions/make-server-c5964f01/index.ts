import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Initialize user data if not exists
async function initializeUser(userId: string) {
  const balance = await kv.get(`balance:${userId}`);
  if (!balance) {
    await kv.set(`balance:${userId}`, "2847.50");
  }
}

// Get user balance
app.get("/make-server-c5964f01/balance", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    await initializeUser(userId);

    const balance = await kv.get(`balance:${userId}`);
    return c.json({ balance: parseFloat(balance || "0") });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return c.json({ error: "Failed to fetch balance" }, 500);
  }
});

// Get transactions
app.get("/make-server-c5964f01/transactions", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const transactions = await kv.getByPrefix(`transaction:${userId}:`);

    const parsed = transactions
      .map((t) => JSON.parse(t))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return c.json({ transactions: parsed });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
});

// Create transaction
app.post("/make-server-c5964f01/transaction", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const body = await c.req.json();
    const { type, recipient, amount, method } = body;

    if (!type || !recipient || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get current balance
    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );

    // Calculate new balance
    let newBalance = currentBalance;
    if (type === "sent") {
      newBalance = currentBalance - parseFloat(amount) - 0.5; // Including fee
      if (newBalance < 0) {
        return c.json({ error: "Insufficient balance" }, 400);
      }
    } else if (type === "received") {
      newBalance = currentBalance + parseFloat(amount);
    }

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      type,
      recipient,
      amount: parseFloat(amount),
      method: method || "MoMo",
      date: new Date().toISOString(),
      status: "completed",
    };

    // Save transaction and update balance
    await kv.set(
      `transaction:${userId}:${transaction.id}`,
      JSON.stringify(transaction)
    );
    await kv.set(`balance:${userId}`, newBalance.toString());

    return c.json({
      transaction,
      balance: newBalance,
      success: true,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return c.json({ error: "Failed to create transaction" }, 500);
  }
});

// Get savings goals
app.get("/make-server-c5964f01/savings-goals", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const goals = await kv.getByPrefix(`goal:${userId}:`);

    const parsed = goals.map((g) => JSON.parse(g));
    return c.json({ goals: parsed });
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    return c.json({ error: "Failed to fetch savings goals" }, 500);
  }
});

// Create savings goal
app.post("/make-server-c5964f01/savings-goal", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const body = await c.req.json();
    const {
      name,
      target,
      current,
      color,
      icon,
      template,
      locked,
      penaltyRate,
      boostRate,
    } = body;

    if (!name || !target) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const safePenalty = Math.min(
      Math.max(parseFloat(penaltyRate || 0.02), 0),
      0.1
    );
    const safeBoost = Math.min(Math.max(parseFloat(boostRate || 0), 0), 0.05);

    const goal = {
      id: Date.now().toString(),
      name,
      target: parseFloat(target),
      current: parseFloat(current || "0"),
      color: color || "emerald",
      icon: icon || "🌱",
      template: template || "custom",
      locked: Boolean(locked),
      penaltyRate: safePenalty,
      boostRate: safeBoost,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`goal:${userId}:${goal.id}`, JSON.stringify(goal));

    return c.json({ goal, success: true });
  } catch (error) {
    console.error("Error creating savings goal:", error);
    return c.json({ error: "Failed to create savings goal" }, 500);
  }
});

// Update savings goal
app.put("/make-server-c5964f01/savings-goal/:id", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const goalId = c.req.param("id");
    const body = await c.req.json();

    const goalKey = `goal:${userId}:${goalId}`;
    const existingGoal = await kv.get(goalKey);

    if (!existingGoal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    const goal = JSON.parse(existingGoal);

    const updatedGoal = {
      ...goal,
      ...body,
    };

    if (body.penaltyRate !== undefined) {
      const safePenalty = Math.min(
        Math.max(parseFloat(body.penaltyRate), 0),
        0.1
      );
      updatedGoal.penaltyRate = safePenalty;
    }

    if (body.boostRate !== undefined) {
      const safeBoost = Math.min(Math.max(parseFloat(body.boostRate), 0), 0.05);
      updatedGoal.boostRate = safeBoost;
    }

    if (body.locked !== undefined) {
      updatedGoal.locked = Boolean(body.locked);
    }

    await kv.set(goalKey, JSON.stringify(updatedGoal));

    return c.json({ goal: updatedGoal, success: true });
  } catch (error) {
    console.error("Error updating savings goal:", error);
    return c.json({ error: "Failed to update savings goal" }, 500);
  }
});

// Deposit to savings goal
app.post("/make-server-c5964f01/savings-goal/:id/deposit", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const goalId = c.req.param("id");
    const { amount } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );
    if (currentBalance < amount) {
      return c.json({ error: "Insufficient balance" }, 400);
    }

    const goalKey = `goal:${userId}:${goalId}`;
    const existingGoal = await kv.get(goalKey);
    if (!existingGoal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    const goal = JSON.parse(existingGoal);
    goal.current += parseFloat(amount);

    await kv.set(
      `balance:${userId}`,
      (currentBalance - parseFloat(amount)).toString()
    );
    await kv.set(goalKey, JSON.stringify(goal));

    return c.json({
      goal,
      balance: currentBalance - parseFloat(amount),
      success: true,
    });
  } catch (error) {
    console.error("Error depositing to savings goal:", error);
    return c.json({ error: "Failed to deposit" }, 500);
  }
});

// Withdraw from savings goal
app.post("/make-server-c5964f01/savings-goal/:id/withdraw", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const goalId = c.req.param("id");
    const { amount } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const goalKey = `goal:${userId}:${goalId}`;
    const existingGoal = await kv.get(goalKey);
    if (!existingGoal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    const goal = JSON.parse(existingGoal);

    if (goal.locked) {
      return c.json(
        { error: "Goal is locked. Use emergency withdrawal." },
        400
      );
    }

    if (goal.current < amount) {
      return c.json({ error: "Insufficient funds in savings goal" }, 400);
    }

    goal.current -= parseFloat(amount);

    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );
    await kv.set(
      `balance:${userId}`,
      (currentBalance + parseFloat(amount)).toString()
    );
    await kv.set(goalKey, JSON.stringify(goal));

    return c.json({
      goal,
      balance: currentBalance + parseFloat(amount),
      success: true,
    });
  } catch (error) {
    console.error("Error withdrawing from savings goal:", error);
    return c.json({ error: "Failed to withdraw" }, 500);
  }
});

// Emergency withdraw from savings goal with penalty (for locked goals)
app.post(
  "/make-server-c5964f01/savings-goal/:id/emergency-withdraw",
  async (c) => {
    try {
      const userId = c.req.header("X-User-Id") || "demo-user";
      const goalId = c.req.param("id");
      const { amount } = await c.req.json();

      if (!amount || amount <= 0) {
        return c.json({ error: "Invalid amount" }, 400);
      }

      const goalKey = `goal:${userId}:${goalId}`;
      const existingGoal = await kv.get(goalKey);
      if (!existingGoal) {
        return c.json({ error: "Goal not found" }, 404);
      }

      const goal = JSON.parse(existingGoal);

      if (!goal.locked) {
        return c.json(
          { error: "Goal is not locked. Use standard withdrawal." },
          400
        );
      }

      if (goal.current < amount) {
        return c.json({ error: "Insufficient funds in savings goal" }, 400);
      }

      const penaltyRate = Math.min(Math.max(goal.penaltyRate || 0.02, 0), 0.1);
      const penalty = parseFloat(amount) * penaltyRate;
      const payout = Math.max(parseFloat(amount) - penalty, 0);

      goal.current -= parseFloat(amount);

      const currentBalance = parseFloat(
        (await kv.get(`balance:${userId}`)) || "0"
      );
      const newBalance = currentBalance + payout;

      await kv.set(`balance:${userId}`, newBalance.toString());
      await kv.set(goalKey, JSON.stringify(goal));

      return c.json({
        goal,
        balance: newBalance,
        penalty: parseFloat(penalty.toFixed(2)),
        payout: parseFloat(payout.toFixed(2)),
        success: true,
        message: "Emergency withdrawal processed with penalty applied.",
      });
    } catch (error) {
      console.error("Error emergency withdrawing from savings goal:", error);
      return c.json({ error: "Failed to process emergency withdrawal" }, 500);
    }
  }
);

// Deposit to group
app.post("/make-server-c5964f01/group/:id/deposit", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const groupId = c.req.param("id");
    const { amount } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );
    if (currentBalance < amount) {
      return c.json({ error: "Insufficient balance" }, 400);
    }

    const groupKey = `group:${userId}:${groupId}`;
    const existingGroup = await kv.get(groupKey);
    if (!existingGroup) {
      return c.json({ error: "Group not found" }, 404);
    }

    const group = JSON.parse(existingGroup);
    group.balance += parseFloat(amount);

    await kv.set(
      `balance:${userId}`,
      (currentBalance - parseFloat(amount)).toString()
    );
    await kv.set(groupKey, JSON.stringify(group));

    return c.json({
      group,
      balance: currentBalance - parseFloat(amount),
      success: true,
    });
  } catch (error) {
    console.error("Error depositing to group:", error);
    return c.json({ error: "Failed to deposit" }, 500);
  }
});

// Withdraw from group
app.post("/make-server-c5964f01/group/:id/withdraw", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const groupId = c.req.param("id");
    const { amount } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const groupKey = `group:${userId}:${groupId}`;
    const existingGroup = await kv.get(groupKey);
    if (!existingGroup) {
      return c.json({ error: "Group not found" }, 404);
    }

    const group = JSON.parse(existingGroup);
    if (group.balance < amount) {
      return c.json({ error: "Insufficient funds in group" }, 400);
    }

    group.balance -= parseFloat(amount);

    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );
    await kv.set(
      `balance:${userId}`,
      (currentBalance + parseFloat(amount)).toString()
    );
    await kv.set(groupKey, JSON.stringify(group));

    return c.json({
      group,
      balance: currentBalance + parseFloat(amount),
      success: true,
    });
  } catch (error) {
    console.error("Error withdrawing from group:", error);
    return c.json({ error: "Failed to withdraw" }, 500);
  }
});

// Deposit to organization
app.post("/make-server-c5964f01/organization/:id/deposit", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const orgId = c.req.param("id");
    const { amount } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );
    if (currentBalance < amount) {
      return c.json({ error: "Insufficient balance" }, 400);
    }

    const orgKey = `org:${userId}:${orgId}`;
    const existingOrg = await kv.get(orgKey);
    if (!existingOrg) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const org = JSON.parse(existingOrg);
    org.balance += parseFloat(amount);

    await kv.set(
      `balance:${userId}`,
      (currentBalance - parseFloat(amount)).toString()
    );
    await kv.set(orgKey, JSON.stringify(org));

    return c.json({
      organization: org,
      balance: currentBalance - parseFloat(amount),
      success: true,
    });
  } catch (error) {
    console.error("Error depositing to organization:", error);
    return c.json({ error: "Failed to deposit" }, 500);
  }
});

// Withdraw from organization
app.post("/make-server-c5964f01/organization/:id/withdraw", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const orgId = c.req.param("id");
    const { amount } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const orgKey = `org:${userId}:${orgId}`;
    const existingOrg = await kv.get(orgKey);
    if (!existingOrg) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const org = JSON.parse(existingOrg);
    if (org.balance < amount) {
      return c.json({ error: "Insufficient funds in organization" }, 400);
    }

    org.balance -= parseFloat(amount);

    const currentBalance = parseFloat(
      (await kv.get(`balance:${userId}`)) || "0"
    );
    await kv.set(
      `balance:${userId}`,
      (currentBalance + parseFloat(amount)).toString()
    );
    await kv.set(orgKey, JSON.stringify(org));

    return c.json({
      organization: org,
      balance: currentBalance + parseFloat(amount),
      success: true,
    });
  } catch (error) {
    console.error("Error withdrawing from organization:", error);
    return c.json({ error: "Failed to withdraw" }, 500);
  }
});

// Get groups
app.get("/make-server-c5964f01/groups", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const groups = await kv.getByPrefix(`group:${userId}:`);

    const parsed = groups.map((g) => JSON.parse(g));
    return c.json({ groups: parsed });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return c.json({ error: "Failed to fetch groups" }, 500);
  }
});

// Get organizations
app.get("/make-server-c5964f01/organizations", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";
    const orgs = await kv.getByPrefix(`org:${userId}:`);

    const parsed = orgs.map((o) => JSON.parse(o));
    return c.json({ organizations: parsed });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return c.json({ error: "Failed to fetch organizations" }, 500);
  }
});

// Initialize demo data
app.post("/make-server-c5964f01/init-demo", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";

    // Set initial balance
    await kv.set(`balance:${userId}`, "2847.50");

    // Add demo transactions with realistic dates
    const now = Date.now();
    const demoTransactions = [
      {
        id: "1",
        type: "sent",
        recipient: "Sarah Johnson",
        amount: 45.0,
        date: new Date(now).toISOString(), // Just now
        method: "MoMo",
        status: "completed",
      },
      {
        id: "2",
        type: "received",
        recipient: "John Doe",
        amount: 120.5,
        date: new Date(now - 3600000).toISOString(), // 1 hour ago
        method: "Bank Transfer",
        status: "completed",
      },
      {
        id: "3",
        type: "sent",
        recipient: "Emma Wilson",
        amount: 67.2,
        date: new Date(now - 86400000).toISOString(), // 1 day ago
        method: "Orange Money",
        status: "completed",
      },
      {
        id: "4",
        type: "received",
        recipient: "Michael Brown",
        amount: 200.0,
        date: new Date(now - 172800000).toISOString(), // 2 days ago
        method: "MoMo",
        status: "completed",
      },
      {
        id: "5",
        type: "sent",
        recipient: "Lisa Chen",
        amount: 89.99,
        date: new Date(now - 259200000).toISOString(), // 3 days ago
        method: "Bank Transfer",
        status: "completed",
      },
    ];

    for (const tx of demoTransactions) {
      await kv.set(`transaction:${userId}:${tx.id}`, JSON.stringify(tx));
    }

    // Add demo savings goals
    const demoGoals = [
      {
        id: "1",
        name: "Emergency Fund",
        target: 5000,
        current: 3200,
        color: "emerald",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Vacation 2026",
        target: 3000,
        current: 1450,
        color: "blue",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "New Laptop",
        target: 1500,
        current: 890,
        color: "purple",
        createdAt: new Date().toISOString(),
      },
    ];

    for (const goal of demoGoals) {
      await kv.set(`goal:${userId}:${goal.id}`, JSON.stringify(goal));
    }

    // Add demo groups
    const demoGroups = [
      {
        id: "1",
        name: "Family Tontine",
        members: 8,
        balance: 12400,
        nextPayout: "Dec 20",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Friends Circle",
        members: 5,
        balance: 6750,
        nextPayout: "Dec 28",
        createdAt: new Date().toISOString(),
      },
    ];

    for (const group of demoGroups) {
      await kv.set(`group:${userId}:${group.id}`, JSON.stringify(group));
    }

    // Add demo organization
    const demoOrg = {
      id: "1",
      name: "Acme Corp",
      role: "Manager",
      balance: 45600,
      employees: 12,
      pendingApprovals: 3,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`org:${userId}:${demoOrg.id}`, JSON.stringify(demoOrg));

    return c.json({ success: true, message: "Demo data initialized" });
  } catch (error) {
    console.error("Error initializing demo data:", error);
    return c.json({ error: "Failed to initialize demo data" }, 500);
  }
});

// Calculate credit score based on American standard with saving/spending habits
app.get("/make-server-c5964f01/credit-score", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "demo-user";

    // Get all user data
    const balance = parseFloat((await kv.get(`balance:${userId}`)) || "0");
    const transactions = await kv.getByPrefix(`transaction:${userId}:`);
    const goals = await kv.getByPrefix(`goal:${userId}:`);

    const parsedTransactions = transactions
      .map((t) => JSON.parse(t))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const parsedGoals = goals.map((g) => JSON.parse(g));

    // Base score (American credit score base: 300-850)
    let creditScore = 300;

    // Payment history (35%) - based on transaction frequency and success rate
    const txCount = parsedTransactions.length;
    const sentTxCount = parsedTransactions.filter(
      (tx) => tx.type === "sent"
    ).length;
    const paymentHistoryPoints = Math.min(
      35,
      Math.floor((sentTxCount / Math.max(txCount, 1)) * 35 + txCount * 2)
    );
    creditScore += paymentHistoryPoints;

    // Credit utilization (30%) - based on balance vs transactions
    const avgTransactionSize =
      parsedTransactions.length > 0
        ? parsedTransactions.reduce((sum, tx) => sum + tx.amount, 0) /
          parsedTransactions.length
        : 0;
    const utilizationRatio = balance / Math.max(avgTransactionSize * 5, 1);
    const utilizationPoints = Math.min(
      30,
      Math.floor(Math.min(utilizationRatio, 1) * 30 + (balance > 1000 ? 10 : 0))
    );
    creditScore += utilizationPoints;

    // Savings behavior (20%) - based on savings goals and progress
    let savingsPoints = 0;
    if (parsedGoals.length > 0) {
      const avgGoalProgress =
        parsedGoals.reduce(
          (sum, g) => sum + g.current / Math.max(g.target, 1),
          0
        ) / parsedGoals.length;
      savingsPoints = Math.floor(avgGoalProgress * 20);
    }
    savingsPoints += Math.min(10, Math.floor(parsedGoals.length * 2));
    creditScore += Math.min(20, savingsPoints);

    // Spending consistency (15%) - based on regular transaction patterns
    const thisMonthTxs = parsedTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const now = new Date();
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    });

    const lastMonthTxs = parsedTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return (
        txDate.getMonth() === lastMonth.getMonth() &&
        txDate.getFullYear() === lastMonth.getFullYear()
      );
    });

    const consistencyPoints =
      thisMonthTxs.length > 0 && lastMonthTxs.length > 0
        ? Math.floor(
            (Math.min(thisMonthTxs.length, lastMonthTxs.length) /
              Math.max(thisMonthTxs.length, lastMonthTxs.length)) *
              15
          )
        : 0;
    creditScore += consistencyPoints;

    // Cap at 850 (maximum American credit score)
    creditScore = Math.min(850, creditScore);

    // Determine rating
    let rating = "Poor";
    let color = "red";
    let riskLevel = "High";

    if (creditScore >= 800) {
      rating = "Excellent";
      color = "emerald";
      riskLevel = "Low";
    } else if (creditScore >= 740) {
      rating = "Very Good";
      color = "emerald";
      riskLevel = "Low";
    } else if (creditScore >= 670) {
      rating = "Good";
      color = "blue";
      riskLevel = "Medium";
    } else if (creditScore >= 580) {
      rating = "Fair";
      color = "amber";
      riskLevel = "Medium-High";
    }

    return c.json({
      score: creditScore,
      maxScore: 850,
      rating,
      color,
      riskLevel,
      breakdown: {
        paymentHistory: paymentHistoryPoints,
        creditUtilization: utilizationPoints,
        savingsBehavior: Math.min(20, savingsPoints),
        spendingConsistency: consistencyPoints,
      },
    });
  } catch (error) {
    console.error("Error calculating credit score:", error);
    return c.json({ error: "Failed to calculate credit score" }, 500);
  }
});

Deno.serve(app.fetch);
