# JavaScript Architecture & Modularization Guide

This project uses a modular, function-based JavaScript architecture designed for high performance and maintainability. It follows a clear separation of concerns, grouping logic by its role in the application.

## 📂 Directory Structure

All JavaScript logic is located in `app/src/scripts/`.

### 1. `core/`
The "engine" of the application. These scripts handle global UI behavior and bootstrapping.
- `jquery-setup.js`: Handles global jQuery exposure.
- `sidebar.js`: Responsive toggling and accordion menu logic.
- `preloader.js`: Initial page loading screen logic.
- `ui-controller.js`: Manages standard UI interactions.
- `settings.js`: Persistent theme and sidebar configuration.

### 2. `components/`
Reusable UI building blocks and specialized plugin integrations.
- `data-table.js`: Elite DataTables initialization and configuration.
- `sweet-alert.js`: Specialized notification service.
- `lightbox.js`: Image and gallery interaction.
- `video-player.js`: Plyr integration and overrides.

### 3. `apps/`
Complex, feature-rich modules that function as stand-alone applications within the dashboard.
- `chat-search.js`: Real-time filtering for the chat system.
- `kanban.js`: Drag-and-drop task management.
- `mail-logic.js`: Inbox selection and orchestration.
- `task-manager.js`: Functional task tracking.

### 4. `forms/`
Advanced form handling and specialized inputs.
- `form-wizard.js`: Multi-step process orchestration.
- `form-pickers.js`: Date, color, and time picker initialization.
- `form-adv.js`: Select2, Masks, and specialized input logic.

### 5. `pages/`
One-off logic tied strictly to specific views.
- `dashboard.js`: The primary analytical dashboard initialization.
- `account-onboarding.js`: Multi-step user registration flow.
- `landing.js`: Logic for the external-facing landing page.

### 6. `charts/`
Abstraction layers for third-party charting libraries.
- `apexchart-manager.js`
- `echart.js`
- `highchart-manager.js`
- `chart-manager.js` (Chart.js)

---

## 🏗 Coding Standards

### File Naming
We strictly use **kebab-case** for all filenames (e.g., `account-settings.js`). This ensures cross-platform reliability and prevents case-sensitivity bugs.

### The Initialization Pattern
Most modules export a named constant function (usually prefixed with `init`) to prevent polluting the global namespace:

```javascript
// app/src/scripts/components/my-component.js
export const initMyComponent = () => {
    const el = document.getElementById('my-element');
    if (!el) return; // Safety check: prevent errors on pages without this element
    
    // logic here...
};
```

---

## 🚀 The Entry Point (`app/src/main.js`)

`main.js` is the primary orchestrator. Its responsibilities include:
1.  **Importing Vendors**: Loading Bootstrap, jQuery, and CSS manifests.
2.  **Importing Modules**: Gathering all functional logic from the sub-directories.
3.  **Bootstrapping**: Running the `App.init()` method when the DOM is ready.

### Adding a New Script
1.  Create your file in the appropriate sub-folder (e.g., `app/src/scripts/apps/my-app.js`).
2.  Export an initialization function.
3.  Import and call it in `app/src/main.js`.

---

## 🛠 Global Exposures
While we use ES Modules, some legacy plugins require global exposure. These are explicitly defined in `main.js`:
- `window.bootstrap`
- `window.jQuery` / `window.$`
- `window.NotificationService`
