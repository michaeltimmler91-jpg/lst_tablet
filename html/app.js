const tablet = document.getElementById('tablet');
const tabletFrame = document.getElementById('tabletFrame');
const webviewCanvas = document.getElementById('webviewCanvas');

const closeBtn = document.getElementById('closeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');

const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

const zoomSlider = document.getElementById('zoomSlider');
const zoomValue = document.getElementById('zoomValue');

function saveSetting(key, value) {
    localStorage.setItem(`lstTablet_${key}`, String(value));
}

function loadSetting(key, fallback) {
    return localStorage.getItem(`lstTablet_${key}`) || fallback;
}

function applySettings() {
    const opacity = Number(opacitySlider.value);
    const zoom = Number(zoomSlider.value) / 100;

    tabletFrame.style.opacity = opacity / 100;

    webviewCanvas.style.transform = `scale(${zoom})`;
    webviewCanvas.style.width = `${100 / zoom}%`;
    webviewCanvas.style.height = `${100 / zoom}%`;

    opacityValue.textContent = `${opacity}%`;
    zoomValue.textContent = `${Math.round(zoom * 100)}%`;

    saveSetting('opacity', opacity);
    saveSetting('zoom', Math.round(zoom * 100));
}

function loadSettings() {
    opacitySlider.value = loadSetting('opacity', '100');
    zoomSlider.value = loadSetting('zoom', '100');

    applySettings();
}

function requestClose() {
    fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

window.addEventListener('message', function(event) {
    if (!event.data || !event.data.action) return;

    if (event.data.action === 'open') {
        tablet.classList.remove('hidden');
        settingsPanel.classList.add('hidden');
        loadSettings();
    }

    if (event.data.action === 'close') {
        tablet.classList.add('hidden');
        settingsPanel.classList.add('hidden');
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
zoomSlider.addEventListener('input', applySettings);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        requestClose();
    }
});

loadSettings();
