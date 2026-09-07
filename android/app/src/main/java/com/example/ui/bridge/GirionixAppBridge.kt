package com.example.ui.bridge

import android.webkit.JavascriptInterface
import com.example.data.repository.ChatRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

/**
 * JavaScript interface exposed to the WebView for bidirectional communication
 * between the web workspace and Android native services.
 */
class GirionixAppBridge(
    private val repository: ChatRepository,
    private val scope: CoroutineScope,
    private val onWebsiteReady: () -> Unit = {}
) {

    @JavascriptInterface
    fun getOperatorName(): String {
        return runBlocking {
            repository.getOperatorName()
        }
    }

    @JavascriptInterface
    fun isAppInstalled(): Boolean {
        return true
    }

    @JavascriptInterface
    fun getRetentionPeriodDays(): Int {
        return 90
    }

    @JavascriptInterface
    fun syncChatSessions(sessionsJson: String) {
        scope.launch(Dispatchers.IO) {
            repository.syncSessionsFromJson(sessionsJson)
        }
    }

    @JavascriptInterface
    fun getArchivedSessions(): String {
        return runBlocking {
            repository.exportValidSessionsJson()
        }
    }

    @JavascriptInterface
    fun onWebsiteReady() {
        scope.launch(Dispatchers.Main) {
            onWebsiteReady.invoke()
        }
    }
}
