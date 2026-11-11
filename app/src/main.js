// 0. BOOTSTRAP GLOBALS (Must be absolute first)
import $ from './scripts/core/jquery-setup.js';

// 1. PROJECT STYLES (Direct imports for Vite bundling)
import 'animate.css/animate.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import 'air-datepicker/air-datepicker.css';
import 'timedropper/timedropper.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'plyr/dist/plyr.css';
import './scss/vendors/vendors.scss';
import './scss/admin-bundle.scss';

// 2. OTHER VENDOR JS
import * as bootstrap from 'bootstrap';
import * as Popper from '@popperjs/core';
import Plyr from 'plyr';
import AirDatepicker from 'air-datepicker';
import './scripts/plugins/timedropper-patched.js';

// 4. EXPOSE GLOBALS
window.Popper = Popper;
window.bootstrap = bootstrap;
window.AirDatepicker = AirDatepicker;

// 5. CORE & UTILITIES
import { initXivig } from './scripts/core/xivig-core.js';
import UiController from './scripts/core/ui-controller.js';
import NotificationService from './scripts/components/sweet-alert.js';
import { initPreloader } from './scripts/core/preloader.js';
import { initSidebar } from './scripts/core/sidebar.js';
import { initSettings } from './scripts/core/settings.js';
import { initMobileController } from './scripts/core/mobile-controller.js';

// 6. FEATURES & APPS
import { initNotificationSelect } from './scripts/components/notification-manager.js';
import { initLightbox, initGalleryFilter } from './scripts/components/lightbox.js';
import { initPricingToggle } from './scripts/components/pricing.js';
import { initKanban } from './scripts/apps/Kanban.js';
import { initChatSearch } from './scripts/apps/chat-search.js';
import { initMailSelection } from './scripts/apps/mail-logic.js';
import { initMediaPlayers } from './scripts/components/video-player.js';
import { initSearchApp } from './scripts/apps/search.js';
import { initCalendarApp } from './scripts/apps/calendar.js';
import { initIconApp } from './scripts/apps/fontawesome-logic.js';
import { initIconFilter, initIconCopy } from './scripts/apps/bs-icon.js';
import { initHelpSupport } from './scripts/pages/help-support.js';
import { initAccountOnboarding } from './scripts/pages/account-onboarding.js';
import { initAccountSettings } from './scripts/pages/account-settings.js';
import { initAdvancedComponents } from './scripts/components/advanced-components.js';
import { initFormPickers } from './scripts/forms/form-pickers.js';
import { initFormAdv } from './scripts/forms/form-adv.js';
import { initVectorMap } from './scripts/components/vector-map.js';
import { initStoreSettings } from './scripts/pages/store-settings.js';
import { initTaskManager } from './scripts/apps/task-manager.js';
import { NotificationBadge } from './scripts/components/notification-badge.js';
import { initLandingPage } from './scripts/pages/landing.js';
import { initDataTables } from './scripts/components/data-table.js';
import { initDashboard } from './scripts/pages/dashboard.js';
import { initFormWizard } from './scripts/forms/form-wizard.js';
import { initImageCropper, initImageDropzone, initSummernote } from './scripts/forms/form-plugins.js';
import { initMaintenance } from './scripts/pages/maintenance.js';
import { initAnalyticsOverview } from './scripts/pages/analytics.js';
import { initSystemMetrics } from './scripts/pages/system-metrics.js';
import { initDashboardV2 } from './scripts/pages/dashboard-v2.js';
import { initAdminSettings } from './scripts/pages/admin-settings.js';

// 7. CHARTS
import { EChartModule } from './scripts/charts/echart.js';
import ChartManager from './scripts/charts/chart-manager.js';
import HighchartManager from './scripts/charts/highchart-manager.js';
import ApexchartManager from './scripts/charts/apexchart-manager.js';

// Global reference for legacy scripts
window.NotificationService = NotificationService;

const App = {
    init() {
        try {
            // Start preloader logic immediately
            initPreloader();

            initXivig();
            UiController.init();
            initSidebar();
            initSettings();
            initMobileController();
            
            // App Modules
            initNotificationSelect();
            initLightbox();
            initGalleryFilter();
            initPricingToggle();
            initKanban();
            initChatSearch();
            initMailSelection();
            initSearchApp();
            initCalendarApp();
            
            // Icon Systems
            initIconApp();
            initIconFilter('filter_input', 'bsIconContainer');
            
            // New Modules
            initHelpSupport();
            initAccountOnboarding();
            initAccountSettings();
            initAdvancedComponents();
            initFormPickers();
            initFormAdv();
            initVectorMap();
            initStoreSettings();
            initTaskManager();
            initLandingPage();
            initDataTables();

            // Form & Plugin initializations
            initFormWizard();
            initImageCropper();
            initImageDropzone();
            initMaintenance();
            initAnalyticsOverview();
            initSystemMetrics();
            initDashboardV2();
            initAdminSettings();
            
            // Initialize Modular Notification Badge
            window.headerBadge = new NotificationBadge('header-notification-badge');
            
            if (window.AOS) {
                AOS.init({ duration: 1000, once: true, offset: 50 });
            }
            
            initMediaPlayers();
            initNotifications();
            Dashboard.init();

        } catch (error) {
            console.error("❌ App Initialization Failed:", error);
        }
    }
};

const initNotifications = () => {
    const selectors = {
        'sa-basic': () => NotificationService.basic('Elite Notification', 'This is a clean, modular alert.'),
        'sa-success': () => NotificationService.success('Task Finished', 'Data synchronized successfully.'),
        'sa-error': () => NotificationService.error('System Error', 'Unable to reach the secure server.'),
        'sa-warning': () => {
            NotificationService.confirm('Delete Record?', 'This action is permanent.')
                .then(res => res.isConfirmed && NotificationService.success('Deleted', 'File removed.'));
        },
        'custom-html-alert': () => NotificationService.basic('Rich Content', 'You can use <b>HTML</b> and <br> custom layouts.'),
        'ajax-alert': () => {
            const mockApi = () => new Promise(resolve => setTimeout(resolve, 2500));
            NotificationService.loader('Fetching Data', 'Talking to Xivig API...', mockApi);
        }
    };
    Object.entries(selectors).forEach(([id, action]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', action);
    });
};

const Dashboard = {
    state: { chartjs: {}, echarts: {}, highcharts: {}, apexcharts: {} },
    init() {
        // 1. Initialize the specialized modular dashboard (index.html)
        try {
            initDashboard();
        } catch (e) {
            console.warn("⚠️ Modular Dashboard init skipped or failed:", e);
        }

        // 2. Initialize generic chart managers for dedicated chart pages
        try {
            const safeInit = (name, initFn) => {
                try { 
                    return initFn(); 
                } catch (e) { 
                    // Only warn if we are actually on a page that likely contains these charts
                    return {}; 
                }
            };
            
            this.state.chartjs = safeInit('Chart.js', () => ChartManager.initAll());
            this.state.echarts = safeInit('ECharts', () => EChartModule.initAll());
            this.state.highcharts = safeInit('Highcharts', () => HighchartManager.initAll());
            this.state.apexcharts = safeInit('ApexCharts', () => ApexchartManager.initAll());
            
        } catch (error) {
            console.error('❌ Charts initialization failure:', error);
        }
    }
};

const onReady = (callback) => {
    if (document.readyState === 'loading') {
        window.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
        callback();
    }
};

onReady(() => {
    App.init();
});

window.App = App;
window.Dashboard = Dashboard;
