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
sizeSlider.addEventListener('input', applySettings);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        requestClose();
    }
});

loadSettings();
