/**
 * SearchModule - Encapsulates search logic and UI updates
 */
export const initSearchApp = () => {
    const config = {
        debounceTime: 300,
        minQueryLength: 2,
    };

    const ui = {
        input: document.getElementById('liveSearch'),
        results: document.getElementById('searchResults'),
        loader: document.getElementById('searchLoader'),
    };

    // Safety check: stop if elements don't exist on the current page
    if (!ui.input || !ui.results) return;

    // --- Private Methods ---
    const toggleLoader = (show) => {
        show ? ui.loader.classList.remove('d-none') : ui.loader.classList.add('d-none');
    };

    const getEmptyStateHTML = (message = "Start typing to see results...") => `
        <div class="list-group-item border-0 py-5 text-center text-muted bg-white">
            <i class="bi bi-cursor fs-1 opacity-25 d-block mb-3"></i>
            ${message}
        </div>`;

    const fetchData = async (query) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const mockDatabase = [{
                title: "Inbox - Alexander Pierce",
                category: "Messages",
                icon: "bi-envelope"
            },
            {
                title: "Project Xivig Documentation",
                category: "Files",
                icon: "bi-file-earmark-pdf"
            },
            {
                title: "Dashboard Style 2",
                category: "Pages",
                icon: "bi-layout-sidebar"
            }
        ];
        return mockDatabase.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    };

    const resultTemplate = (item) => `
        <a href="#" class="list-group-item list-group-item-action border-0 py-3 px-4 result-item bg-white">
            <div class="d-flex align-items-center">
                <div class="bg-light p-2 rounded-3 me-3 text-primary">
                    <i class="bi ${item.icon} fs-5"></i>
                </div>
                <div>
                    <h6 class="mb-0 fw-bold">${item.title}</h6>
                    <small class="text-muted text-uppercase fw-semibold" style="font-size: 0.65rem;">${item.category}</small>
                </div>
                <i class="bi bi-chevron-right ms-auto text-muted small"></i>
            </div>
        </a>`;

    const renderResults = (data) => {
        if (data.length === 0) {
            ui.results.innerHTML = getEmptyStateHTML("No matches found.");
            return;
        }
        ui.results.innerHTML = data.map(item => resultTemplate(item)).join('');
    };

    const handleSearch = async (query) => {
        if (query.length < config.minQueryLength) {
            ui.results.innerHTML = getEmptyStateHTML();
            return;
        }

        toggleLoader(true);
        try {
            const results = await fetchData(query);
            renderResults(results);
        } catch (error) {
            ui.results.innerHTML = getEmptyStateHTML("An error occurred.");
        } finally {
            toggleLoader(false);
        }
    };

    // --- The "Working" Part ---
    let debounceTimer;
    ui.input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => handleSearch(query), config.debounceTime);
    });
};