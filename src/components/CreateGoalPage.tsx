import { useMemo, useRef, useState } from "react";
import {
  X,
  Shield,
  Palette,
  Lock,
  Sparkles,
  Plus,
  Zap,
  TrendingUp,
  Clock,
  Info,
  AlertCircle,
  Zap as ZapBoost,
  ChevronDown,
} from "lucide-react";
import { colorOptions, iconOptions, templates } from "../constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function CreateGoalPage({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
}) {
  // User financial profile (in real app, fetch from backend)
  const userProfile = {
    creditScore: 720, // 300-850 range
    monthlyIncome: 4500,
    currentSavings: 5000,
    monthlyExpenses: 3200,
  };

  const handleCreate = async (payload: any) => {
    console.log("Creating goal:", payload);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    await onCreate(payload);
    onClose();
  };

  const [name, setName] = useState("My New Goal");
  const [target, setTarget] = useState(500);
  const [duration, setDuration] = useState(90); // in days
  const [color, setColor] = useState<string>(colorOptions[0].key);
  const [customColor, setCustomColor] = useState<string>(colorOptions[0].value);
  const [icon, setIcon] = useState<string>("leaf");
  const [template, setTemplate] = useState<string | undefined>(undefined);
  const [showTemplates, setShowTemplates] = useState(false);
  const [locked, setLocked] = useState(false);
  const [penaltyRate, setPenaltyRate] = useState(0.02);
  const [boostRate, setBoostRate] = useState(0.01);
  const [isSaving, setIsSaving] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedColorHex = useMemo(() => {
    const match = colorOptions.find((c) => c.key === color);
    if (match) return match.value;
    // If user picked custom hex, store it directly in color state
    return color.startsWith("#") ? color : customColor;
  }, [color, customColor]);

  // Pick text color for preview based on selected color brightness
  const previewTextClass = useMemo(() => {
    const hex = selectedColorHex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    // Perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? "text-slate-900" : "text-white";
  }, [selectedColorHex]);

  // Auto-lock based on duration
  const shouldAutoLock = duration > 180; // Lock if > 6 months (180 days)
  const autoLocked = shouldAutoLock || locked;
  // Penalties and boosts only available for goals > 40 days
  const isEligibleForPenalties = duration > 40;

  const computedRates = useMemo(() => {
    const disposableIncome =
      userProfile.monthlyIncome - userProfile.monthlyExpenses;
    const monthlySavingsNeeded = target / Math.max(duration / 30.44, 1);

    // Savings strain: how much of disposable income is needed (0-1+)
    const savingsStrain = monthlySavingsNeeded / disposableIncome;

    // Credit score factor (normalized 0-1, higher is better)
    const creditFactor = Math.min(
      1,
      Math.max(0, (userProfile.creditScore - 300) / 550)
    );

    // Existing savings cushion (how many months of goal target they already have)
    const savingsCushion = userProfile.currentSavings / target;

    // Duration factor (longer = higher rates possible)
    const durationFactor = Math.min(1, duration / 365);

    // --- PENALTY RATE CALCULATION ---
    // Base penalty: 2-10% range
    // Higher penalty for: shorter duration, lower credit, higher strain
    let penaltyRate = 0.02; // Base 2%

    if (isEligibleForPenalties) {
      // Increase penalty if savings strain is high (risky goal)
      penaltyRate += Math.min(0.04, savingsStrain * 0.05);

      // Lower credit = higher penalty (more risk)
      penaltyRate += (1 - creditFactor) * 0.02;

      // Longer duration = slightly higher penalty (more commitment needed)
      penaltyRate += durationFactor * 0.02;

      // If user has good cushion, reduce penalty slightly
      if (savingsCushion > 0.5) {
        penaltyRate -= 0.01;
      }

      // Clamp to 2-10%
      penaltyRate = Math.max(0.02, Math.min(0.1, penaltyRate));
    } else {
      penaltyRate = 0;
    }

    // --- BOOST RATE CALCULATION ---
    // Base boost: 0-5% range
    // Higher boost for: longer duration, higher credit, reasonable strain
    let boostRate = 0;

    if (isEligibleForPenalties) {
      // Base boost from duration (longer = more boost)
      boostRate = durationFactor * 0.03;

      // Credit score bonus (good credit = more boost)
      boostRate += creditFactor * 0.015;

      // Reasonable savings strain gets a bonus (not too easy, not too hard)
      if (savingsStrain >= 0.2 && savingsStrain <= 0.6) {
        boostRate += 0.01; // Sweet spot bonus
      }

      // Extended goals (6+ months) get extra boost
      if (duration > 180) {
        boostRate += 0.01;
      }

      // Clamp to 0-5%
      boostRate = Math.max(0, Math.min(0.05, boostRate));
    }

    // --- INTEREST RATE (APY) CALCULATION ---
    // Based on duration tier and credit score
    let interestRate = 0.02; // Base 2% APY

    if (duration > 90) {
      interestRate = 0.035; // 3.5% for medium-term
    }
    if (duration > 180) {
      interestRate = 0.05; // 5% for long-term
    }

    // Credit score bonus to interest
    interestRate += creditFactor * 0.01;

    // Calculate projected values
    const interestEarned = target * interestRate * (duration / 365);
    const engagementBonus = target * boostRate;
    const totalAtEnd = target + interestEarned + engagementBonus;
    const penaltyAmount = target * penaltyRate;
    const earlyWithdrawalAmount = target - penaltyAmount;

    return {
      penaltyRate,
      boostRate,
      interestRate,
      interestEarned,
      engagementBonus,
      totalAtEnd,
      penaltyAmount,
      earlyWithdrawalAmount,
      // Factors for display
      savingsStrain,
      creditFactor,
      savingsCushion,
      durationFactor,
      monthlySavingsNeeded,
      riskLevel:
        savingsStrain > 0.7 ? "high" : savingsStrain > 0.4 ? "moderate" : "low",
    };
  }, [target, duration, userProfile, isEligibleForPenalties]);

  // Smart timeline recommendation
  const recommendedTimeline = useMemo(() => {
    const disposableIncome =
      userProfile.monthlyIncome - userProfile.monthlyExpenses;
    const safeSavingsRate = disposableIncome * 0.6; // 60% of disposable income is safe

    // Credit score affects recommendation (higher score = can handle tighter timeline)
    const creditScoreMultiplier =
      userProfile.creditScore >= 750
        ? 0.9
        : userProfile.creditScore >= 700
        ? 1.0
        : userProfile.creditScore >= 650
        ? 1.15
        : 1.3;

    const recommendedMonths =
      (target / safeSavingsRate) * creditScoreMultiplier;
    const recommendedDays = Math.ceil(recommendedMonths * 30.44);

    // Ensure within bounds
    const boundedDays = Math.max(7, Math.min(1095, recommendedDays));

    return {
      days: boundedDays,
      months: boundedDays / 30.44,
      monthlySavings: safeSavingsRate,
      isAggressive: duration < boundedDays * 0.8,
      isConservative: duration > boundedDays * 1.3,
      confidenceLevel: userProfile.creditScore >= 700 ? "high" : "moderate",
    };
  }, [target, userProfile, duration]);

  // Calculate benefits based on duration
  const benefits = useMemo(() => {
    const result = {
      lockStatus: "",
      penalties: false,
      boosts: false,
      multiplier: 1,
      description: "",
      features: [] as string[],
    };

    if (duration <= 30) {
      result.lockStatus = "Unlocked";
      result.description = "Short-term goal";
      result.features = [
        "Full access to withdrawals",
        "No emergency withdrawal penalties",
        "Simple progress tracking",
      ];
    } else if (duration <= 90) {
      result.lockStatus = "Unlocked";
      result.description = "Medium-term goal";
      result.penalties = true;
      result.features = [
        "Emergency withdrawal penalties (2-10%)",
        "Progress boost eligible",
        "Milestone notifications",
        "Weekly progress reports",
      ];
    } else if (duration <= 180) {
      result.lockStatus = "Unlocked";
      result.description = "Long-term goal";
      result.penalties = true;
      result.boosts = true;
      result.multiplier = 1.2;
      result.features = [
        "Emergency withdrawal penalties (2-10%)",
        "Progress boost (up to 5%)",
        "Goal achievement badges",
        "Social sharing features",
        "10% - 20% credit score increase",
      ];
    } else {
      result.lockStatus = "Auto-locked";
      result.description = "Extended-term goal";
      result.penalties = true;
      result.boosts = true;
      result.multiplier = 1.5;
      result.features = [
        "Automatic lock On",
        "Emergency withdrawal penalties (5-15%)",
        "Maximum progress boost (10%)",
        "Premium goal analytics",
        "20% - 50% credit score increase",
        "Dedicated goal coach insights",
      ];
    }

    return result;
  }, [duration]);

  const handleSelectTemplate = (tplKey: string) => {
    const tpl = templates.find((t) => t.key === tplKey);
    if (!tpl) return;
    setTemplate(tpl.key);
    setName(tpl.name);
    setTarget(tpl.target);
    setColor(tpl.color);
    const tplColor = colorOptions.find((c) => c.key === tpl.color);
    if (tplColor) setCustomColor(tplColor.value);
    setIcon(tpl.icon);
    setLocked(tpl.locked);
    setPenaltyRate(tpl.penaltyRate);
    setBoostRate(tpl.boostRate);
  };

  const handleSave = async () => {
    if (!name || !target || target <= 0) {
      alert("Please provide a name and a valid target amount");
      return;
    }

    setIsSaving(true);
    try {
      await handleCreate({
        name,
        target,
        color: selectedColorHex.startsWith("#") ? selectedColorHex : color,
        icon,
        template,
        duration, // Add duration
        locked: autoLocked,
        penaltyRate: isEligibleForPenalties ? penaltyRate : 0,
        boostRate: isEligibleForPenalties ? boostRate : 0,
      });
    } catch (error) {
      console.error("Failed to create goal", error);
      alert("Could not create goal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-slate-200 rounded-3xl h-40 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-2xl h-24 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-vw overflow-hidden">
      {/* <div className="bg-white w-full md:max-w-xl rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slideUp"> */}
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4 md:p-6 flex-shrink-0 bg-white z-10">
        <div>
          <p className="text-slate-500 text-sm">New Savings Goal</p>
          <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Build your next milestone
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto flex-1 overscroll-contain">
        {/* Templates */}
        <div className="border border-slate-100 rounded-2xl bg-white">
          <button
            type="button"
            onClick={() => setShowTemplates((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 md:px-5 md:py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-800 font-semibold">
                Starter templates
              </span>
              <span className="text-xs text-slate-500">
                ({templates.length})
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                showTemplates ? "rotate-180" : ""
              }`}
            />
          </button>
          {showTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 pb-4 md:px-5 md:pb-5">
              {templates.map((tpl) => {
                const tplIcon = iconOptions.find((i) => i.key === tpl.icon);
                const IconComp = tplIcon?.Icon || Sparkles;
                return (
                  <button
                    key={tpl.key}
                    onClick={() => handleSelectTemplate(tpl.key)}
                    className={`text-left border rounded-2xl p-4 hover:border-emerald-300 transition-colors ${
                      template === tpl.key
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl" aria-label={tpl.name}>
                        <IconComp className="w-5 h-5" />
                      </span>
                      {tpl.locked && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-slate-900 font-medium">{tpl.name}</p>
                    <p className="text-slate-500 text-sm mb-1">
                      Target ${tpl.target.toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-xs">{tpl.description}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-3xl p-4 md:p-6 border border-emerald-100 space-y-5 overflow-hidden w-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-slate-900 font-semibold">Define Your Goal</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            <div className="group">
              <label className="block text-slate-700 font-medium mb-3 text-sm">
                Goal name
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="relative w-full border-2 border-slate-200 bg-white rounded-2xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Emergency Fund"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Give your goal a meaningful name
              </p>
            </div>

            <div className="group">
              <label className="block text-slate-700 font-medium mb-3 text-sm">
                Target amount
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-lg font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={target}
                  min={10}
                  onChange={(e) => setTarget(parseFloat(e.target.value))}
                  className="relative w-full border-2 border-slate-200 bg-white rounded-2xl px-10 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all placeholder:text-slate-400 font-semibold"
                  placeholder="500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                How much do you want to save?
              </p>
            </div>

            <div className="group">
              <label className="block text-slate-700 font-medium mb-3 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Duration
              </label>
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-5 group-hover:border-violet-300 transition-colors">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                  <input
                    type="number"
                    min={7}
                    max={1095}
                    value={duration}
                    onChange={(e) =>
                      setDuration(
                        Math.max(
                          7,
                          Math.min(1095, parseInt(e.target.value) || 0)
                        )
                      )
                    }
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                  <span className="text-sm font-semibold text-slate-600 sm:min-w-[50px] text-right shrink-0">
                    {Math.round(duration / 30)}mo
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {[7, 30, 60, 90, 180, 365].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDuration(days)}
                      className={`px-2 sm:px-3 py-2 sm:py-3 rounded-2xl text-xs font-medium transition-all flex-1 sm:flex-none ${
                        duration === days
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {days === 7
                        ? "1w"
                        : days === 30
                        ? "1mo"
                        : days === 60
                        ? "2mo"
                        : days === 90
                        ? "3mo"
                        : days === 180
                        ? "6mo"
                        : "1yr"}
                    </button>
                  ))}
                </div>
                <p
                  className={`text-xs mt-3 p-2 rounded-lg flex items-center justify-between cursor-pointer group`}
                >
                  <span className="text-slate-700">
                    {duration} days • {benefits.description}
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="ml-2 text-slate-400 hover:text-emerald-600 transition-colors"
                        aria-label="View duration benefits"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-lg max-h-[400px] overflow-hidden"
                      side="top"
                      align="end"
                    >
                      <div className="space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            {duration <= 180 ? (
                              <Lock className="w-5 h-5 text-slate-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {benefits.description}
                            </p>
                            <p className="text-xs text-slate-500">
                              {benefits.lockStatus}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">
                            Benefits included:
                          </p>
                          <ul className="space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pr-1">
                            {benefits.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-slate-600"
                              >
                                <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">
                                  ✓
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {benefits.multiplier > 1 && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-2">
                            <ZapBoost className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-emerald-900">
                                Engagement Boost
                              </p>
                              <p className="text-xs text-emerald-700">
                                {((benefits.multiplier - 1) * 100).toFixed(0)}%
                                higher rewards
                              </p>
                            </div>
                          </div>
                        )}

                        {shouldAutoLock && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-amber-900 mb-1">
                              Auto-lock active
                            </p>
                            <p className="text-xs text-amber-700">
                              Your goal will be automatically locked.
                            </p>
                            <p className="text-xs text-amber-700">
                              Emergency withdrawals allowed with penalty.
                            </p>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </p>
              </div>
            </div>

            <div className="group">
              <label className="block text-slate-700 font-medium mb-3 text-sm">
                Summary
              </label>
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Monthly target:</span>
                  <span className="font-semibold text-slate-900">
                    ${(target / Math.max(duration / 30.44, 1)).toFixed(2)}/mo
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-semibold text-slate-900">
                    {(duration / 30.44).toFixed(1)} months
                  </span>
                </div>
                {isEligibleForPenalties && (
                  <div className="pt-1.5 border-t border-slate-100 text-xs text-emerald-600">
                    ✓ Eligible for penalties & boosts
                  </div>
                )}
                {!isEligibleForPenalties && (
                  <div className="pt-1.5 border-t border-slate-100 text-xs text-slate-500">
                    Penalties/boosts available for goals over 40 days
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Smart recommendation */}
          <div
            className={`rounded-2xl p-4 border-2 ${
              recommendedTimeline.isAggressive
                ? "bg-amber-50 border-amber-200"
                : recommendedTimeline.isConservative
                ? "bg-blue-50 border-blue-200"
                : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      recommendedTimeline.isAggressive
                        ? "text-amber-600"
                        : recommendedTimeline.isConservative
                        ? "text-blue-600"
                        : "text-emerald-600"
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    AI Recommendation
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-medium mb-1">
                  {recommendedTimeline.isAggressive
                    ? "⚡ Aggressive timeline"
                    : recommendedTimeline.isConservative
                    ? "🛡️ Conservative approach"
                    : "✓ Optimal timeline"}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {recommendedTimeline.isAggressive
                    ? `Based on your income flow ($${userProfile.monthlyIncome.toLocaleString()}/mo) and credit profile (${
                        userProfile.creditScore
                      }), this is tight. Consider ${recommendedTimeline.months.toFixed(
                        1
                      )} months @ $${recommendedTimeline.monthlySavings.toFixed(
                        0
                      )}/mo.`
                    : recommendedTimeline.isConservative
                    ? `You can comfortably reach this goal faster! With your income ($${userProfile.monthlyIncome.toLocaleString()}/mo) and credit score (${
                        userProfile.creditScore
                      }), try ${recommendedTimeline.months.toFixed(1)} months.`
                    : `Perfect match for your profile! Your income ($${userProfile.monthlyIncome.toLocaleString()}/mo) and credit score (${
                        userProfile.creditScore
                      }) support this timeline at $${recommendedTimeline.monthlySavings.toFixed(
                        0
                      )}/mo.`}
                </p>
              </div>
              {!recommendedTimeline.isAggressive &&
                !recommendedTimeline.isConservative && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-lg">✓</span>
                    </div>
                  </div>
                )}
            </div>
            {(recommendedTimeline.isAggressive ||
              recommendedTimeline.isConservative) && (
              <button
                type="button"
                onClick={() => setDuration(recommendedTimeline.days)}
                className="mt-3 w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Apply recommended timeline (
                {recommendedTimeline.months.toFixed(1)} months)
              </button>
            )}
          </div>
        </div>

        {/* Color & Icon */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-3xl p-4 md:p-6 border border-emerald-100 space-y-5 overflow-hidden w-full">
          {/* Color section - cooked like Basic Info */}
          <div className="group">
            <p className="text-slate-700 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Color
            </p>
            <div className="bg-red w-400 border-2 border-slate-200 rounded-2xl p-4 md:p-5 group-hover:border-emerald-300 transition-colors space-y-3">
              {/* Brand palette chips */}
              <div className="w-100 flex flex-row items-center gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {colorOptions.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setColor(c.key);
                      setCustomColor(c.value);
                    }}
                    className={`rounded-full p-5 border-2 flex items-center justify-center transition-all shadow-[0_1px_6px_rgba(15,23,42,0.12)] ${
                      color === c.key
                        ? "ring-2 ring-offset-2 ring-emerald-200 scale-105"
                        : "ring-0 hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: c.value,
                      borderColor: "transparent",
                      width: "50px",
                      height: "50px",
                    }}
                    aria-label={c.label}
                  >
                    {color === c.key && (
                      <span className="text-white text-xs font-semibold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
                {/* Custom color picker chip */}
                <button
                  type="button"
                  onClick={() => colorPickerRef.current?.click()}
                  className={`flex-shrink-0 relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-[0_1px_6px_rgba(15,23,42,0.12)] bg-white ${
                    color.startsWith("#")
                      ? "ring-2 ring-offset-2 ring-emerald-200"
                      : "border-dashed border-slate-300"
                  }`}
                  style={{
                    backgroundColor: color.startsWith("#")
                      ? selectedColorHex
                      : "#f8fafc",
                  }}
                  aria-label="Custom color picker"
                >
                  <div className="absolute inset-0 rounded-full border border-white/60 pointer-events-none" />
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/90 text-slate-700 shadow-sm">
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                <input
                  ref={colorPickerRef}
                  type="color"
                  value={selectedColorHex}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setCustomColor(e.target.value);
                  }}
                  className="sr-only"
                  aria-hidden="true"
                />
              </div>

              {/* Custom HEX input */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    HEX
                  </span>
                  <input
                    type="text"
                    value={selectedColorHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Accept only valid hex or keep current value
                      const isValid = /^#([0-9A-Fa-f]{6})$/.test(val);
                      if (isValid) {
                        setColor(val);
                        setCustomColor(val);
                      }
                    }}
                    placeholder="#10b981"
                    className="w-full border-2 border-slate-200 bg-white rounded-xl pl-11 pr-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>
                <div className="hidden sm:block text-xs text-slate-500">
                  Brand: Emerald • Blue • Violet
                </div>
              </div>

              {/* Live preview card */}
              <div
                className="rounded-xl border border-slate-100 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${selectedColorHex} 0%, rgba(255,255,255,0.95) 80%)`,
                }}
              >
                <div className={`p-4 ${previewTextClass}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      Goal Card Preview
                    </span>
                  </div>
                  <p className="text-xs opacity-90">
                    Your selection will theme highlights, progress, and accents.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-slate-700 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Icon
            </p>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {iconOptions.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setIcon(key)}
                  className={`flex-shrink-0 min-w-[46px] h-10 rounded-xl border flex items-center justify-center gap-1 px-3 transition-colors ${
                    icon === key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-700"
                  }`}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-3xl p-4 md:p-6 border border-emerald-100 space-y-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-slate-900 font-semibold">Goal Protection</h3>
          </div>

          {/* Stacked on mobile, side-by-side on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Locking card */}
            <div
              className={`border-2 rounded-2xl p-4 ${
                shouldAutoLock
                  ? "border-amber-200 bg-amber-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-800 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Goal Locking
                </p>
                <button
                  onClick={() => setLocked((prev) => !prev)}
                  disabled={shouldAutoLock}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    autoLocked
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  } ${shouldAutoLock ? "cursor-not-allowed" : ""}`}
                >
                  {autoLocked ? "Locked" : "Unlocked"}
                </button>
              </div>
              <p className="text-slate-500 text-sm">
                {shouldAutoLock
                  ? "✓ Auto-locked for extended goals (6+ months). Emergency withdrawals only."
                  : "Locking helps you stay disciplined. Emergency withdrawals allowed with a penalty."}
              </p>

              {/* Computed lock impact */}
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Lock status</span>
                  <span
                    className={`font-semibold ${
                      autoLocked ? "text-emerald-600" : "text-slate-600"
                    }`}
                  >
                    {autoLocked ? "🔒 Locked" : "🔓 Unlocked"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Duration tier</span>
                  <span className="font-semibold text-slate-700">
                    {benefits.description}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Credit boost potential</span>
                  <span className="font-semibold text-emerald-600">
                    {duration <= 90
                      ? "—"
                      : duration <= 180
                      ? "+10-20%"
                      : "+20-50%"}
                  </span>
                </div>
              </div>
            </div>

            {/* Penalties & Boosts */}
            <div
              className={`rounded-2xl p-4 space-y-3 ${
                isEligibleForPenalties
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-slate-50 border-2 border-slate-200"
              }`}
            >
              {/* Penalty slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-slate-800 font-medium text-sm">
                    Penalty Rate
                  </p>
                  <span
                    className={`text-sm font-semibold ${
                      isEligibleForPenalties
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {(computedRates?.penaltyRate * 100).toFixed(1)}%
                  </span>
                </div>
                {/* <input
                  type="range"
                  min={2}
                  max={10}
                  step={0.5}
                  value={penaltyRate * 100}
                  onChange={(e) =>
                    setPenaltyRate(parseFloat(e.target.value) / 100)
                  }
                  disabled={!isEligibleForPenalties}
                  className={`w-full accent-emerald-500 ${
                    !isEligibleForPenalties
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                /> */}
                <p className="text-slate-500 text-xs mt-1">
                  Emergency withdrawal fee
                </p>
              </div>

              {/* Boost slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-slate-800 font-medium text-sm">
                    Progress Boost
                  </p>
                  <span
                    className={`text-sm font-semibold ${
                      isEligibleForPenalties
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    +{(computedRates?.boostRate * 100).toFixed(1)}%
                  </span>
                </div>
                {/* <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={computedRates?.boostRate * 100}
                  onChange={(e) =>
                    setBoostRate(parseFloat(e.target.value) / 100)
                  }
                  disabled={!isEligibleForPenalties}
                  className={`w-full accent-emerald-500 ${
                    !isEligibleForPenalties
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                /> */}
                <p className="text-slate-500 text-xs mt-1">
                  Visual motivation nudge
                </p>
              </div>

              {/* Computed impact summary */}
              <div className="mt-2 pt-3 border-t border-slate-200/60 space-y-1.5">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Projected Impact
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">If you withdraw early</span>
                  <span
                    className={`font-semibold ${
                      isEligibleForPenalties
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {isEligibleForPenalties
                      ? `-$${(target * penaltyRate).toFixed(2)} fee`
                      : "No penalty"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Monthly save target</span>
                  <span className="font-semibold text-slate-700">
                    ${(target / Math.max(duration / 30.44, 1)).toFixed(2)}/mo
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">
                    Boosted progress display
                  </span>
                  <span
                    className={`font-semibold ${
                      isEligibleForPenalties
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {isEligibleForPenalties
                      ? `+${(boostRate * 100).toFixed(1)}% visual`
                      : "Unavailable"}
                  </span>
                </div>
                {!isEligibleForPenalties && (
                  <p className="text-xs text-amber-600 mt-2 pt-2 border-t border-slate-200/60">
                    ⚡ Increase duration to 41+ days to unlock penalties &
                    boosts
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            style={{
              backgroundColor: color.startsWith("#")
                ? selectedColorHex
                : undefined,
            }}
          >
            {isSaving ? "Saving..." : "Create Goal"}
          </button>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
