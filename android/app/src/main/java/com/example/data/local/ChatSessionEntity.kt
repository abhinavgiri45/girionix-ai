package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Represents a chat session stored in local Room database.
 * Retained for 90 days before automatic deletion.
 */
@Entity(tableName = "chat_sessions")
data class ChatSessionEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val messagesJson: String = "[]",
    val modelUsed: String? = null
)
