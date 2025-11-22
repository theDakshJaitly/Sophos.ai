# Walkthrough - Restored Remote Control Pattern
I have successfully restored the "Remote Control" pattern for the dashboard navigation and view management.

## Changes Implemented

### 1. State Management (`DashboardContext.tsx`)
- **Restored**: Recreated the context to manage `activeMode` ('workflow', 'chat', 'notes', 'quiz') and `workflowSubView` ('graph', 'timeline', 'plan').

### 2. Navigation Launchpad (`RightPanel.tsx`)
- **Updated**: Transformed the Right Panel into a navigation launchpad.
- **Features**:
  - Preserved file upload area.
  - Added navigation buttons for "Workflow", "Chat", "Notes", and "Quiz".
  - Clicking these buttons updates the `activeMode` in the global context.

### 3. Main Content Area (`MainContent.tsx`)
- **Refactored**: Implemented the "Remote Control" logic.
- **Behavior**:
  - Renders the appropriate component based on `activeMode`.
  - Displays the `LensSwitcher` in the header only when `activeMode` is 'workflow'.
  - Removed the old Tabs structure.

### 4. Workflow Views (`WorkflowTab.tsx`, `LensSwitcher.tsx`)
- **Updated**: `WorkflowTab` now accepts a `viewMode` prop.
- **New Components**:
  - `LensSwitcher`: A toggle for switching between Graph, Timeline, and Plan views.
  - `TimelineView` & `PlanView`: Placeholder components for future implementation.

### 5. Feature Tabs (`ChatTab.tsx`, `QuizTab.tsx`)
- **Restored**: Ensured both components are using the correct `getApiUrl` helper and `axios` implementation to avoid 404 errors.

## Verification
- **Navigation**: Clicking buttons in the Right Panel should switch the view in the Main Content area.
- **Workflow Switching**: In "Workflow" mode, using the top header switcher should toggle between Graph, Timeline, and Plan views.
- **Chat & Quiz**: These features should function correctly without 404 errors.
