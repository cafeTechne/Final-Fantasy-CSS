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

    // Also apply theme class to body so overlays/modals pick it up
    if (document && document.body) {
        const toRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-ff'));
        toRemove.forEach(c => document.body.classList.remove(c));
        document.body.classList.add(themeName);
    }

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
// Modal Functions (Native <dialog>)
function showModal(modalId) {
    modalId = modalId || 'save-modal';
    const modal = document.getElementById(modalId);
    if (modal && modal.showModal) {
        modal.showModal();
        modal.classList.add('show'); // Keep for any legacy CSS hooks if needed
    }
}

function hideModal(modalId) {
    modalId = modalId || 'save-modal';
    const modal = document.getElementById(modalId);
    if (modal && modal.close) {
        // Add closing class for animation
        modal.classList.add('closing');

        // Wait for animation to finish before closing
        modal.addEventListener('animationend', function () {
            modal.classList.remove('closing');
            modal.classList.remove('show');
            modal.close();
        }, { once: true });
    }
}

// Close dialog when clicking backdrop
document.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIALOG') {
        const rect = event.target.getBoundingClientRect();
        const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX && event.clientX <= rect.left + rect.width);

        if (!isInDialog) {
            hideModal(event.target.id);
        }
    }
});

// Close dropdown when clicking a portal/backdrop outside
document.addEventListener('pointerdown', function (event) {
    const isDropdown = event.target.closest('.ff-dropdown, .ff-dropdown-menu, .ff-dropdown-backdrop');
    if (!isDropdown && document.querySelector('.ff-dropdown.show')) {
        closeAllDropdowns();
    }
});

// Dropdown Functions (desktop anchored, mobile portaled bottom sheet)
const dropdownPortalMap = new WeakMap();
const dropdownMenuMap = new WeakMap();

function isMobileViewport() {
    return window.matchMedia && window.matchMedia('(max-width: 576px)').matches;
}

function portalDropdownMenu(dropdown) {
    if (!dropdown) return null;
    const menu = dropdown.querySelector('.ff-dropdown-menu');
    if (!menu) return null;
    if (dropdownPortalMap.has(menu)) return menu;
    const parent = menu.parentNode;
    const next = menu.nextSibling;
    dropdownPortalMap.set(menu, { parent, next });
    dropdownMenuMap.set(dropdown, menu);
    menu.classList.add('ff-dropdown-portal');
    menu.style.zIndex = '10020';
    menu.style.display = 'block';
    document.body.appendChild(menu);
    return menu;
}

function restoreDropdownMenu(menu, fallbackParent) {
    if (!menu) return;
    menu.classList.remove('ff-dropdown-portal');
    resetDropdownMenuStyles(menu);
    const meta = dropdownPortalMap.get(menu);
    if (meta && meta.parent) {
        meta.parent.insertBefore(menu, meta.next || null);
    } else if (fallbackParent) {
        fallbackParent.appendChild(menu);
    }
    if (fallbackParent) dropdownMenuMap.delete(fallbackParent);
    dropdownPortalMap.delete(menu);
}

function getDropdownMenu(dropdown) {
    if (!dropdown) return null;
    return dropdown.querySelector('.ff-dropdown-menu') || dropdownMenuMap.get(dropdown) || null;
}

function toggleDropdown(dropdownId) {
    dropdownId = dropdownId || 'demo-dropdown';
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    const menu = getDropdownMenu(dropdown);
    const mobile = isMobileViewport();
    const willShow = !dropdown.classList.contains('show');

    if (willShow) {
        // Only one open at a time
        closeAllDropdowns();

        if (menu) {
            if (mobile) {
                portalDropdownMenu(dropdown);
            } else {
                restoreDropdownMenu(menu, dropdown);
            }
        }
        dropdown.classList.add('show');
        ensureDropdownBackdrop();
        document.dispatchEvent(new CustomEvent('ff:dropdown:show', { detail: { dropdown: dropdown } }));
    } else {
        dropdown.classList.remove('show');
        if (menu) restoreDropdownMenu(menu, dropdown);
        removeDropdownBackdrops();
        document.dispatchEvent(new CustomEvent('ff:dropdown:hide', { detail: { dropdown: dropdown } }));
    }
}

