/**
 * Parent Site JavaScript
 * 
 * このスクリプトは、子サイトを埋め込んだiframeの高さを監視し、
 * 子サイトからのpostMessage通知を受信してiframeの高さを調整します。
 * 
 * 主な機能:
 * 1. iframeの高さと幅を監視
 * 2. 子サイトからのpostMessageで高さ変更通知を受信
 * 3. ResizeObserverでiframeのサイズ変化を検出
 * 4. スクロールバーの有無を確認
 * 5. 高さの自動調整が機能しているかを観察
 */

console.log('[PARENT] Script loading...');
const startTime = performance.now();

/**
 * DOMContentLoadedイベント: DOMの構築が完了した時点で実行
 */
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

    /**
     * updateDimensions()
     * 
     * iframeの現在の幅と高さを取得し、画面表示を更新します。
     * 
     * 最適化:
     * - 前回の値と同じ場合は更新をスキップ（不要な処理を避ける）
     * - silentパラメータでログの出力を制御
     * 
     * @param {boolean} silent - trueの場合、ログを出力しない
     */
    let lastWidth = 0;
    let lastHeight = 0;
    function updateDimensions(silent = false) {
        const width = iframe.offsetWidth;
        const height = iframe.offsetHeight;

        // 値が変わっていない場合はスキップ
        if (width === lastWidth && height === lastHeight) {
            if (!silent) {
                console.log(`[PARENT] Dimensions unchanged: ${width}x${height}px`);
            }
            return;
        }

        // 値が変化した場合のみ更新
        const widthChanged = width !== lastWidth;
        const heightChanged = height !== lastHeight;

        if (!silent && (widthChanged || heightChanged)) {
            console.log(`[PARENT] Dimensions updated: ${width}x${height}px`, {
                widthChanged: widthChanged,
                heightChanged: heightChanged,
                previousDimensions: `${lastWidth}x${lastHeight}px`
            });
        }

        lastWidth = width;
        lastHeight = height;

        widthDisplay.textContent = width;
        heightDisplay.textContent = height;
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

    /**
     * checkScrollbar()
     * 
     * iframe内のコンテンツにスクロールバーが必要かどうかを確認します。
     * 
     * 仕組み:
     * - iframe.contentWindow.document.documentElement.scrollHeight を取得
     *   （コンテンツの実際の高さ）
     * - iframe.contentWindow.document.documentElement.clientHeight を取得
     *   （iframeの表示可能な高さ）
     * - scrollHeight > clientHeight の場合、スクロールバーが必要
     * 
     * 注意:
     * - クロスオリジン制限により、同じオリジンでない場合はアクセスできない
     *   （この場合はGitHub Pagesなので同じオリジンのはずだが、念のためエラーハンドリング）
     * 
     * 最適化:
     * - silentパラメータでログの出力を制御
     * - 前回と同じ結果の場合はログを出力しない
     * 
     * @param {boolean} silent - trueの場合、ログを出力しない
     */
    let lastScrollbarStatus = null;
    function checkScrollbar(silent = false) {
        if (!silent) {
            console.log('[PARENT] Checking scrollbar visibility');
        }
        try {
            // クロスオリジン制限により、iframeのコンテンツに直接アクセスできない場合がある
            const iframeContent = iframe.contentWindow;
            if (iframeContent) {
                // scrollHeightとclientHeightを取得して比較
                try {
                    const scrollHeight = iframeContent.document.documentElement.scrollHeight;
                    const clientHeight = iframeContent.document.documentElement.clientHeight;
                    const hasScrollbar = scrollHeight > clientHeight;

                    // 前回と同じ結果の場合はログを出力しない
                    if (lastScrollbarStatus !== hasScrollbar || !silent) {
                        if (!silent) {
                            console.log(`[PARENT] Scrollbar check: scrollHeight=${scrollHeight}, clientHeight=${clientHeight}, hasScrollbar=${hasScrollbar}`);
                        }
                        lastScrollbarStatus = hasScrollbar;
                        scrollbarStatusDisplay.textContent = hasScrollbar ? 'Yes' : 'No';
                    }
                } catch (e) {
                    // クロスオリジン制限によりアクセスできない場合
                    if (!silent) {
                        console.log('[PARENT] Cannot check scrollbar due to CORS:', e.message);
                    }
                    scrollbarStatusDisplay.textContent = 'Cannot determine (CORS)';
                }
            }
        } catch (e) {
            if (!silent) {
                console.log('[PARENT] Error checking scrollbar:', e.message);
            }
            scrollbarStatusDisplay.textContent = 'Cannot determine (CORS)';
        }
    }

    /**
     * ResizeObserver: iframeのサイズ変化を監視
     * 
     * iframe要素のサイズが変化した際に自動的に検出します。
     * 
     * 使用目的:
     * - iframeの高さが手動で変更された場合を検出
     * - 親サイトのレイアウト変更によるiframeサイズの変化を検出
     * 
     * 注意:
     * - ResizeObserverはiframe要素自体のサイズ変化を監視する
     * - iframe内のコンテンツの高さ変化は検出しない（postMessageで対応）
     * 
     * 最適化:
     * - サイズが実際に変化した場合のみログを出力
     */
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
        try {
            console.log('[PARENT] Creating ResizeObserver');
            resizeObserver = new ResizeObserver(function (entries) {
                for (let entry of entries) {
                    const currentHeight = entry.target.offsetHeight;
                    const currentWidth = entry.target.offsetWidth;

                    // サイズが実際に変化した場合のみログを出力
                    if (currentHeight !== lastHeight || currentWidth !== lastWidth) {
                        console.log(`[PARENT] ResizeObserver: iframe size changed to ${currentWidth}x${currentHeight}px`);
                    }

                    // サイレントモードで更新（値が変わっていない場合は自動的にスキップされる）
                    updateDimensions(true); // silent = true
                    checkScrollbar(true);  // silent = true

                    // 初期高さと比較して、高さが変化したかチェック
                    if (currentHeight !== initialHeight) {
                        console.log(`[PARENT] Height changed from initial ${initialHeight}px to ${currentHeight}px`);
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

    /**
     * postMessageイベントリスナー: 子サイトからの高さ変更通知を受信
     * 
     * 子サイトがpostMessage APIを使用して高さの変化を通知してきた際に、
     * iframeの高さを自動的に調整します。
     * 
     * メッセージ形式:
     * {
     *   type: 'height-change',
     *   height: <数値>  // ピクセル単位の高さ
     * }
     * 
     * セキュリティ:
     * - event.originをチェックして、信頼できるオリジンからのメッセージのみ処理
     * - 現在は 'https://kzk4043.github.io' からのメッセージのみ受け入れる
     * 
     * 処理フロー:
     * 1. メッセージを受信
     * 2. オリジンを検証
     * 3. メッセージタイプが 'height-change' の場合
     * 4. iframeの高さを新しい値に設定
     * 5. 画面表示を更新
     */
    console.log('[PARENT] Adding message event listener');
    window.addEventListener('message', function (event) {
        // すべてのメッセージをログに記録（デバッグ用）
        console.log('[PARENT] Message received:', {
            origin: event.origin,
            type: event.data?.type,
            data: event.data
        });

        // セキュリティ: オリジンを検証
        if (event.origin === 'https://kzk4043.github.io') {
            if (event.data && event.data.type === 'height-change') {
                const newHeight = event.data.height;
                console.log(`[PARENT] Adjusting iframe height to ${newHeight}px via postMessage`);

                // iframeの高さを新しい値に設定
                iframe.style.height = newHeight + 'px';

                // 画面表示を更新（サイレントモード）
                updateDimensions(true); // silent = true
                checkScrollbar(true);  // silent = true

                // 状態表示を更新
                autoAdjustDisplay.textContent = 'Adjusted via postMessage';
                autoAdjustDisplay.style.color = '#28a745';
            } else {
                console.log('[PARENT] Message type not recognized:', event.data?.type);
            }
        } else {
            // 信頼できないオリジンからのメッセージは無視
            console.log('[PARENT] Message ignored - origin mismatch:', event.origin);
        }
    });

    /**
     * 定期チェック（フォールバック）
     * 
     * 他の監視方法（ResizeObserver、postMessage）で検出できなかった
     * 高さの変化を検出するためのフォールバック機能。
     * 
     * 実行頻度: 3秒ごと（パフォーマンス向上のため1秒から3秒に変更）
     * 
     * なぜ必要か:
     * - ResizeObserverが検出できない変更
     * - postMessageが送信されなかった場合の保険
     * - 外部からの手動変更の検出
     * 
     * 最適化:
     * - 間隔を3秒に延長してパフォーマンスへの影響を軽減
     * - サイレントモードで実行（値が変わっていない場合はログを出力しない）
     * - updateDimensions()とcheckScrollbar()内で値が変わっていない場合は自動的にスキップされる
     */
    console.log('[PARENT] Starting periodic dimension check (every 3s, silent mode)');
    setInterval(function () {
        // サイレントモードで実行（値が変わっていない場合はログを出力しない）
        updateDimensions(true); // silent = true
        checkScrollbar(true);    // silent = true
    }, 3000); // 3秒間隔に変更（パフォーマンス向上）

    const initTime = performance.now() - startTime;
    console.log(`[PARENT] Initialization complete in ${initTime.toFixed(2)}ms`);
});

