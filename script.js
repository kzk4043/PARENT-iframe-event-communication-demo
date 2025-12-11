// Parent Site JavaScript
// Observes iframe behavior and dimensions

document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.getElementById('child-iframe');
    const widthDisplay = document.getElementById('iframe-width');
    const heightDisplay = document.getElementById('iframe-height');
    const initialHeightDisplay = document.getElementById('initial-height');
    const autoAdjustDisplay = document.getElementById('auto-adjust');
    const scrollbarStatusDisplay = document.getElementById('scrollbar-status');

    // Check if all elements exist
    if (!iframe || !widthDisplay || !heightDisplay || !initialHeightDisplay || !autoAdjustDisplay || !scrollbarStatusDisplay) {
        console.error('Required elements not found');
        return;
    }

    // Store initial iframe height
    const initialHeight = iframe.offsetHeight || 400;
    initialHeightDisplay.textContent = initialHeight;

    // Function to update iframe dimensions display
    function updateDimensions() {
        const width = iframe.offsetWidth;
        const height = iframe.offsetHeight;
        
        widthDisplay.textContent = width;
        heightDisplay.textContent = height;
    }

    // Initial dimension update
    updateDimensions();

    // Set timeout for iframe loading (30 seconds)
    let loadTimeout = setTimeout(function() {
        console.warn('Iframe loading timeout - child site may not be deployed');
        scrollbarStatusDisplay.textContent = 'Loading timeout - child site may not be deployed';
        autoAdjustDisplay.textContent = 'Child site loading timeout';
        autoAdjustDisplay.style.color = '#dc3545';
    }, 30000);

    // Listen for iframe load
    iframe.addEventListener('load', function() {
        clearTimeout(loadTimeout);
        updateDimensions();
        checkScrollbar();
    });

    // Handle iframe load error
    iframe.addEventListener('error', function() {
        clearTimeout(loadTimeout);
        console.error('Iframe failed to load');
        scrollbarStatusDisplay.textContent = 'Iframe load error - child site may not be deployed';
        autoAdjustDisplay.textContent = 'Child site not available';
        autoAdjustDisplay.style.color = '#dc3545';
    });

    // Check if scrollbar is visible in iframe
    function checkScrollbar() {
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
                    scrollbarStatusDisplay.textContent = hasScrollbar ? 'Yes' : 'No';
                } catch (e) {
                    // Cross-origin restriction
                    scrollbarStatusDisplay.textContent = 'Cannot determine (CORS)';
                }
            }
        } catch (e) {
            scrollbarStatusDisplay.textContent = 'Cannot determine (CORS)';
        }
    }

    // Monitor iframe size changes using ResizeObserver
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
        try {
            resizeObserver = new ResizeObserver(function(entries) {
                for (let entry of entries) {
                    updateDimensions();
                    checkScrollbar();
                    
                    // Check if height changed from initial
                    const currentHeight = entry.target.offsetHeight;
                    if (currentHeight !== initialHeight) {
                        autoAdjustDisplay.textContent = 'Height changed (may be manual)';
                        autoAdjustDisplay.style.color = '#28a745';
                    } else {
                        autoAdjustDisplay.textContent = 'No change detected';
                        autoAdjustDisplay.style.color = '#dc3545';
                    }
                }
            });
            resizeObserver.observe(iframe);
        } catch (e) {
            console.warn('ResizeObserver not supported:', e);
        }
    }

    // Listen for postMessage from child site (if implemented)
    window.addEventListener('message', function(event) {
        // Verify origin for security
        if (event.origin === 'https://kzk4043.github.io') {
            if (event.data.type === 'height-change') {
                const newHeight = event.data.height;
                iframe.style.height = newHeight + 'px';
                updateDimensions();
                autoAdjustDisplay.textContent = 'Adjusted via postMessage';
                autoAdjustDisplay.style.color = '#28a745';
            }
        }
    });

    // Periodic check for dimension changes (fallback)
    setInterval(function() {
        updateDimensions();
        checkScrollbar();
    }, 1000);
});