/* Minimal JS API wrappers and event emission for consistency */
function openDropdownById(id) {
    const el = document.getElementById(id);
    if (el) {
        const menu = getDropdownMenu(el);
        if (menu) {
            if (isMobileViewport()) {
                portalDropdownMenu(el);
            } else {
                restoreDropdownMenu(menu, el);
            }
        }
        el.classList.add('show');
        ensureDropdownBackdrop();
        document.dispatchEvent(new CustomEvent('ff:dropdown:show', { detail: { dropdown: el } }));
    }
}
function closeDropdownById(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('show');
        const menu = getDropdownMenu(el);
        if (menu) restoreDropdownMenu(menu, el);
        removeDropdownBackdrops();
        document.dispatchEvent(new CustomEvent('ff:dropdown:hide', { detail: { dropdown: el } }));
    }
}

function openPopover(popoverEl, triggerEl) {
    if (!popoverEl) return;
    popoverEl.classList.add('show');
    document.dispatchEvent(new CustomEvent('ff:popover:show', { detail: { popover: popoverEl, trigger: triggerEl || null } }));
}
function closePopover(popoverEl) {
    if (!popoverEl) return;
    popoverEl.classList.remove('show');
    document.dispatchEvent(new CustomEvent('ff:popover:hide', { detail: { popover: popoverEl } }));
}

function showToastAPI(message, opts) { opts = opts || {}; const t = opts.timeout || 4000; showToast(message, t); }

function resetDropdownMenuStyles(menu) {
    menu.style.position = '';
    menu.style.bottom = '';
    menu.style.left = '';
    menu.style.right = '';
    menu.style.top = '';
    menu.style.margin = '';
    menu.style.width = '';
    menu.style.maxWidth = '';
    menu.style.zIndex = '';
    menu.style.display = '';
}

// Dropdown backdrop helpers (for mobile bottom sheet)
function ensureDropdownBackdrop() {
    // Only show backdrop on mobile-ish viewports to avoid covering desktop dropdowns
    if (window.matchMedia && !window.matchMedia('(max-width: 576px)').matches) return;
    let backdrop = document.querySelector('.ff-dropdown-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'ff-dropdown-backdrop';
        backdrop.addEventListener('click', function () {
            closeAllDropdowns();
        });
        document.body.appendChild(backdrop);
    }
    return backdrop;
}

function removeDropdownBackdrops() {
    document.querySelectorAll('.ff-dropdown-backdrop').forEach(el => {
        try { el.remove(); } catch (e) { /* ignore */ }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.ff-dropdown.show').forEach(dropdown => {
        dropdown.classList.remove('show');
        const menu = getDropdownMenu(dropdown);
        if (menu) {
            resetDropdownMenuStyles(menu);
            restoreDropdownMenu(menu, dropdown);
        }
    });
    removeDropdownBackdrops();
}

// Navbar helpers
function ensureNavbarBackdrop() {
    let backdrop = document.querySelector('.ff-navbar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'ff-navbar-backdrop';
        backdrop.addEventListener('click', closeAllNavbars);
        document.body.appendChild(backdrop);
    }
    return backdrop;
}

function removeNavbarBackdrop() {
    document.querySelectorAll('.ff-navbar-backdrop').forEach(el => {
        try { el.remove(); } catch (e) { /* ignore */ }
    });
}

