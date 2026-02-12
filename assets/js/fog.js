document.addEventListener('DOMContentLoaded', () => {
    // Inject Premium Fog CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/fog.css';
    document.head.appendChild(link);

    // Create fog container
    const fogContainer = document.createElement('div');
    fogContainer.className = 'fog-wrapper';
    fogContainer.setAttribute('aria-hidden', 'true');

    // Create layers
    const layer1 = document.createElement('div');
    layer1.className = 'fog-layer fog-layer-1';

    const layer2 = document.createElement('div');
    layer2.className = 'fog-layer fog-layer-2';

    const layer3 = document.createElement('div');
    layer3.className = 'fog-layer fog-layer-3';

    // Assemble
    fogContainer.appendChild(layer1);
    fogContainer.appendChild(layer2);
    fogContainer.appendChild(layer3);

    // Inject into body
    document.body.prepend(fogContainer);
    console.log('Premium fog effect initialized.');
});
