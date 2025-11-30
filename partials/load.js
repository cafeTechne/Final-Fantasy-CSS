// Simple async loader for HTML partials
async function loadPartial(id, url) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id "${id}" not found.`);
        return;
    }
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Failed to load ${url}: ${resp.statusText}`);
        const html = await resp.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(error);
        element.innerHTML = `<div class="ff-alert ff-alert-error">
            <strong>Error loading component:</strong> ${url}<br>
            <small>If you are viewing this file locally, you must use a local server (e.g., python -m http.server) because <code>fetch()</code> does not work with <code>file://</code> protocol.</small>
        </div>`;
    }
}

// Check for file protocol
if (window.location.protocol === 'file:') {
    const errorMsg = `
        <div class="ff-window" style="position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:9999; max-width:90%;">
            <div class="ff-window-content">
                <div class="ff-alert ff-alert-error">
                    <h3>⚠️ Local File Access Detected</h3>
                    <p>This page uses <code>fetch()</code> to load components, which is blocked by browsers when opening files directly (file://).</p>
                    <p><strong>Please run a local server:</strong></p>
                    <pre style="background:#000; padding:10px; border-radius:4px;">python -m http.server 8000</pre>
                    <p>Then open <a href="http://localhost:8000">http://localhost:8000</a></p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', errorMsg);
}

// List of placeholders -> partial files
const parts = [
    { id: 'header', url: 'partials/header.html' },
    { id: 'dropdown', url: 'partials/dropdown-tooltip.html' },
    { id: 'listPag', url: 'partials/list-pagination.html' },
    { id: 'accordion', url: 'partials/accordion.html' },
    { id: 'avatarBtn', url: 'partials/avatar-buttons.html' },
    { id: 'spinner', url: 'partials/spinner.html' },
    { id: 'tableCtrl', url: 'partials/table-controls.html' },
    { id: 'gameComp', url: 'partials/game-components.html' },
    { id: 'forms', url: 'partials/forms.html' },
    { id: 'save-modal', url: 'partials/modal.html' }
];

// Load all partials
Promise.all(parts.map(p => loadPartial(p.id, p.url)))
    .then(() => {
        console.log('All partials loaded.');
        // Dispatch a custom event in case other scripts are waiting
        document.dispatchEvent(new Event('partials-loaded'));
    });
