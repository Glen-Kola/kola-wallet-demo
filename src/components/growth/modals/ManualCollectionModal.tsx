import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { AlertCircle, TrendingUp } from "lucide-react";

interface ManualCollectionModalProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
  collectorName: string;
  collectorId: string;
  onRegisterCollection: (data: {
    amount: number;
    description?: string;
    collectionDate?: string;
  }) => Promise<void>;
}

export function ManualCollectionModal({
  open,
  onClose,
  groupName,
  groupId,
  collectorName,
  collectorId,
  onRegisterCollection,
}: ManualCollectionModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await onRegisterCollection({
        amount: amountNum,
        description: description.trim(),
        collectionDate,
      });
      setAmount("");
      setDescription("");
      setCollectionDate(new Date().toISOString().split("T")[0]);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register collection"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Register Manual Collection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-medium">Group</p>
              <p className="text-blue-900">{groupName}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Collector</p>
              <p className="text-blue-900">{collectorName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="collection-amount">Amount (USD) *</Label>
            <Input
              id="collection-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="text-lg"
            />
            {amount && (
              <p className="text-sm text-emerald-600 font-medium">
                Total: $
                {parseFloat(amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-date">Collection Date</Label>
            <Input
              id="collection-date"
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-description">Notes</Label>
            <textarea
              id="collection-description"
              placeholder="e.g., Cash collected from members, payment method, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800 font-medium mb-2">
              System will calculate impact on:
            </p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>✓ Member's savings goal progress</li>
              <li>✓ Collector's performance metrics</li>
              <li>✓ Organization's total collections</li>
              <li>✓ Group's growth and ROI</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !amount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Registering..." : "Register Collection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
