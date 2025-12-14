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
import { AlertCircle, Users } from "lucide-react";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup: (data: {
    name: string;
    description?: string;
    isOrganizationGroup?: boolean;
  }) => Promise<void>;
  userRole?: "microfinance" | "user";
}

export function CreateGroupModal({
  open,
  onClose,
  onCreateGroup,
  userRole = "user",
}: CreateGroupModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOrganizationGroup, setIsOrganizationGroup] = useState(
    userRole === "microfinance"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setLoading(true);
      await onCreateGroup({
        name: name.trim(),
        description: description.trim(),
        isOrganizationGroup:
          userRole === "microfinance" ? isOrganizationGroup : false,
      });
      setName("");
      setDescription("");
      setIsOrganizationGroup(userRole === "microfinance");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Savings Group
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name *</Label>
            <Input
              id="group-name"
              placeholder="e.g., Friends Savings Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-description">Description</Label>
            <textarea
              id="group-description"
              placeholder="What is this group for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>

          {userRole === "microfinance" && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="org-group"
                checked={isOrganizationGroup}
                onChange={(e) => setIsOrganizationGroup(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor="org-group"
                className="text-sm text-blue-900 flex-1"
              >
                Create as Organization Group (collectors can register manual
                transactions)
              </label>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

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
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
