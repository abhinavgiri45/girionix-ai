package com.example.ui.screens

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.http.SslError
import android.os.Build
import android.view.ViewGroup
import android.webkit.PermissionRequest
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.example.ui.GirionixUiState
import com.example.ui.GirionixViewModel
import com.example.ui.bridge.GirionixAppBridge
import com.example.ui.theme.GirionixCardBorder
import com.example.ui.theme.GirionixCyan
import com.example.ui.theme.GirionixGreen
import com.example.ui.theme.GirionixObsidian
import com.example.ui.theme.GirionixPurple
import com.example.ui.theme.GirionixPurpleLight
import com.example.ui.theme.GirionixSurface
import com.example.ui.theme.GirionixSurfaceVariant
import com.example.ui.theme.GirionixTextMuted
import com.example.ui.theme.GirionixTextPrimary
import com.example.ui.theme.GirionixTextSecondary

private const val GIRIONIX_WEBSITE_URL = "https://girionix-ai.pages.dev/?app=true&direct=chat&native=true#app=true"

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WorkspaceScreen(
    viewModel: GirionixViewModel,
    uiState: GirionixUiState,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }
    var pendingPermissionRequest by remember { mutableStateOf<PermissionRequest?>(null) }

    // Audio recording permission launcher for voice input
    val audioPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            pendingPermissionRequest?.grant(pendingPermissionRequest?.resources)
        } else {
            pendingPermissionRequest?.deny()
        }
        pendingPermissionRequest = null
    }

    val bridge = remember(viewModel.repository) {
        GirionixAppBridge(
            repository = viewModel.repository,
            scope = coroutineScope,
            onWebsiteReady = {
                viewModel.onWebPageFinished()
            }
        )
    }

    // JS snippet injected into website to ensure operator name, app mode, and 90-day retention
    fun buildInjectionScript(operatorName: String): String {
        val sanitizedName = operatorName.replace("\"", "\\\"").replace("'", "\\'")
        return """
            (function() {
                try {
                    window.isGirionixApp = true;
                    window.girionixNativeApp = true;
                    const opName = "$sanitizedName";
                    if (opName && opName.length > 0) {
                        localStorage.setItem('girionix_user_name', opName);
                    }
                    localStorage.setItem('girionix_app_installed', 'true');
                    localStorage.setItem('girionix_native_runtime', 'true');
                    localStorage.setItem('girionix_seen_intro', 'true');
                    localStorage.setItem('girionix_retention_days', '90');

                    // Inject clean UI stylesheet to hide unwanted redundant/promotional buttons
                    function injectCleanStyle() {
                        try {
                            if (!document.getElementById('girionix-clean-ui-styles')) {
                                const style = document.createElement('style');
                                style.id = 'girionix-clean-ui-styles';
                                style.textContent = `
                                    /* 1. Header: Hide redundant promo buttons (Why Switch, Pro Active badge, Get App) */
                                    header button[title*="Why Switch"],
                                    header button[title*="Pro Superpowers"],
                                    header button[title*="Native App Active"],
                                    header button[title*="Download Desktop"],
                                    header button[title*="Download Standalone"] {
                                        display: none !important;
                                    }

                                    /* 2. Sidebar bottom panel: Hide unwanted promotional/external buttons */
                                    button[title*="Pro Superpowers"],
                                    button[title*="Native App Active • Pro Superpowers Unlocked"],
                                    button[title*="Why Switch to Girionix"],
                                    button[title*="Introducing Girionix AI & Creator"],
                                    button[title*="Open Introducing Girionix AI"],
                                    button[title*="Download Android, Windows"],
                                    button[title*="Get Girionix App"] {
                                        display: none !important;
                                    }

                                    /* 3. Tools Menu popup: Clean out redundant marketing items */
                                    div[class*="animate-fadeIn"] button[class*="hover:bg-purple-500"]:has(div:contains("Why Switch")),
                                    div[class*="animate-fadeIn"] button:has(span:contains("Why Switch")) {
                                        display: none !important;
                                    }

                                    /* 4. Fullscreen landing overlays */
                                    div.z-\\[9999\\] {
                                        display: none !important;
                                    }
                                `;
                                (document.head || document.documentElement).appendChild(style);
                            }
                        } catch(e) {}
                    }

                    // DOM cleanup helper targeting redundant buttons by title, text and hierarchy
                    function cleanUnwantedButtons() {
                        try {
                            injectCleanStyle();
                            const buttons = Array.from(document.querySelectorAll('button'));
                            for (let i = 0; i < buttons.length; i++) {
                                const b = buttons[i];
                                const title = (b.getAttribute('title') || '').toLowerCase();
                                const text = (b.innerText || b.textContent || '').trim();

                                // Hide "Why Switch" / "Why Switch?" button
                                if (title.includes('why switch') || text === 'Why Switch?' || text.includes('Why Switch to Girionix')) {
                                    b.style.display = 'none';
                                }

                                // Hide redundant "Pro Active" badge / button
                                if (title.includes('pro superpowers') || title.includes('native app active') || text.includes('Pro Active') || text.includes('Local Vault Unlocked')) {
                                    b.style.display = 'none';
                                }

                                // Hide "Get App" / "Get Girionix App" download triggers in app
                                if (title.includes('download desktop') || title.includes('download android') || text.includes('Get App') || text.includes('Get Girionix App')) {
                                    b.style.display = 'none';
                                }

                                // Hide redundant "About Girionix AI" promo button in sidebar
                                if (title.includes('introducing girionix') || (text.includes('About Girionix AI') && text.includes('Abhinav Giri'))) {
                                    b.style.display = 'none';
                                }
                            }
                        } catch(err) {}
                    }

                    // Run immediately and periodically as DOM updates
                    cleanUnwantedButtons();
                    setInterval(cleanUnwantedButtons, 800);

                    // Auto-dismiss landing page and guarantee direct workspace access
                    function forceOpenWorkspace() {
                        try {
                            const buttons = Array.from(document.querySelectorAll('button'));
                            for (let i = 0; i < buttons.length; i++) {
                                const btn = buttons[i];
                                const txt = (btn.innerText || btn.textContent || '').trim();
                                if (txt.includes('Launch Free') || txt.includes('Start Using Free')) {
                                    btn.click();
                                }
                            }
                            // Also hide any top-level full-screen landing intro overlay
                            const overlays = document.querySelectorAll('.z-\\[9999\\]');
                            overlays.forEach(function(ov) {
                                ov.style.display = 'none';
                            });
                        } catch(err) {}
                    }

                    forceOpenWorkspace();
                    for (let delay = 50; delay <= 2000; delay += 100) {
                        setTimeout(forceOpenWorkspace, delay);
                    }

                    if (!window.__girionix_landing_observer) {
                        window.__girionix_landing_observer = new MutationObserver(function() {
                            forceOpenWorkspace();
                            cleanUnwantedButtons();
                        });
                        try {
                            window.__girionix_landing_observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true
                            });
                        } catch(e) {}
                    }

                    // Enforce 90-day chat retention
                    const sessionsStr = localStorage.getItem('girionix_chat_sessions');
                    if (sessionsStr) {
                        const sessions = JSON.parse(sessionsStr);
                        const cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000);
                        const valid = sessions.filter(function(s) {
                            return !s.createdAt || s.createdAt >= cutoff;
                        });
                        if (valid.length !== sessions.length) {
                            localStorage.setItem('girionix_chat_sessions', JSON.stringify(valid));
                        }
                        if (window.GirionixNative && window.GirionixNative.syncChatSessions) {
                            window.GirionixNative.syncChatSessions(JSON.stringify(valid));
                        }
                    }

                    // Intercept future chat saves for native 90-day vault syncing
                    if (!window.__girionix_hooked) {
                        window.__girionix_hooked = true;
                        const origSet = localStorage.setItem;
                        localStorage.setItem = function(k, v) {
                            origSet.apply(this, arguments);
                            if (k === 'girionix_chat_sessions' && window.GirionixNative && window.GirionixNative.syncChatSessions) {
                                try {
                                    window.GirionixNative.syncChatSessions(v);
                                } catch(e) {}
                            }
                        };
                    }
                } catch(err) {
                    console.error('Girionix native bridge injection error', err);
                }
            })();
        """.trimIndent()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(GirionixObsidian)
    ) {
        // Top Minimal Workspace Status Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(GirionixSurface)
                .padding(horizontal = 14.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Left: Title and Live Connection Dot
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { viewModel.toggleStorageSheet(true) }
                    .padding(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (uiState.isOnline) GirionixGreen else Color(0xFFEF4444))
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "GIRIONIX AI WORKSPACE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.2.sp,
                        color = GirionixCyan
                    )
                    Text(
                        text = if (uiState.isOnline) "Live Connected • 90d Vault" else "Offline Cache Mode",
                        fontSize = 9.sp,
                        color = GirionixTextMuted
                    )
                }
            }

            // Right: Operator Pill & Actions
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Operator Profile Chip
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(GirionixSurfaceVariant)
                        .border(1.dp, GirionixCyan.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
                        .clickable { viewModel.toggleStorageSheet(true) }
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Operator",
                        tint = GirionixCyan,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = uiState.operatorName.ifEmpty { "Operator" },
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = GirionixTextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Spacer(modifier = Modifier.width(6.dp))

                // Storage Vault status button
                IconButton(
                    onClick = { viewModel.toggleStorageSheet(true) },
                    modifier = Modifier
                        .size(32.dp)
                        .testTag("storage_info_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Storage,
                        contentDescription = "90-Day Storage Vault",
                        tint = GirionixPurpleLight,
                        modifier = Modifier.size(16.dp)
                    )
                }

                // Refresh / Pull latest website changes button
                IconButton(
                    onClick = {
                        webViewInstance?.reload()
                    },
                    modifier = Modifier
                        .size(32.dp)
                        .testTag("refresh_workspace_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Push / Refresh Website Updates",
                        tint = GirionixCyan,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }

        // Loading Progress Bar
        AnimatedVisibility(
            visible = uiState.isWebsiteLoading && uiState.loadProgress < 100,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            LinearProgressIndicator(
                progress = { uiState.loadProgress / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp),
                color = GirionixCyan,
                trackColor = GirionixSurfaceVariant
            )
        }

        // Workspace Container: WebView or Offline Error Fallback
        Box(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f)
        ) {
            AndroidView(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("girionix_workspace_webview"),
                factory = { ctx ->
                    WebView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )

                        setBackgroundColor(0xFF07080E.toInt())

                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            databaseEnabled = true
                            allowFileAccess = true
                            allowContentAccess = true
                            mediaPlaybackRequiresUserGesture = false
                            useWideViewPort = true
                            loadWithOverviewMode = true
                            displayZoomControls = false
                            builtInZoomControls = false
                            setSupportZoom(false)

                            // LOAD_DEFAULT honors Cloudflare's max-age=0, must-revalidate
                            // ensuring website changes are immediately pushed to app
                            cacheMode = WebSettings.LOAD_DEFAULT

                            // Custom User-Agent so website recognizes GirionixApp
                            val defaultUa = userAgentString
                            userAgentString = "$defaultUa GirionixApp/1.0 (Android; Girionix Sovereign Workspace)"
                        }

                        // Add Native Bridge for Operator & 90-day chat persistence
                        addJavascriptInterface(bridge, "GirionixNative")
                        addJavascriptInterface(bridge, "Android")

                        webChromeClient = object : WebChromeClient() {
                            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                super.onProgressChanged(view, newProgress)
                                viewModel.onWebProgressChanged(newProgress)
                                if (newProgress in 30..90) {
                                    val script = buildInjectionScript(uiState.operatorName)
                                    view?.evaluateJavascript(script, null)
                                }
                            }

                            override fun onPermissionRequest(request: PermissionRequest?) {
                                if (request == null) return
                                val resources = request.resources
                                if (resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)) {
                                    val hasPermission = ContextCompat.checkSelfPermission(
                                        context,
                                        Manifest.permission.RECORD_AUDIO
                                    ) == PackageManager.PERMISSION_GRANTED

                                    if (hasPermission) {
                                        request.grant(resources)
                                    } else {
                                        pendingPermissionRequest = request
                                        audioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                                    }
                                } else {
                                    request.grant(resources)
                                }
                            }
                        }

                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                viewModel.onWebPageStarted()
                                // Pre-inject operator name and retention policy
                                val script = buildInjectionScript(uiState.operatorName)
                                evaluateJavascript(script, null)
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                viewModel.onWebPageFinished()
                                // Inject on load complete to ensure sync
                                val script = buildInjectionScript(uiState.operatorName)
                                evaluateJavascript(script, null)
                            }

                            override fun onReceivedError(
                                view: WebView?,
                                request: WebResourceRequest?,
                                error: WebResourceError?
                            ) {
                                super.onReceivedError(view, request, error)
                                if (request?.isForMainFrame == true) {
                                    val desc = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                        error?.description?.toString() ?: "Network error"
                                    } else {
                                        "Network error"
                                    }
                                    viewModel.onWebError(desc)
                                }
                            }

                            override fun onReceivedSslError(
                                view: WebView?,
                                handler: SslErrorHandler?,
                                error: SslError?
                            ) {
                                // For HTTPS cloudflare pages
                                handler?.proceed()
                            }
                        }

                        loadUrl(GIRIONIX_WEBSITE_URL)
                        webViewInstance = this
                    }
                },
                update = { webView ->
                    webViewInstance = webView
                }
            )

            // Web Error State overlay if website fails to connect
            if (uiState.webErrorMessage != null && !uiState.isOnline) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(GirionixObsidian.copy(alpha = 0.95f))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(GirionixSurface)
                            .border(1.dp, GirionixCardBorder, RoundedCornerShape(20.dp))
                            .padding(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Error",
                            tint = Color(0xFFF59E0B),
                            modifier = Modifier.size(44.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Connection Offline",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = GirionixTextPrimary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Could not connect to $GIRIONIX_WEBSITE_URL. Check your internet connection. Cached vault chats remain available locally.",
                            fontSize = 13.sp,
                            color = GirionixTextSecondary,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = {
                                viewModel.onWebPageStarted()
                                webViewInstance?.reload()
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = GirionixCyan,
                                contentColor = Color.Black
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Reconnect Workspace", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            webViewInstance?.destroy()
        }
    }
}
