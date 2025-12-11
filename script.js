// Parent Site JavaScript
// Observes iframe behavior and dimensions

console.log('[PARENT] Script loading...');
const startTime = performance.now();

document.addEventListener('DOMContentLoaded', function () {
    console.log('[PARENT] DOMContentLoaded event fired');
    const loadTime = performance.now() - startTime;
    console.log(`[PARENT] DOM ready in ${loadTime.toFixed(2)}ms`);

    const iframe = document.getElementById('child-iframe');
    const widthDisplay = document.getElementById('iframe-width');
    const heightDisplay = document.getElementById('iframe-height');
    const initialHeightDisplay = document.getElementById('initial-height');
    const autoAdjustDisplay = document.getElementById('auto-adjust');
    const scrollbarStatusDisplay = document.getElementById('scrollbar-status');

    console.log('[PARENT] Elements found:', {
        iframe: !!iframe,
        widthDisplay: !!widthDisplay,
        heightDisplay: !!heightDisplay,
        initialHeightDisplay: !!initialHeightDisplay,
        autoAdjustDisplay: !!autoAdjustDisplay,
        scrollbarStatusDisplay: !!scrollbarStatusDisplay
    });

    // Check if all elements exist
    if (!iframe || !widthDisplay || !heightDisplay || !initialHeightDisplay || !autoAdjustDisplay || !scrollbarStatusDisplay) {
        console.error('[PARENT] Required elements not found');
        return;
    }

    // Store initial iframe height
    const initialHeight = iframe.offsetHeight || 400;
    initialHeightDisplay.textContent = initialHeight;
    console.log(`[PARENT] Initial iframe height: ${initialHeight}px`);

    // Function to update iframe dimensions display
    function updateDimensions() {
        const width = iframe.offsetWidth;
        const height = iframe.offsetHeight;

        widthDisplay.textContent = width;
        heightDisplay.textContent = height;

        console.log(`[PARENT] Dimensions updated: ${width}x${height}px`);
    }

    // Initial dimension update
    console.log('[PARENT] Performing initial dimension update');
    updateDimensions();

    // Set timeout for iframe loading (30 seconds)
    console.log('[PARENT] Setting iframe load timeout (30s)');
    let loadTimeout = setTimeout(function () {
        console.warn('[PARENT] Iframe loading timeout - child site may not be deployed');
        scrollbarStatusDisplay.textContent = 'Loading timeout - child site may not be deployed';
        autoAdjustDisplay.textContent = 'Child site loading timeout';
        autoAdjustDisplay.style.color = '#dc3545';
    }, 30000);

    // Listen for iframe load
    console.log('[PARENT] Adding iframe load event listener');
    iframe.addEventListener('load', function () {
        const loadTime = performance.now() - startTime;
        console.log(`[PARENT] Iframe loaded successfully in ${loadTime.toFixed(2)}ms`);
        clearTimeout(loadTimeout);
        updateDimensions();
        checkScrollbar();
    });

    // Handle iframe load error
    iframe.addEventListener('error', function () {
        console.error('[PARENT] Iframe failed to load');
        clearTimeout(loadTimeout);
        scrollbarStatusDisplay.textContent = 'Iframe load error - child site may not be deployed';
        autoAdjustDisplay.textContent = 'Child site not available';
        autoAdjustDisplay.style.color = '#dc3545';
    });

    // Check if scrollbar is visible in iframe
    function checkScrollbar() {
        console.log('[PARENT] Checking scrollbar visibility');
        try {
            // Note: Due to cross-origin restrictions, we can't directly access
            // iframe content. We'll observe the iframe's own dimensions.
            const iframeContent = iframe.contentWindow;
            if (iframeContent) {
                // Try to check scrollHeight (may fail due to CORS)
                try {
                    const scrollHeight = iframeContent.document.documentElement.scrollHeight;
                    const clientHeight = iframeContent.document.documentElement.clientHeight;
                    const hasScrollbar = scrollHeight > clientHeight;
                    console.log(`[PARENT] Scrollbar check: scrollHeight=${scrollHeight}, clientHeight=${clientHeight}, hasScrollbar=${hasScrollbar}`);
                    scrollbarStatusDisplay.textContent = hasScrollbar ? 'Yes' : 'No';
                } catch (e) {
                    // Cross-origin restriction
                    console.log('[PARENT] Cannot check scrollbar due to CORS:', e.message);
                    scrollbarStatusDisplay.textContent = 'Cannot determine (CORS)';
                }
            }
        } catch (e) {
            console.log('[PARENT] Error checking scrollbar:', e.message);
            scrollbarStatusDisplay.textContent = 'Cannot determine (CORS)';
        }
    }

    // Monitor iframe size changes using ResizeObserver
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
        try {
            console.log('[PARENT] Creating ResizeObserver');
            resizeObserver = new ResizeObserver(function (entries) {
                console.log('[PARENT] ResizeObserver triggered', entries.length, 'entries');
                for (let entry of entries) {
                    updateDimensions();
                    checkScrollbar();

                    // Check if height changed from initial
                    const currentHeight = entry.target.offsetHeight;
                    if (currentHeight !== initialHeight) {
                        console.log(`[PARENT] Height changed from ${initialHeight}px to ${currentHeight}px`);
                        autoAdjustDisplay.textContent = 'Height changed (may be manual)';
                        autoAdjustDisplay.style.color = '#28a745';
                    } else {
                        autoAdjustDisplay.textContent = 'No change detected';
                        autoAdjustDisplay.style.color = '#dc3545';
                    }
                }
            });
            resizeObserver.observe(iframe);
            console.log('[PARENT] ResizeObserver attached to iframe');
        } catch (e) {
            console.warn('[PARENT] ResizeObserver not supported:', e);
        }
    } else {
        console.warn('[PARENT] ResizeObserver not available in this browser');
    }

    // Listen for postMessage from child site (if implemented)
    console.log('[PARENT] Adding message event listener');
    window.addEventListener('message', function (event) {
        console.log('[PARENT] Message received:', {
            origin: event.origin,
            type: event.data?.type,
            data: event.data
        });

        // Verify origin for security
        if (event.origin === 'https://kzk4043.github.io') {
            if (event.data.type === 'height-change') {
                const newHeight = event.data.height;
                console.log(`[PARENT] Adjusting iframe height to ${newHeight}px via postMessage`);
                iframe.style.height = newHeight + 'px';
                updateDimensions();
                autoAdjustDisplay.textContent = 'Adjusted via postMessage';
                autoAdjustDisplay.style.color = '#28a745';
            }
        } else {
            console.log('[PARENT] Message ignored - origin mismatch:', event.origin);
        }
    });

    // Periodic check for dimension changes (fallback)
    console.log('[PARENT] Starting periodic dimension check (every 1s)');
    setInterval(function () {
        updateDimensions();
        checkScrollbar();
    }, 1000);

    const initTime = performance.now() - startTime;
    console.log(`[PARENT] Initialization complete in ${initTime.toFixed(2)}ms`);
});

