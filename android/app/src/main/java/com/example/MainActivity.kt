package com.example
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.GirionixViewModel
import com.example.ui.screens.ChatStorageInfoSheet
import com.example.ui.screens.OperatorOnboardingScreen
import com.example.ui.screens.WorkspaceScreen
import com.example.ui.theme.GirionixObsidian
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier
                        .fillMaxSize()
                        .systemBarsPadding()
                        .imePadding(),
                    color = GirionixObsidian
                ) {
                    GirionixAppContent()
                }
            }
        }
    }
}

@Composable
fun GirionixAppContent(
    viewModel: GirionixViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val sessionCount by viewModel.sessionCount.collectAsStateWithLifecycle()

    if (!uiState.isOperatorConfigured) {
        // First-time launch: ask for operator name only once
        OperatorOnboardingScreen(
            onOperatorSubmitted = { name ->
                viewModel.saveOperatorName(name)
            }
        )
    } else {
        // Subsequent launches: directly load the sovereign workspace
        WorkspaceScreen(
            viewModel = viewModel,
            uiState = uiState
        )
    }

    // 90-Day local retention and sync information sheet
    if (uiState.showStorageSheet) {
        ChatStorageInfoSheet(
            operatorName = uiState.operatorName,
            sessionCount = sessionCount,
            isOnline = uiState.isOnline,
            onDismiss = { viewModel.toggleStorageSheet(false) },
            onRunCleanup = { viewModel.performRetentionCleanup() },
            onReloadWebsite = { viewModel.onWebPageStarted() }
        )
    }
}
