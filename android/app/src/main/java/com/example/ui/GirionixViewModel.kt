package com.example.ui

import android.app.Application
import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.GirionixDatabase
import com.example.data.preferences.OperatorPreferences
import com.example.data.repository.ChatRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class GirionixUiState(
    val isOperatorConfigured: Boolean = false,
    val operatorName: String = "",
    val isWebsiteLoading: Boolean = true,
    val loadProgress: Int = 0,
    val isOnline: Boolean = true,
    val lastSyncTimestamp: Long = System.currentTimeMillis(),
    val retentionDays: Long = 90L,
    val showStorageSheet: Boolean = false,
    val webErrorMessage: String? = null
)

class GirionixViewModel(application: Application) : AndroidViewModel(application) {

    private val db = GirionixDatabase.getInstance(application)
    private val preferences = OperatorPreferences(application)
    val repository = ChatRepository(db.chatSessionDao(), preferences)

    private val _uiState = MutableStateFlow(
        GirionixUiState(
            isOperatorConfigured = preferences.isSetupCompleted(),
            operatorName = preferences.getOperatorName() ?: ""
        )
    )
    val uiState: StateFlow<GirionixUiState> = _uiState.asStateFlow()

    val sessionCount: StateFlow<Int> = repository.sessionCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val connectivityManager =
        application.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    init {
        monitorNetworkState()
        // Run initial 90-day retention cleanup on startup
        performRetentionCleanup()
    }

    private fun monitorNetworkState() {
        val initialCapabilities =
            connectivityManager.getNetworkCapabilities(connectivityManager.activeNetwork)
        val isInitiallyOnline = initialCapabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
        _uiState.value = _uiState.value.copy(isOnline = isInitiallyOnline)

        val networkRequest = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(
            networkRequest,
            object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    _uiState.value = _uiState.value.copy(
                        isOnline = true,
                        webErrorMessage = null
                    )
                }

                override fun onLost(network: Network) {
                    _uiState.value = _uiState.value.copy(isOnline = false)
                }
            }
        )
    }

    fun saveOperatorName(name: String) {
        val trimmed = name.trim()
        if (trimmed.isEmpty()) return

        viewModelScope.launch(Dispatchers.IO) {
            repository.saveOperatorName(trimmed)
            _uiState.value = _uiState.value.copy(
                isOperatorConfigured = true,
                operatorName = trimmed
            )
        }
    }

    fun performRetentionCleanup() {
        viewModelScope.launch(Dispatchers.IO) {
            repository.purgeExpiredChats()
            _uiState.value = _uiState.value.copy(
                lastSyncTimestamp = System.currentTimeMillis()
            )
        }
    }

    fun onWebPageStarted() {
        _uiState.value = _uiState.value.copy(isWebsiteLoading = true, webErrorMessage = null)
    }

    fun onWebProgressChanged(progress: Int) {
        _uiState.value = _uiState.value.copy(
            loadProgress = progress,
            isWebsiteLoading = progress < 100
        )
    }

    fun onWebPageFinished() {
        _uiState.value = _uiState.value.copy(
            isWebsiteLoading = false,
            lastSyncTimestamp = System.currentTimeMillis()
        )
        performRetentionCleanup()
    }

    fun onWebError(description: String) {
        _uiState.value = _uiState.value.copy(
            isWebsiteLoading = false,
            webErrorMessage = description
        )
    }

    fun toggleStorageSheet(show: Boolean) {
        _uiState.value = _uiState.value.copy(showStorageSheet = show)
    }
}