function closeAllNavbars() {
    document.querySelectorAll('.ff-navbar.expanded').forEach(navbar => {
        navbar.classList.remove('expanded');
        const toggle = navbar.querySelector('[aria-expanded="true"]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
    removeNavbarBackdrop();
}

function toggleNavbar(navbar, toggleEl) {
    if (!navbar) return;
    const shouldExpand = !navbar.classList.contains('expanded');
    if (shouldExpand) {
        navbar.classList.add('expanded');
        if (toggleEl && toggleEl.hasAttribute && toggleEl.hasAttribute('aria-expanded')) {
            toggleEl.setAttribute('aria-expanded', 'true');
        }
        ensureNavbarBackdrop();
    } else {
        navbar.classList.remove('expanded');
        if (toggleEl && toggleEl.hasAttribute && toggleEl.hasAttribute('aria-expanded')) {
            toggleEl.setAttribute('aria-expanded', 'false');
        }
        removeNavbarBackdrop();
    }
}


// Single delegated click handler for dropdowns, modals, and close buttons
document.addEventListener('click', function (event) {
    // FIRST: Handle click-outside-to-close for popovers, dropdowns, and navbars
    // This must run before any handlers that might return early

    // Close all popovers when clicking outside (but not when clicking inside a popover or on a button that toggles one)
    if (!event.target.closest('.ff-popover') && !event.target.closest('.ff-btn')) {
        document.querySelectorAll('.ff-popover.show').forEach(pop => pop.classList.remove('show'));
    }

    // Close dropdowns when clicking outside any .ff-dropdown
    if (!event.target.closest('.ff-dropdown')) {
        closeAllDropdowns();
    }

    // Close expanded navbars when clicking outside any .ff-navbar
    if (!event.target.closest('.ff-navbar')) {
        closeAllNavbars();
    }

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
                toggleNavbar(navbar, actionEl);
                break;
            case 'load-game':
                console.log('Load game (demo)');
                break;
            case 'show-toast':
                showToast('Saved settings to memory.');
                break;
            default:
                // unknown action
                break;
        }

        // If we handled an explicit action, stop further processing
        return;
    }

    // Toggle popovers when clicking buttons with ff-btn class near a popover
    const btnEl = event.target.closest('.ff-btn');
    if (btnEl) {
        const parent = btnEl.parentElement;
        if (parent) {
            const popover = parent.querySelector('.ff-popover');
            if (popover) {
                // Compute and apply position so popover appears near the clicked button
                // and stays within the viewport (collision detection/clamping).
                const isShown = popover.classList.contains('show');
                if (!isShown) {
                    const parentRect = parent.getBoundingClientRect();
                    const btnRect = btnEl.getBoundingClientRect();

                    // Initial left/top relative to parent
                    let left = Math.max(8, Math.round(btnRect.left - parentRect.left));
                    let top = Math.round(btnRect.bottom - parentRect.top) + 6;

                    // Make popover visible for measurement. Use the theme's .show to override display.
                    popover.classList.add('show');
                    popover.style.visibility = 'hidden';
                    popover.style.position = 'absolute';
                    popover.style.left = left + 'px';
                    popover.style.top = top + 'px';
                    popover.style.margin = '0';

                    // Measure after making visible
                    const popRect = popover.getBoundingClientRect();
                    const margin = 8; // keep a small gap from edges

                    // Horizontal clamp: if popover extends beyond viewport, shift left
                    if (popRect.right > window.innerWidth - margin) {
                        const overflow = popRect.right - (window.innerWidth - margin);
                        left = Math.max(margin, left - Math.round(overflow));
                    }
                    if (popRect.left < margin) {
                        left = margin;
                    }

                    // Vertical clamp: if popover bottom is offscreen, try placing above the button
                    if (popRect.bottom > window.innerHeight - margin) {
                        // place above button if space
                        const aboveTop = Math.round(btnRect.top - parentRect.top) - popRect.height - 6;
                        if (aboveTop >= margin) {
                            top = aboveTop;
                        } else {
                            // otherwise clamp to bottom edge inside viewport
                            top = Math.max(margin - parentRect.top, parentRect.height - popRect.height - margin);
                        }
                    }

                    // Apply adjusted coords and reveal
                    popover.style.left = left + 'px';
                    popover.style.top = top + 'px';
                    popover.style.visibility = '';
                } else {
                    // Hide and clear inline positioning
                    popover.classList.remove('show');
                    popover.style.position = '';
                    popover.style.left = '';
                    popover.style.top = '';
                    popover.style.margin = '';
                    popover.style.visibility = '';
                }

                event.stopPropagation();
                return;
            }
        }
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

// Close navbars on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (document.querySelector('.ff-navbar.expanded')) {
            closeAllNavbars();
        }
        if (document.querySelector('.ff-dropdown.show')) {
            closeAllDropdowns();
        }
    }
});


