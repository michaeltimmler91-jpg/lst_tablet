const tablet = document.getElementById('tablet');
const tabletStage = document.getElementById('tabletStage');
const tabletFrame = document.getElementById('tabletFrame');

const closeBtn = document.getElementById('closeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');

const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');

const dispatchAlert = document.getElementById('dispatchAlert');
const dispatchAccent = document.getElementById('dispatchAccent');
const dispatchIcon = document.getElementById('dispatchIcon');
const dispatchSubtitle = document.getElementById('dispatchSubtitle');
const dispatchPickup = document.getElementById('dispatchPickup');
const dispatchDestination = document.getElementById('dispatchDestination');
const dispatchCustomer = document.getElementById('dispatchCustomer');
const dispatchDestinationRow = document.getElementById('dispatchDestinationRow');
const dispatchCustomerRow = document.getElementById('dispatchCustomerRow');

let dispatchTimer = null;
let dispatchHideTimer = null;

function saveSetting(key, value) {
    localStorage.setItem(`lstTablet_${key}`, String(value));
}

function loadSetting(key, fallback) {
    return localStorage.getItem(`lstTablet_${key}`) || fallback;
}

function applySettings() {
    const opacity = Number(opacitySlider.value);
    const size = Number(sizeSlider.value);

    tabletFrame.style.opacity = opacity / 100;
    tabletStage.style.transform = `scale(${size / 100})`;

    opacityValue.textContent = `${opacity}%`;
    sizeValue.textContent = `${size}%`;

    saveSetting('opacity', opacity);
    saveSetting('size', size);
}

function loadSettings() {
    opacitySlider.value = loadSetting('opacity', '100');
    sizeSlider.value = loadSetting('size', '100');

    applySettings();
}

function postNuiCallback(name, payload = {}) {
    fetch(`https://${GetParentResourceName()}/${name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).catch(() => {});
}

function requestClose() {
    postNuiCallback('close');
}

function getDispatchTypeClass(rideType) {
    const type = String(rideType || '').toLowerCase();

    if (type.includes('essen')) return 'food';
    if (type.includes('ems')) return 'ems';
    if (type.includes('gebraucht')) return 'dealer';
    if (type.includes('bambi')) return 'bambi';

    return '';
}

function getDispatchIcon(rideType) {
    const type = String(rideType || '').toLowerCase();

    if (type.includes('essen')) return '🍔';
    if (type.includes('ems')) return '🚑';
    if (type.includes('gebraucht')) return '🚗';
    if (type.includes('bambi')) return '🐣';

    return '🚕';
}

function isUsefulValue(value) {
    const text = String(value || '').trim();
    return text !== '' && text !== '-' && text.toLowerCase() !== 'unbekannt';
}

function showDispatchAlert(payload = {}) {
    if (!dispatchAlert) return;

    const rideType = payload.rideType || 'Neuer Auftrag';
    const pickup = payload.pickup || 'Unbekannt';
    const destination = payload.destination || '-';
    const customer = payload.customer || '-';
    const typeClass = getDispatchTypeClass(rideType);

    dispatchAccent.className = `dispatch-accent ${typeClass}`.trim();
    dispatchIcon.textContent = getDispatchIcon(rideType);
    dispatchSubtitle.textContent = rideType;
    dispatchPickup.textContent = pickup;

    if (isUsefulValue(destination)) {
        dispatchDestination.textContent = destination;
        dispatchDestinationRow.classList.remove('hidden');
    } else {
        dispatchDestinationRow.classList.add('hidden');
    }

    if (isUsefulValue(customer)) {
        dispatchCustomer.textContent = customer;
        dispatchCustomerRow.classList.remove('hidden');
    } else {
        dispatchCustomerRow.classList.add('hidden');
    }

    clearTimeout(dispatchTimer);
    clearTimeout(dispatchHideTimer);

    dispatchAlert.classList.remove('hidden', 'hide');
    dispatchAlert.classList.add('show');

    dispatchTimer = setTimeout(() => {
        dispatchAlert.classList.remove('show');
        dispatchAlert.classList.add('hide');

        dispatchHideTimer = setTimeout(() => {
            dispatchAlert.classList.add('hidden');
            dispatchAlert.classList.remove('hide');
        }, 420);
    }, 8000);
}

window.addEventListener('message', function(event) {
    if (!event.data) return;

    if (event.data.source === 'los-santos-taxi') {
        if (event.data.type === 'new_job') {
            postNuiCallback('taxiNewJobAlert', event.data.payload || {});
        }

        if (event.data.type === 'idle_warning') {
            postNuiCallback('taxiIdleWarning');
        }

        return;
    }

    if (!event.data.action) return;

    if (event.data.action === 'open') {
        tablet.classList.remove('hidden');
        settingsPanel.classList.add('hidden');
        loadSettings();
    }

    if (event.data.action === 'close') {
        tablet.classList.add('hidden');
        settingsPanel.classList.add('hidden');
    }

    if (event.data.action === 'dispatch') {
        showDispatchAlert(event.data.payload || {});
    }
});

closeBtn.addEventListener('click', requestClose);

settingsBtn.addEventListener('click', function() {
    settingsPanel.classList.toggle('hidden');
});

settingsCloseBtn.addEventListener('click', function() {
    settingsPanel.classList.add('hidden');
});

opacitySlider.addEventListener('input', applySettings);
sizeSlider.addEventListener('input', applySettings);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        requestClose();
    }
});

loadSettings();
