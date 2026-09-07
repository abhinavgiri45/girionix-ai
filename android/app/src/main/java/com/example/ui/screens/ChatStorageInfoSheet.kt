package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoDelete
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.GirionixCardBorder
import com.example.ui.theme.GirionixCyan
import com.example.ui.theme.GirionixGreen
import com.example.ui.theme.GirionixObsidian
import com.example.ui.theme.GirionixPurpleLight
import com.example.ui.theme.GirionixSurface
import com.example.ui.theme.GirionixSurfaceVariant
import com.example.ui.theme.GirionixTextMuted
import com.example.ui.theme.GirionixTextPrimary
import com.example.ui.theme.GirionixTextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatStorageInfoSheet(
    operatorName: String,
    sessionCount: Int,
    isOnline: Boolean,
    onDismiss: () -> Unit,
    onRunCleanup: () -> Unit,
    onReloadWebsite: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = GirionixSurface,
        scrimColor = Color.Black.copy(alpha = 0.7f),
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 16.dp)
        ) {
            // Sheet Title
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(GirionixCyan.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Storage,
                            contentDescription = null,
                            tint = GirionixCyan,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Girionix Local Vault",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = GirionixTextPrimary
                        )
                        Text(
                            text = "90-Day Auto Retention Policy",
                            fontSize = 12.sp,
                            color = GirionixPurpleLight
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isOnline) GirionixGreen.copy(alpha = 0.15f) else Color(0xFFEF4444).copy(alpha = 0.15f))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (isOnline) "LIVE SYNC" else "OFFLINE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isOnline) GirionixGreen else Color(0xFFEF4444)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Operator Badge Card
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(GirionixSurfaceVariant)
                    .border(1.dp, GirionixCardBorder, RoundedCornerShape(12.dp))
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = GirionixCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "ACTIVE OPERATOR",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = GirionixTextMuted,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = operatorName.ifEmpty { "Default Operator" },
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = GirionixTextPrimary
                    )
                }
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Verified",
                    tint = GirionixGreen,
                    modifier = Modifier.size(16.dp)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 90-Day Retention Status Card
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(GirionixSurfaceVariant)
                    .border(1.dp, GirionixCardBorder, RoundedCornerShape(12.dp))
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.AutoDelete,
                    contentDescription = null,
                    tint = GirionixPurpleLight,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "RETENTION LIFECYCLE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = GirionixTextMuted,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "90 Days Vault Retention",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = GirionixTextPrimary
                    )
                    Text(
                        text = "Chats older than 90 days are automatically pruned from local storage.",
                        fontSize = 11.sp,
                        color = GirionixTextSecondary,
                        lineHeight = 15.sp,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Website Live Sync Card
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(GirionixSurfaceVariant)
                    .border(1.dp, GirionixCardBorder, RoundedCornerShape(12.dp))
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.CloudDone,
                    contentDescription = null,
                    tint = GirionixCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "CONNECTED WEB REPOSITORY",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = GirionixTextMuted,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "https://girionix-ai.pages.dev/",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Normal,
                        color = GirionixCyan
                    )
                    Text(
                        text = "Any changes deployed to the website are pushed automatically to this app.",
                        fontSize = 11.sp,
                        color = GirionixTextSecondary,
                        lineHeight = 15.sp,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        onRunCleanup()
                        onDismiss()
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("run_retention_cleanup_button"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.DeleteSweep,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Clean Expired", fontSize = 13.sp)
                }

                Button(
                    onClick = {
                        onReloadWebsite()
                        onDismiss()
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("sync_website_button"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GirionixCyan,
                        contentColor = Color.Black
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Sync Live Site", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
