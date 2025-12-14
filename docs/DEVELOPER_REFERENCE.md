# Developer Reference

## Architecture Overview

The Organizations & Groups feature follows a component-modal architecture with centralized state management through the `useKolaWallet` hook.

---

## Component Structure

```
Growth (Main Container)
├── BusinessSection
│   └── CreateOrganizationModal
└── GroupsSection
    ├── CreateGroupModal
    ├── CollectorManagementModal
    └── ManualCollectionModal
```

---

## API Endpoints

### Base Configuration

```javascript
const BASE_URL =
  "https://{projectId}.supabase.co/functions/v1/make-server-c5964f01";

const headers = {
  Authorization: `Bearer ${publicAnonKey}`,
  "X-User-Id": userId,
  "Content-Type": "application/json",
};
```

### 1. Create Organization

```typescript
POST /organization

Request Body:
{
  name: string;           // required
  description?: string;   // optional
  category?: string;      // optional: "microfinance" | "cooperative" | "ngo" | "community_group" | "business" | "other"
}

Response (201):
{
  success: true;
  message: "Organization created successfully";
  data: {
    id: string;
    name: string;
    description: string;
    category: string;
    createdBy: string;
    createdAt: string;
  }
}

Error (400/500):
{
  success: false;
  message: string;
}
```

### 2. Create Group

```typescript
POST /group

Request Body:
{
  name: string;                  // required
  description?: string;          // optional
  isOrganizationGroup?: boolean; // optional, default: false
}

Response (201):
{
  success: true;
  message: "Group created successfully";
  data: {
    id: string;
    name: string;
    description: string;
    isOrganizationGroup: boolean;
    members: string[];
    collectors: string[];
    balance: number;
    createdAt: string;
  }
}
```

### 3. Add Collector

```typescript
POST /group/{groupId}/collector

Request Body:
{
  collectorId: string;  // required
  role?: string;        // optional: "collector" | "co-lead", default: "collector"
}

Response (200):
{
  success: true;
  message: "Collector added successfully";
  data: {
    groupId: string;
    collectorId: string;
    role: string;
    addedAt: string;
  }
}
```

### 4. Remove Collector

```typescript
DELETE /group/{groupId}/collector/{collectorId}

Response (200):
{
  success: true;
  message: "Collector removed successfully";
}
```

### 5. Register Collection

```typescript
POST /group/{groupId}/collection

Request Body:
{
  collectorId: string;  // required
  amount: number;       // required, positive number
  date?: string;        // optional, ISO date string
  notes?: string;       // optional
}

Response (201):
{
  success: true;
  message: "Collection registered successfully";
  data: {
    transactionId: string;
    groupId: string;
    collectorId: string;
    amount: number;
    date: string;
    impact: {
      userLevel: {
        goalsUpdated: number;
        newBalance: number;
      };
      collectorLevel: {
        totalCollections: number;
        totalAmount: number;
      };
      organizationLevel: {
        totalCollected: number;
        transactionCount: number;
      };
      groupLevel: {
        newBalance: number;
        growthPercentage: number;
      };
    };
  }
}
```

---

## Hook Functions

### useKolaWallet.ts

```typescript
// Create Organization
const createOrganization = async (data: {
  name: string;
  description?: string;
  category?: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/organization`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      await fetchData(); // Refresh data
      return result;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Create organization error:", error);
    throw error;
  }
};

// Create Group
const createGroup = async (data: {
  name: string;
  description?: string;
  isOrganizationGroup?: boolean;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/group`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      await fetchData();
      return result;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Create group error:", error);
    throw error;
  }
};

// Add Collector
const addCollector = async (
  groupId: string,
  data: { collectorId: string; role?: string }
) => {
  try {
    const response = await fetch(`${BASE_URL}/group/${groupId}/collector`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      await fetchData();
      return result;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Add collector error:", error);
    throw error;
  }
};

// Remove Collector
const removeCollector = async (groupId: string, collectorId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/group/${groupId}/collector/${collectorId}`,
      { method: "DELETE", headers }
    );
    const result = await response.json();
    if (result.success) {
      await fetchData();
      return result;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Remove collector error:", error);
    throw error;
  }
};

// Register Collection
const registerCollection = async (
  groupId: string,
  collectorId: string,
  data: { amount: number; date?: string; notes?: string }
) => {
  try {
    const response = await fetch(`${BASE_URL}/group/${groupId}/collection`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...data, collectorId }),
    });
    const result = await response.json();
    if (result.success) {
      await fetchData();
      return result;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Register collection error:", error);
    throw error;
  }
};
```

---

## Component Props

### CreateOrganizationModal

```typescript
interface CreateOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onCreateOrganization: (data: {
    name: string;
    description?: string;
    category?: string;
  }) => Promise<void>;
}
```

### CreateGroupModal

```typescript
interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup: (data: {
    name: string;
    description?: string;
    isOrganizationGroup?: boolean;
  }) => Promise<void>;
  userRole?: string; // Show org toggle only for "microfinance"
}
```

### CollectorManagementModal

```typescript
interface CollectorManagementModalProps {
  open: boolean;
  onClose: () => void;
  group: {
    id: string;
    name: string;
    collectors?: Array<{
      id: string;
      name: string;
      role: string;
      totalCollections: number;
      totalAmount: number;
    }>;
    stats?: {
      totalCollectors: number;
      totalCollected: number;
      totalTransactions: number;
    };
  };
  onAddCollector: (
    groupId: string,
    data: { collectorId: string; role?: string }
  ) => Promise<void>;
  onRemoveCollector: (groupId: string, collectorId: string) => Promise<void>;
}
```

### ManualCollectionModal

```typescript
interface ManualCollectionModalProps {
  open: boolean;
  onClose: () => void;
  group: {
    id: string;
    name: string;
    collectors: Array<{
      id: string;
      name: string;
    }>;
  };
  onRegisterCollection: (
    groupId: string,
    collectorId: string,
    data: { amount: number; date?: string; notes?: string }
  ) => Promise<void>;
}
```

---

## State Management

### GroupsSection State

```typescript
const [showCreateModal, setShowCreateModal] = useState(false);
const [selectedGroupForCollector, setSelectedGroupForCollector] =
  useState<any>(null);
