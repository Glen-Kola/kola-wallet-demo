import { useState, useEffect } from "react";
import { TrendingUp, Eye, EyeOff, X } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c5964f01`;
const USER_ID = "demo-user";

interface CreditScoreData {
  score: number;
  maxScore: number;
  rating: string;
  color: string;
  riskLevel: string;
  breakdown: {
    paymentHistory: number;
    creditUtilization: number;
    savingsBehavior: number;
    spendingConsistency: number;
  };
}

const levelThresholds = [
  {
    min: 300,
    max: 579,
    level: "Poor",
    nextLevel: 580,
    purchasingMultiplier: 0.5,
  },
  {
    min: 580,
    max: 669,
    level: "Fair",
    nextLevel: 670,
    purchasingMultiplier: 0.8,
  },
  {
    min: 670,
    max: 739,
    level: "Good",
    nextLevel: 740,
    purchasingMultiplier: 1.2,
  },
  {
    min: 740,
    max: 799,
    level: "Very Good",
    nextLevel: 800,
    purchasingMultiplier: 1.5,
  },
  {
    min: 800,
    max: 850,
    level: "Excellent",
    nextLevel: 850,
    purchasingMultiplier: 2.0,
  },
];

export function CreditScoreCard() {
  const [creditScore, setCreditScore] = useState<CreditScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScoreVisible, setIsScoreVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        const response = await fetch(`${API_BASE}/credit-score`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Id": USER_ID,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch credit score");
        }

        const data = await response.json();
        setCreditScore(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching credit score:", err);
        setError("Unable to load credit score");
      } finally {
        setLoading(false);
      }
    };

    fetchCreditScore();
  }, []);

  if (error && !creditScore) {
    return (
      <div
        className="rounded-3xl p-6 shadow-lg text-white"
        style={{ backgroundColor: "#543c52" }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/70 text-sm mb-1">Credit Score</p>
            <p className="text-red-300 text-sm">Error loading score</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-sm text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div
        className="rounded-3xl p-6 shadow-lg text-white"
        style={{ backgroundColor: "#543c52" }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/70 text-sm mb-1">Credit Score</p>
            <div className="h-8 w-32 bg-slate-500 rounded animate-pulse"></div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 animate-pulse"></div>
      </div>
    );
  }

  const percentage = (creditScore.score / creditScore.maxScore) * 100;

  // Get current level info and next level
  const currentLevelInfo = levelThresholds.find(
    (l) => creditScore.score >= l.min && creditScore.score <= l.max
  );
  const nextLevel = currentLevelInfo?.nextLevel || 850;
  const progressToNextLevel =
    nextLevel === 850
      ? 100
      : ((creditScore.score - (currentLevelInfo?.min || 300)) /
          (nextLevel - (currentLevelInfo?.min || 300))) *
        100;
  const pointsToNextLevel = nextLevel - creditScore.score;
  const baseBalance = 2847.5;
  const purchasingPower =
    baseBalance * (currentLevelInfo?.purchasingMultiplier || 0.5);

  return (
    <>
      {/* Main Card - Similar to SmartCard */}
      <div className="relative">
        <div
          className="rounded-3xl p-6 shadow-lg text-white"
          style={{ backgroundColor: "#543c52" }}
        >
          {/* Card Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/70 text-sm mb-1">Credit Score</p>
              <div className="flex items-center gap-3">
                {isScoreVisible ? (
                  <h2 className="text-white text-3xl font-bold">
                    {creditScore.score}
                  </h2>
                ) : (
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  </div>
                )}
                <button
                  onClick={() => setIsScoreVisible(!isScoreVisible)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {isScoreVisible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-white/70 text-xs mt-2">{creditScore.rating}</p>
            </div>
            <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center border border-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress Bar to Next Level */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white/70 text-xs">Progress to {nextLevel}</p>
              <p className="text-white text-xs font-semibold">
                {pointsToNextLevel} points
              </p>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              ></div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="text-xs text-white/60">
            Risk Level:{" "}
            <span className="text-white font-semibold">
              {creditScore.riskLevel}
            </span>
          </div>
        </div>

        {/* Quick Info Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 w-full bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow cursor-pointer"
        >
          <p className="text-slate-500 text-xs mb-1">View Details</p>
          <p className="text-slate-900 font-semibold">
            See full financial profile →
          </p>
        </button>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 text-xl font-bold">
                Credit Profile
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Current Score Section */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-slate-500 text-sm mb-2">Current Score</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-slate-900 text-4xl font-bold">
                  {creditScore.score}
                </h3>
                <p className="text-slate-400 text-lg">
                  / {creditScore.maxScore}
                </p>
              </div>
              <p className="text-slate-600 mt-2 font-semibold">
                {creditScore.rating}
              </p>
            </div>

            {/* Net Assets */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-slate-500 text-sm mb-3">Net Assets</p>
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-blue-600 text-xs mb-1">Total Assets</p>
                <p className="text-blue-900 text-2xl font-bold">
                  ${baseBalance.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Purchasing Power */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-slate-500 text-sm mb-3">Purchasing Power</p>
              <div className="bg-emerald-50 rounded-2xl p-4">
                <p className="text-emerald-600 text-xs mb-1">Credit Limit</p>
                <p className="text-emerald-900 text-2xl font-bold">
                  ${purchasingPower.toFixed(2)}
                </p>
                <p className="text-emerald-700 text-xs mt-2">
                  Based on {currentLevelInfo?.level} rating
                </p>
              </div>
            </div>

            {/* Next Level */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-slate-500 text-sm mb-3">Path to Next Level</p>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-slate-600 text-sm">
                    Current:{" "}
                    <span className="font-semibold">{creditScore.rating}</span>
                  </p>
                  <p className="text-slate-600 text-sm">
                    Next:{" "}
                    <span className="font-semibold">
                      {levelThresholds.find((l) => l.min === nextLevel)
                        ?.level || "Excellent"}
                    </span>
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-500 h-3 rounded-full"
                    style={{ width: `${progressToNextLevel}%` }}
                  ></div>
                </div>
                <p className="text-slate-600 text-sm">
                  {pointsToNextLevel} points to reach {nextLevel}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div>
              <p className="text-slate-500 text-sm mb-3">Score Breakdown</p>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-600 text-sm">Payment History</p>
                    <p className="text-slate-900 font-bold">
                      {creditScore.breakdown.paymentHistory}/35
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(
                          (creditScore.breakdown.paymentHistory / 35) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-600 text-sm">Credit Utilization</p>
                    <p className="text-slate-900 font-bold">
                      {creditScore.breakdown.creditUtilization}/30
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${(
                          (creditScore.breakdown.creditUtilization / 30) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-600 text-sm">Savings Behavior</p>
                    <p className="text-slate-900 font-bold">
                      {creditScore.breakdown.savingsBehavior}/20
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(
                          (creditScore.breakdown.savingsBehavior / 20) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-600 text-sm">
                      Spending Consistency
                    </p>
                    <p className="text-slate-900 font-bold">
                      {creditScore.breakdown.spendingConsistency}/15
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${(
                          (creditScore.breakdown.spendingConsistency / 15) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