// Cursor focus management: ensure only one finger cursor shows at a time.
(function () {
    let current = null;
    const selector = '.ff-nav-link, .ff-list-group-item, .ff-dropdown-item, .ff-page-link, .ff-btn';

    function addFocus(el) {
        if (!el) return;
        if (current && current !== el) current.classList.remove('ff-cursor-focused');
        el.classList.add('ff-cursor-focused');
        current = el;
    }

    function removeFocus(el, related) {
        if (!el) return;
        // If moving to another matched element, let pointerover handler set it.
        try {
            const to = related && related.closest ? related.closest(selector) : null;
            if (!to) {
                el.classList.remove('ff-cursor-focused');
                if (current === el) current = null;
            }
        } catch (e) {
            el.classList.remove('ff-cursor-focused');
            if (current === el) current = null;
        }
    }

    document.addEventListener('pointerover', function (e) {
        const el = e.target.closest(selector);
        if (el) addFocus(el);
    });

    document.addEventListener('pointerout', function (e) {
        const el = e.target.closest(selector);
        removeFocus(el, e.relatedTarget);
    });
})();

// Accordion toggle behavior
(function () {
    // Accordion: toggle .active on the item when header clicked
    document.addEventListener('click', function (e) {
        const hdr = e.target.closest('.ff-accordion-header');
        if (hdr) {
            const item = hdr.closest('.ff-accordion-item');
            if (item) {
                item.classList.toggle('active');
                return;
            }
        }
    });
})();

// Toast helper
function ensureToastContainer() {
    let c = document.querySelector('.ff-toast-container');
    if (!c) {
        c = document.createElement('div');
        c.className = 'ff-toast-container';
        document.body.appendChild(c);
    }
    return c;
}

function showToast(message, timeout = 4000) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'ff-toast';
    toast.innerHTML = `<div class="ff-toast-header">Notice <button class="ff-toast-close">&times;</button></div><div class="ff-toast-body">${message}</div>`;
    container.appendChild(toast);
    // Force reflow then show
    requestAnimationFrame(() => toast.classList.add('show'));

    // Close button handler
    toast.querySelector('.ff-toast-close').addEventListener('click', function () {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            try { toast.remove(); } catch (e) { }
        }, 350);
    }, timeout);
}

// Tabs: click + keyboard navigation, ARIA sync
(function () {
    function activateTab(tab) {
        if (!tab) return;
        const tablist = tab.closest('[role="tablist"]');
        if (!tablist) return;

        // Deactivate all tabs in this tablist
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        tabs.forEach(t => {
            t.setAttribute('aria-selected', 'false');
            t.classList.remove('active');
            const pid = t.getAttribute('aria-controls');
            if (pid) {
                const panel = document.getElementById(pid);
                if (panel) { panel.hidden = true; panel.classList.remove('active'); }
            }
        });

        // Activate the chosen tab
        tab.setAttribute('aria-selected', 'true');
        tab.classList.add('active');
        const pid = tab.getAttribute('aria-controls');
        if (pid) {
            const panel = document.getElementById(pid);
            if (panel) { panel.hidden = false; panel.classList.add('active'); }
        }
        tab.focus();
        document.dispatchEvent(new CustomEvent('ff:tabs:change', { detail: { tab: tab } }));
    }

    document.addEventListener('click', function (e) {
        const tab = e.target.closest('[role="tab"]');
        if (tab) { activateTab(tab); }
    });

    document.addEventListener('keydown', function (e) {
        const key = e.key;
        const tab = e.target.closest('[role="tab"]');
        if (!tab) return;
        const tablist = tab.closest('[role="tablist"]');
        if (!tablist) return;
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        const idx = tabs.indexOf(tab);
        if (key === 'ArrowRight') {
            e.preventDefault();
            const next = tabs[(idx + 1) % tabs.length]; activateTab(next);
        } else if (key === 'ArrowLeft') {
            e.preventDefault();
            const prev = tabs[(idx - 1 + tabs.length) % tabs.length]; activateTab(prev);
        } else if (key === 'Home') {
            e.preventDefault(); activateTab(tabs[0]);
        } else if (key === 'End') {
            e.preventDefault(); activateTab(tabs[tabs.length - 1]);
        }
    });
})();

// Chips: removable chips demo behavior
(function () {
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.ff-chip-remove');
        if (!btn) return;
        const chip = btn.closest('.ff-chip');
        if (chip) {
            chip.remove();
            document.dispatchEvent(new CustomEvent('ff:chip:remove', { detail: { chip: chip } }));
        }
    });
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {

    const nav = document.getElementById("mainNav");
    const toggle = document.getElementById("navToggle");

    if (nav && toggle) {
        toggle.addEventListener("click", () => {
            toggleNavbar(nav, toggle);
        });
    }
    console.log('Final Fantasy CSS initialized');
});
