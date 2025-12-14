# Organizations & Groups Feature Guide

## Overview

This feature enables microfinance organizations to create groups with collectors who can register manual transactions. The system implements multi-level calculations impacting users, collectors, and organizations.

---

## Key Concepts

### Organizations

Business entities (microfinance, cooperatives, NGOs) that can create organization-backed groups with collector functionality.

### Groups

- **Regular Groups**: Standard savings groups
- **Organization Groups**: Groups backed by an organization with collector support (marked with amber badge)

### Collectors

Staff members who register manual transactions for organization groups. Each collector has performance metrics tracked.

---

## User Features

### 1. Create Organization

**Location:** Growth > Business Section

**Steps:**

1. Click "Create Organization" button
2. Fill in organization details:
   - Name (required)
   - Description (optional)
   - Category: Microfinance, Cooperative, NGO, Community Group, Business, Other
3. Submit to create

**Styling:** Purple theme (#543c52)

### 2. Create Group

**Location:** Growth > Groups Section

**Steps:**

1. Click "Create Group" button
2. Fill in group details:
   - Name (required)
   - Description (optional)
3. Toggle "Organization Group" (microfinance users only)
4. Submit to create

**Styling:** Blue theme (#0066ff)
**Badge:** Organization groups display amber badge (#f59e0b)

### 3. Manage Collectors

**Available for:** Organization groups only

**Steps:**

1. Click "Collectors" button on organization group card
2. View collector statistics:
   - Total collectors
   - Total amount collected
   - Number of transactions
3. Add new collector:
   - Enter collector ID
   - Select role (Collector or Co-Lead)
4. Remove collector (with confirmation)

**Styling:** Purple theme (#8b5cf6)

### 4. Register Manual Collection

**Available for:** Organization groups with collectors

**Steps:**

1. Click "Collection" button on organization group card
2. Select collector from dropdown
3. Enter collection details:
   - Amount (required, formatted with currency)
   - Collection date
   - Notes (optional)
4. Submit to register

**Impact shown:**

- Member goals progress
- Collector performance metrics
- Organization total collections
- Group growth statistics

**Styling:** Emerald theme (#10b981)

---

## Visual Indicators

### Color Themes

- **Organizations**: Purple (#543c52)
- **Groups**: Blue (#0066ff)
- **Organization Badge**: Amber (#f59e0b)
- **Collectors**: Purple (#8b5cf6)
- **Collections**: Emerald (#10b981)

### Group Card Features

Organization groups display:

- Amber "Organization Group" badge with Building2 icon
- "Collectors" button (purple)
- "Collection" button (emerald)

Regular groups display:

- Standard group information
- No collector or collection buttons

---

## Calculations

### Multi-Level Impact

When a collection is registered:

1. **User Level**

   - Updates individual savings goals
   - Tracks personal contribution history

2. **Collector Level**

   - Increments total collections
   - Updates performance metrics
   - Tracks collection count

3. **Organization Level**

   - Aggregates total collected amount
   - Tracks all transactions
   - Calculates organization-wide metrics

4. **Group Level**
   - Updates group balance
   - Tracks growth over time
   - Maintains transaction history

---

## User Roles

### Regular User

- Create and join groups
- View own groups and organizations

### Microfinance User

- All regular user capabilities
- Create organization-backed groups
- Assign collectors
- View collector performance

### Collector

- Register manual collections
- View assigned groups
- Track personal collection performance

---

## Workflow Examples

### Example 1: Microfinance Creates Organization Group

1. User (microfinance) creates organization
2. User creates group with "Organization Group" enabled
3. Group displays with amber badge
4. User clicks "Collectors" to add staff
5. User adds collectors with their IDs
6. Collectors can now register collections

### Example 2: Collector Registers Transaction

1. Collector logs in
2. Views assigned organization group
3. Clicks "Collection" button
4. Selects their name from dropdown
5. Enters amount and date
6. Adds notes about transaction
7. Submits collection
8. System calculates impact across all levels
9. Dashboard updates with new metrics

### Example 3: Regular User Creates Standard Group

1. User creates group
2. Leaves "Organization Group" toggle off
3. Group displays without badge
4. No collector or collection buttons shown
5. Group functions as regular savings group

---

## Technical Implementation

### Components

- `CreateOrganizationModal.tsx` - Organization creation
- `CreateGroupModal.tsx` - Group creation with org flag
- `CollectorManagementModal.tsx` - Collector CRUD operations
- `ManualCollectionModal.tsx` - Collection registration

### Enhanced Sections

- `BusinessSection.tsx` - Organization management
- `GroupsSection.tsx` - Group display with conditional features
- `Growth.tsx` - Main container passing functions

### Hook Functions (useKolaWallet.ts)

- `createOrganization(data)` - POST /organization
- `createGroup(data)` - POST /group
- `addCollector(groupId, data)` - POST /group/{id}/collector
- `removeCollector(groupId, collectorId)` - DELETE /group/{id}/collector/{id}
- `registerCollection(groupId, collectorId, data)` - POST /group/{id}/collection

---

## Future Enhancements

- Collector permissions and access control
- Collection approval workflow
- Advanced analytics dashboard
- Export collection reports
- Automated reminder system
- Mobile app integration
- Bulk collection import
- Performance-based rewards

---

## Troubleshooting

### Modal Not Opening

- Check browser console for errors
- Verify Dialog component has proper ref forwarding
- Ensure state management is working (showModal toggles)

### Collection Not Registering

- Verify collector is assigned to group
- Check group has organization flag enabled
- Ensure API endpoint is accessible
- Validate form data is complete

### Badge Not Showing

- Confirm group has `isOrganizationGroup: true`
- Check conditional rendering logic
- Verify amber styling (#f59e0b) is applied

---

## Support

For issues or questions:

1. Check browser console for errors
2. Verify API endpoints are responding
3. Confirm user has proper role/permissions
4. Review component props are passed correctly
