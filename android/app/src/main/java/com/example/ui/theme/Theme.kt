package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val GirionixColorScheme = darkColorScheme(
    primary = GirionixCyan,
    onPrimary = Color.Black,
    primaryContainer = GirionixSurfaceVariant,
    onPrimaryContainer = GirionixCyan,
    secondary = GirionixPurpleLight,
    onSecondary = Color.White,
    secondaryContainer = GirionixSurfaceVariant,
    onSecondaryContainer = GirionixPurpleLight,
    tertiary = GirionixCyanDim,
    onTertiary = Color.Black,
    background = GirionixObsidian,
    onBackground = GirionixTextPrimary,
    surface = GirionixSurface,
    onSurface = GirionixTextPrimary,
    surfaceVariant = GirionixSurfaceVariant,
    onSurfaceVariant = GirionixTextSecondary,
    outline = GirionixCardBorder
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = GirionixColorScheme,
        typography = Typography,
        content = content
    )
}
