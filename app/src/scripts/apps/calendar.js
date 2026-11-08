import {
    Calendar
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
    Draggable
} from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

export const initCalendarApp = () => {
    const calendarEl = document.getElementById('calendar');
    const containerEl = document.getElementById('external-events');
    const addBtn = document.getElementById('add-new-event');
    const inputTitle = document.getElementById('new-event-title');
    const colorBtns = document.querySelectorAll('.color-btn');

    if (!calendarEl) return;

    // State management for new events
    let selectedColor = 'bg-primary';

    // Initialize Draggable functionality
    new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: (eventEl) => ({
            title: eventEl.innerText,
            className: eventEl.getAttribute('data-class')
        })
    });

    // Initialize FullCalendar
    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin],
        themeSystem: 'bootstrap5',
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        editable: true,
        droppable: true,
        drop: (info) => {
            // Remove from list if checkbox is checked
            if (document.getElementById('drop-remove').checked) {
                info.draggedEl.remove();
            }
        },
        events: [{
            title: 'Project Launch',
            start: new Date(),
            className: 'bg-info'
        }]
    });

    calendar.render();

    // Color Picker Logic
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Map button class to background class
            const classes = Array.from(btn.classList);
            const found = classes.find(c => c.startsWith('btn-'));
            selectedColor = found ? found.replace('btn-', 'bg-') : 'bg-primary';
        });
    });

    // Add New Event Logic
    addBtn.addEventListener('click', () => {
        const title = inputTitle.value.trim();
        if (!title) return;

        const newEvent = document.createElement('div');
        // Added 'border-0' to keep it clean with Bootstrap bg classes
        newEvent.className = `fc-event ${selectedColor} border-0 text-white p-2 mb-2 rounded-2 cursor-move`;
        newEvent.setAttribute('data-class', selectedColor);
        newEvent.innerText = title;

        containerEl.prepend(newEvent);
        inputTitle.value = '';
    });
};