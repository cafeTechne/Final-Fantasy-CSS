/**
 * Final Fantasy CSS - Interactive Components
 * JavaScript behaviors for dropdowns, modals, tooltips, etc.
 */

// Party member data for each game
const partyMembers = {
    'theme-ff1': { char: 'Warrior of Light', p2: 'Fighter', p3: 'Monk' },
    'theme-ff4': { char: 'Cecil', p2: 'Kain', p3: 'Rosa' },
    'theme-ff6': { char: 'Terra', p2: 'Locke', p3: 'Edgar' },
    'theme-ff7': { char: 'Cloud', p2: 'Tifa', p3: 'Barret' },
    'theme-ff8': { char: 'Squall', p2: 'Rinoa', p3: 'Zell' },
    'theme-ff9': { char: 'Zidane', p2: 'Vivi', p3: 'Garnet' },
    'theme-ff13': { char: 'Lightning', p2: 'Snow', p3: 'Hope' },
    'theme-ff15': { char: 'Noctis', p2: 'Prompto', p3: 'Gladiolus' }
};

// Theme Switcher
function setTheme(themeName, charName) {
    const root = document.getElementById('app-root');
    if (!root) return;

    // Remove all theme classes
    root.className = 'showcase-area ' + themeName;

    // Get party data for this theme
    const party = partyMembers[themeName];

    if (party) {
        // Update all character name elements
        const charElements = document.querySelectorAll('[id^="char-name"]');
        charElements.forEach(el => {
            el.innerText = party.char;
        });

        // Update party members
        const p2 = document.getElementById('party-member-2');
        const p3 = document.getElementById('party-member-3');
        if (p2) p2.innerText = party.p2;
        if (p3) p3.innerText = party.p3;
    } else if (charName) {
        // Fallback to just updating character name
        const charElements = document.querySelectorAll('[id^="char-name"]');
        charElements.forEach(el => {
            el.innerText = charName;
        });
    }

    // Show/hide game-specific components
    const materiaSection = document.getElementById('materia-section');
    const junctionSection = document.getElementById('junction-section');

    if (materiaSection) {
        materiaSection.style.display = (themeName === 'theme-ff7') ? 'block' : 'none';
    }

    if (junctionSection) {
        junctionSection.style.display = (themeName === 'theme-ff8') ? 'block' : 'none';
    }
}

// Modal Functions
function showModal(modalId) {
    modalId = modalId || 'save-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    modalId = modalId || 'save-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Dropdown Functions
function toggleDropdown(dropdownId) {
    dropdownId = dropdownId || 'demo-dropdown';
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Single delegated click handler for dropdowns, modals, and close buttons
document.addEventListener('click', function (event) {
    // Handle elements that use data-action attributes (delegated)
    const actionEl = event.target.closest('[data-action]');
    if (actionEl) {
        const action = actionEl.dataset.action;
        switch (action) {
            case 'set-theme':
                if (actionEl.dataset.theme) setTheme(actionEl.dataset.theme);
                break;
            case 'show-modal':
                showModal(actionEl.dataset.modal || undefined);
                break;
            case 'hide-modal':
                hideModal(actionEl.dataset.modal || undefined);
                break;
            case 'toggle-dropdown':
                toggleDropdown(actionEl.dataset.target || undefined);
                break;
            case 'toggle-nav':
                // Toggle the responsive navbar expansion state
                const navbar = actionEl.closest('.ff-navbar');
                if (navbar) navbar.classList.toggle('expanded');
                // Toggle aria-expanded on the control when present
                if (actionEl.hasAttribute && actionEl.hasAttribute('aria-expanded')) {
                    const isExp = actionEl.getAttribute('aria-expanded') === 'true';
                    actionEl.setAttribute('aria-expanded', String(!isExp));
                }
                break;
            case 'load-game':
                console.log('Load game (demo)');
                break;
            default:
                // unknown action
                break;
        }

        // If we handled an explicit action, stop further processing
        return;
    }

    // Close dropdowns when clicking outside any .ff-dropdown
    if (!event.target.closest('.ff-dropdown')) {
        document.querySelectorAll('.ff-dropdown.show').forEach(dropdown => dropdown.classList.remove('show'));
    }

    // If the click originated on a dropdown toggle, let the toggle handler run and don't proceed
    if (event.target.closest('.ff-dropdown-toggle')) {
        return;
    }

    // Close modal when clicking the backdrop
    if (event.target.classList && event.target.classList.contains('ff-modal-backdrop')) {
        event.target.classList.remove('show');
        return;
    }

    // Alert / close buttons
    if (event.target.classList && event.target.classList.contains('ff-close-btn')) {
        const alert = event.target.closest('.ff-alert');
        if (alert) alert.style.display = 'none';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Final Fantasy CSS initialized');
});
