package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.GirionixCardBorder
import com.example.ui.theme.GirionixCyan
import com.example.ui.theme.GirionixObsidian
import com.example.ui.theme.GirionixPurple
import com.example.ui.theme.GirionixPurpleLight
import com.example.ui.theme.GirionixSurface
import com.example.ui.theme.GirionixSurfaceVariant
import com.example.ui.theme.GirionixTextMuted
import com.example.ui.theme.GirionixTextPrimary
import com.example.ui.theme.GirionixTextSecondary

@Composable
fun OperatorOnboardingScreen(
    onOperatorSubmitted: (String) -> Unit
) {
    var nameInput by remember { mutableStateOf("") }
    var isError by remember { mutableStateOf(false) }

    val submitAction = {
        if (nameInput.trim().isNotEmpty()) {
            onOperatorSubmitted(nameInput.trim())
        } else {
            isError = true
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(GirionixObsidian)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        // Ambient background subtle glow
        Box(
            modifier = Modifier
                .size(320.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            GirionixCyan.copy(alpha = 0.12f),
                            GirionixPurple.copy(alpha = 0.08f),
                            Color.Transparent
                        )
                    ),
                    shape = CircleShape
                )
        )

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, GirionixCardBorder, RoundedCornerShape(24.dp)),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = GirionixSurface.copy(alpha = 0.92f))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(28.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Cybernetic Emblem Header
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(GirionixCyan.copy(alpha = 0.2f), GirionixPurple.copy(alpha = 0.2f))
                            )
                        )
                        .border(1.dp, GirionixCyan.copy(alpha = 0.4f), RoundedCornerShape(18.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "Girionix Sovereign Core",
                        tint = GirionixCyan,
                        modifier = Modifier.size(36.dp)
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "GIRIONIX AI",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 3.sp,
                    color = GirionixCyan,
                    fontFamily = FontFamily.Monospace
                )

                Text(
                    text = "THINK • CREATE • EXPLORE",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    letterSpacing = 2.sp,
                    color = GirionixPurpleLight,
                    modifier = Modifier.padding(top = 2.dp)
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Operator Authentication",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = GirionixTextPrimary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Enter your operator identifier once to unlock the workspace. Your profile and chats are saved in local storage with 90-day vault retention.",
                    fontSize = 13.sp,
                    color = GirionixTextSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                OutlinedTextField(
                    value = nameInput,
                    onValueChange = {
                        nameInput = it
                        if (isError && it.isNotBlank()) isError = false
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("operator_name_input"),
                    label = { Text("Operator Name") },
                    placeholder = { Text("e.g. Abhinav") },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Operator Icon",
                            tint = if (isError) Color(0xFFEF4444) else GirionixCyan
                        )
                    },
                    isError = isError,
                    supportingText = {
                        if (isError) {
                            Text("Please enter your operator name", color = Color(0xFFEF4444))
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(14.dp),
                    keyboardOptions = KeyboardOptions(
                        capitalization = KeyboardCapitalization.Words,
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(onDone = { submitAction() }),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = GirionixTextPrimary,
                        unfocusedTextColor = GirionixTextPrimary,
                        focusedBorderColor = GirionixCyan,
                        unfocusedBorderColor = GirionixCardBorder,
                        focusedLabelColor = GirionixCyan,
                        unfocusedLabelColor = GirionixTextMuted,
                        focusedContainerColor = GirionixSurfaceVariant,
                        unfocusedContainerColor = GirionixSurfaceVariant
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // One-time prompt notice chip
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(GirionixSurfaceVariant)
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = GirionixCyan,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "First-time setup only. Stored securely on device.",
                        fontSize = 11.sp,
                        color = GirionixTextMuted
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = { submitAction() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("initialize_operator_button"),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GirionixCyan,
                        contentColor = Color.Black
                    )
                ) {
                    Text(
                        text = "Enter Workspace",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "Proceed",
                        tint = Color.Black,
                        modifier = Modifier.size(18.dp)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Specs footer tags
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Sync,
                            contentDescription = null,
                            tint = GirionixTextMuted,
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Auto-Synced",
                            fontSize = 11.sp,
                            color = GirionixTextMuted
                        )
                    }

                    Text(text = "•", color = GirionixTextMuted, fontSize = 11.sp)

                    Text(
                        text = "90-Day Local Retention",
                        fontSize = 11.sp,
                        color = GirionixTextMuted
                    )
                }
            }
        }
    }
}