const [selectedGroupForCollection, setSelectedGroupForCollection] =
  useState<any>(null);
const [selectedCollectorForCollection, setSelectedCollectorForCollection] =
  useState<string>("");
```

### BusinessSection State

```typescript
const [showCreateModal, setShowCreateModal] = useState(false);
```

---

## Styling Patterns

### Modal Container

```tsx
<div className="space-y-4">{/* Form content */}</div>
```

### Form Input

```tsx
<div className="space-y-2">
  <Label htmlFor="fieldName">Field Label</Label>
  <Input
    id="fieldName"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Enter value"
  />
</div>
```

### Submit Button

```tsx
<Button
  onClick={handleSubmit}
  disabled={loading || !isValid}
  className="w-full bg-[#colorCode] hover:bg-[#darkerCode]"
>
  {loading ? "Processing..." : "Submit"}
</Button>
```

### Organization Group Badge

```tsx
{
  group.isOrganizationGroup && (
    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
      <Building2 className="w-3 h-3" />
      Organization Group
    </div>
  );
}
```

### Conditional Buttons

```tsx
{
  group.isOrganizationGroup && (
    <>
      <button
        onClick={() => handleCollectorsClick(group)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
      >
        <Users className="w-4 h-4" />
        Collectors
      </button>
      <button
        onClick={() => handleCollectionClick(group)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm"
      >
        <TrendingUp className="w-4 h-4" />
        Collection
      </button>
    </>
  );
}
```

---

## Testing Checklist

### Modal Functionality

- [ ] Modal opens on button click
- [ ] Modal closes on X button click
- [ ] Modal closes on Cancel button click
- [ ] Form validation works correctly
- [ ] Submit button disabled when invalid
- [ ] Loading state displays during submission
- [ ] Success closes modal
- [ ] Error displays error message

### Organization Creation

- [ ] Name field required validation
- [ ] Description field optional
- [ ] Category dropdown displays all options
- [ ] API call successful
- [ ] Data refreshes after creation
- [ ] Organization displays in Business section

### Group Creation

- [ ] Name field required validation
- [ ] Description field optional
- [ ] Organization toggle shows for microfinance only
- [ ] API call successful
- [ ] Data refreshes after creation
- [ ] Group displays with correct badge if org group

### Collector Management

- [ ] Modal only accessible for org groups
- [ ] Statistics display correctly
- [ ] Add collector form validation
- [ ] Role dropdown works
- [ ] Remove confirmation dialog shows
- [ ] Collector list updates after add/remove
- [ ] Performance metrics display

### Collection Registration

- [ ] Modal only accessible for org groups with collectors
- [ ] Collector dropdown populated correctly
- [ ] Amount field validation (positive number)
- [ ] Date picker works
- [ ] Notes field optional
- [ ] Impact section displays after submission
- [ ] All calculation levels shown

---

## Common Issues & Solutions

### Issue: Modal not opening

**Solution:** Check Dialog component has React.forwardRef() on all sub-components:

```typescript
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} {...props} />
));
```

### Issue: Missing commas in cn() function

**Solution:** Ensure all cn() calls have proper comma-separated arguments:

```typescript
className={cn(
  "base-classes",
  className,  // Note the comma
)}
```

### Issue: API calls failing

**Solution:** Verify headers and BASE_URL are correct, check network tab for details

### Issue: State not updating after submission

**Solution:** Ensure `fetchData()` is called after successful API response

---

## File Locations

```
src/
├── components/
│   ├── growth/
│   │   ├── BusinessSection.tsx          # Organization management
│   │   ├── GroupsSection.tsx            # Group management with conditionals
│   │   ├── GrowthDetails.tsx
│   │   ├── SavingsSection.tsx
│   │   └── modals/
│   │       ├── CreateOrganizationModal.tsx
│   │       ├── CreateGroupModal.tsx
│   │       ├── CollectorManagementModal.tsx
│   │       └── ManualCollectionModal.tsx
│   ├── Growth.tsx                       # Main container
│   └── ui/                              # Radix UI components
│       ├── dialog.tsx
│       ├── button.tsx
│       ├── input.tsx
│       └── label.tsx
├── hooks/
│   └── useKolaWallet.ts                 # API functions
└── constants/
    └── index.ts

docs/
├── FEATURE_GUIDE.md                     # User-facing documentation
└── DEVELOPER_REFERENCE.md               # This file
```

---

## Color Reference

```typescript
const COLORS = {
  organization: {
    primary: "#543c52", // Purple
    hover: "#3d2c3c",
  },
  group: {
    primary: "#0066ff", // Blue
    hover: "#0052cc",
  },
  organizationBadge: {
    bg: "#fef3c7", // Amber 100
    text: "#92400e", // Amber 800
    primary: "#f59e0b", // Amber 500
  },
  collector: {
    primary: "#8b5cf6", // Purple 500
    hover: "#7c3aed", // Purple 600
  },
  collection: {
    primary: "#10b981", // Emerald 500
    hover: "#059669", // Emerald 600
  },
};
```

---

## Version History

- **v1.0** - Initial implementation with all 4 modals, enhanced sections, and 5 hook functions
- **v1.1** - Fixed Dialog component ref forwarding issue
- **v1.2** - Added comprehensive documentation
