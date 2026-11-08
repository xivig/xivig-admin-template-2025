/**
 * Advanced Form Components & Grid Architect Module
 */
export const initFormAdv = () => {
    // --- 1. Advanced Forms Logic ---
    const formAdvModule = document.querySelector('.form-adv-module');
    if (formAdvModule) {
        // Collapse Icon Toggles
        const collapseElements = formAdvModule.querySelectorAll('.btn-collapse');
        collapseElements.forEach(btn => {
            btn.addEventListener('click', function () {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('bi-chevron-up');
                    icon.classList.toggle('bi-chevron-down');
                }
            });
        });

        // Input Masks (Cleave.js)
        if (window.Cleave) {
            const maskDate = document.getElementById('maskDate');
            if (maskDate) new Cleave('#maskDate', {date: true, delimiter: '/', datePattern: ['M', 'D', 'Y']});
            
            const maskPhone = document.getElementById('maskPhone');
            if (maskPhone) new Cleave('#maskPhone', {phone: true, phoneRegionCode: 'US'});
            
            const maskCreditCard = document.getElementById('maskCreditCard');
            if (maskCreditCard) new Cleave('#maskCreditCard', {creditCard: true});
            
            const maskTaxId = document.getElementById('maskTaxId');
            if (maskTaxId) new Cleave('#maskTaxId', {blocks: [2, 7], delimiter: '-'});
            
            const maskSerial = document.getElementById('maskSerial');
            if (maskSerial) new Cleave('#maskSerial', {blocks: [3, 3, 3], delimiter: '-', uppercase: true});
        }

        // Range Sliders
        const sliders = [
            {id: 'sliderPrice', tooltipId: 'tooltipPrice', prefix: '$', suffix: ''},
            {id: 'sliderPercentage', tooltipId: 'tooltipPercentage', prefix: '', suffix: '%'},
            {id: 'sliderAge', tooltipId: 'tooltipAge', prefix: '', suffix: ' yrs'},
            {id: 'sliderTemp', tooltipId: 'tooltipTemp', prefix: '', suffix: '°C'},
            {id: 'sliderTime', tooltipId: 'tooltipTime', prefix: '', suffix: ''},
            {id: 'sliderMemory', tooltipId: 'tooltipMemory', prefix: '', suffix: ' GB'}
        ];

        function updateTooltip(slider, tooltip, prefix = '', suffix = '') {
            const val = parseInt(slider.value);
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            const percent = (val - min) / (max - min);

            let displayVal = val;
            if (slider.id === 'sliderTime') {
                displayVal = val.toString().padStart(2, '0') + ':00';
            } else if (slider.id === 'sliderTemp') {
                displayVal = (val > 0 ? '+' : '') + val;
            }

            tooltip.textContent = prefix + displayVal + suffix;
            tooltip.style.left = `calc(${percent * 100}% + (${8 - percent * 16}px))`;
        }

        sliders.forEach(item => {
            const slider = document.getElementById(item.id);
            const tooltip = document.getElementById(item.tooltipId);
            if (slider && tooltip) {
                updateTooltip(slider, tooltip, item.prefix, item.suffix);
                slider.addEventListener('input', () => updateTooltip(slider, tooltip, item.prefix, item.suffix));
            }
        });

        // Gauges Logic
        function setGaugeValue(gaugeItemSelector, value, max = 100) {
            const gaugeItem = document.querySelector(gaugeItemSelector);
            if (!gaugeItem) return;
            
            const circle = gaugeItem.querySelector('.progress-circle');
            if (!circle) return;

            const rAttr = circle.getAttribute('r');
            const radius = rAttr ? parseFloat(rAttr) : 45;
            const total = 2 * Math.PI * radius;
            
            // 1. Initial State: Set dasharray and start at full offset (empty)
            circle.style.transition = 'none'; 
            circle.style.strokeDasharray = total;
            circle.style.strokeDashoffset = total;

            // 2. Force reflow to ensure the browser registers the initial state
            circle.getBoundingClientRect();

            // 3. Target State: Calculate offset and apply with transition
            const percentage = Math.min(Math.max(value / max, 0), 1);
            const offset = total - (total * percentage);
            
            circle.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            circle.style.strokeDashoffset = offset;
            
            const valueEl = gaugeItem.querySelector('.gauge-value');
            if (valueEl) {
                let unit = '';
                if (gaugeItemSelector.includes('progress') || gaugeItemSelector.includes('score')) {
                    unit = '<span class="gauge-unit">%</span>';
                } else if (gaugeItemSelector.includes('temperature')) {
                    unit = '<span class="gauge-unit">°C</span>';
                } else if (gaugeItemSelector.includes('rating')) {
                    unit = '<span class="gauge-unit">/10</span>';
                }
                valueEl.innerHTML = value + unit;
            }
        }

        // Initialize Gauges
        setTimeout(() => {
            console.log("📐 Initializing System Biometrics...");
            setGaugeValue('.gauge-progress', 75);
            setGaugeValue('.gauge-performance', 45);
            setGaugeValue('.gauge-score', 88);
            setGaugeValue('.gauge-temperature', 22, 50);
            setGaugeValue('.gauge-rating', 7, 10);
        }, 300);

        // Color Pickers (Pickr)
        if (window.Pickr) {
            function createPickr(el, color, theme = 'classic', showOpacity = false) {
                const element = document.querySelector(el);
                if (!element) return;
                
                const pickr = Pickr.create({
                    el: el,
                    theme: theme,
                    default: color,
                    swatches: theme === 'nano' ? ['#ff4444', '#ffbb33', '#00C851', '#33b5e5'] : null,
                    components: {
                        preview: true,
                        opacity: showOpacity,
                        hue: true,
                        interaction: {
                            hex: true,
                            rgba: true,
                            input: true,
                            clear: false,
                            save: true
                        }
                    }
                });
                pickr.on('save', (color, instance) => {
                    const input = element.parentElement.querySelector('input');
                    if (input) input.value = showOpacity ? color.toRGBA().toString(0) : color.toHEXA().toString();
                    instance.hide();
                });
            }

            createPickr('#classicPickr', '#5367ce');
            createPickr('#monolithPickr', '#e91e63', 'monolith');
            createPickr('#nanoPickr', '#ff9800', 'nano');
            createPickr('#opacityPickr', 'rgba(156, 39, 176, 1)', 'classic', true);
            createPickr('#swatchesPickr', '#4caf50');
            createPickr('#formatsPickr', '#2196f3');
        }

        // Date & Time Pickers (Flatpickr)
        if (window.flatpickr) {
            flatpickr("#pickerDateTime", {enableTime: true, dateFormat: "Y-m-d H:i"});
            flatpickr("#pickerDate", {dateFormat: "Y-m-d"});
            flatpickr("#pickerTime", {enableTime: true, noCalendar: true, dateFormat: "H:i"});
            const startPicker = flatpickr("#pickerStart", {
                dateFormat: "Y-m-d",
                onChange: function (selectedDates, dateStr, instance) {
                    if (endPicker) endPicker.set('minDate', dateStr);
                }
            });
            const endPicker = flatpickr("#pickerEnd", {
                dateFormat: "Y-m-d",
                onChange: function (selectedDates, dateStr, instance) {
                    if (startPicker) startPicker.set('maxDate', dateStr);
                }
            });
        }
    }

    // --- 2. Grid Architect Logic ---
    const gridArchitect = document.querySelector('.grid-architect');
    if (gridArchitect) {
        window.setBreakpoint = function(bpClass, btn) {
            document.querySelectorAll('.bp-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const rows = ['dynamicRow1', 'dynamicRow2', 'dynamicRow3', 'dynamicRow4'];
            rows.forEach(rowId => {
                const container = document.getElementById(rowId);
                if (!container) return;
                const cols = container.children;
                for (let col of cols) {
                    const currentNum = col.className.match(/\d+/)[0];
                    col.className = `${bpClass}-${currentNum} grid-anim`;
                    col.style.animation = 'none';
                    col.offsetHeight; 
                    col.style.animation = null;
                }
            });

            const label = bpClass.split('-')[1].toUpperCase();
            const labelEl = document.getElementById('active-bp-label');
            if (labelEl) labelEl.innerText = `Active: ${label} Breakpoint`;
        };

        // 3D tilt effect
        document.querySelectorAll('.grid-box').forEach(box => {
            box.addEventListener('mousemove', (e) => {
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            box.addEventListener('mouseleave', () => {
                box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });
        });
    }
};
