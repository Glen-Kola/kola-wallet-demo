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
import {
  AlertCircle,
  User,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";

interface Collector {
  id: string;
  name: string;
  email: string;
  role: "collector" | "co-lead";
  registeredTransactions: number;
  collectedAmount: number;
  performance: number; // percentage
}

interface CollectorManagementModalProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
  collectors: Collector[];
  onAddCollector: (data: {
    name: string;
    email: string;
    role: string;
  }) => Promise<void>;
  onRemoveCollector: (collectorId: string) => Promise<void>;
}

export function CollectorManagementModal({
  open,
  onClose,
  groupName,
  groupId,
  collectors,
  onAddCollector,
  onRemoveCollector,
}: CollectorManagementModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("collector");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddCollector = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setLoading(true);
      await onAddCollector({
        name: name.trim(),
        email: email.trim(),
        role,
      });
      setName("");
      setEmail("");
      setRole("collector");
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add collector");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollector = async (collectorId: string) => {
    if (window.confirm("Are you sure you want to remove this collector?")) {
      try {
        await onRemoveCollector(collectorId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove collector"
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Collectors - {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-blue-600 uppercase tracking-wider">
                Total Collectors
              </p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {collectors.length}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <p className="text-xs text-emerald-600 uppercase tracking-wider">
                Collected Amount
              </p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                $
                {collectors
                  .reduce((sum, c) => sum + c.collectedAmount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-xs text-purple-600 uppercase tracking-wider">
                Transactions Registered
              </p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {collectors.reduce(
                  (sum, c) => sum + c.registeredTransactions,
                  0
                )}
              </p>
            </div>
          </div>

          {/* Add Collector Form */}
          {!showAddForm ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Collector
            </Button>
          ) : (
            <form
              onSubmit={handleAddCollector}
              className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collector-name">Name *</Label>
                  <Input
                    id="collector-name"
                    placeholder="Collector name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collector-email">Email *</Label>
                  <Input
                    id="collector-email"
                    type="email"
                    placeholder="collector@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collector-role">Role</Label>
                <select
                  id="collector-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="collector">Collector</option>
                  <option value="co-lead">Co-Lead</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setError("");
                    setName("");
                    setEmail("");
                    setRole("collector");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Adding..." : "Add Collector"}
                </Button>
              </div>
            </form>
          )}

          {/* Collectors List */}
          {collectors.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
              <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No collectors yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collectors.map((collector) => (
                <div
                  key={collector.id}
                  className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                          {collector.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {collector.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {collector.email}
                          </p>
                        </div>
                      </div>
                      <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                        {collector.role === "co-lead" ? "Co-Lead" : "Collector"}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-right">
                      <div>
                        <p className="text-xs text-slate-500">Transactions</p>
                        <p className="font-semibold text-slate-900">
                          {collector.registeredTransactions}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Collected</p>
                        <p className="font-semibold text-slate-900">
                          ${collector.collectedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Performance</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <p className="font-semibold text-emerald-600">
                            {collector.performance}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCollector(collector.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      title="Remove collector"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
