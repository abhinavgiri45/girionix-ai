package com.example.data.repository

import com.example.data.local.ChatSessionDao
import com.example.data.local.ChatSessionEntity
import com.example.data.preferences.OperatorPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class ChatRepository(
    private val chatSessionDao: ChatSessionDao,
    private val operatorPreferences: OperatorPreferences
) {

    val allSessions: Flow<List<ChatSessionEntity>> = chatSessionDao.getAllSessions()
    val sessionCount: Flow<Int> = chatSessionDao.getSessionCount()

    suspend fun getOperatorName(): String {
        return operatorPreferences.getOperatorName() ?: ""
    }

    suspend fun saveOperatorName(name: String) {
        operatorPreferences.saveOperatorName(name)
    }

    fun isOperatorSetupDone(): Boolean {
        return operatorPreferences.isSetupCompleted()
    }

    /**
     * Purges sessions older than 90 days from the local Room database.
     * Returns the count of pruned sessions.
     */
    suspend fun purgeExpiredChats(): Int = withContext(Dispatchers.IO) {
        val retentionMs = OperatorPreferences.RETENTION_PERIOD_DAYS * 24L * 60L * 60L * 1000L
        val cutoff = System.currentTimeMillis() - retentionMs
        val deletedCount = chatSessionDao.deleteExpiredSessions(cutoff)
        operatorPreferences.recordCleanupTimestamp()
        deletedCount
    }

    /**
     * Synchronizes sessions received from the website localStorage into Room DB.
     * Parses the JSON payload from `girionix_chat_sessions` and persists each session,
     * discarding any session older than 90 days.
     */
    suspend fun syncSessionsFromJson(jsonString: String): Int = withContext(Dispatchers.IO) {
        if (jsonString.isBlank() || jsonString == "[]") return@withContext 0

        val retentionMs = OperatorPreferences.RETENTION_PERIOD_DAYS * 24L * 60L * 60L * 1000L
        val cutoff = System.currentTimeMillis() - retentionMs

        val entitiesToSave = mutableListOf<ChatSessionEntity>()
        try {
            val jsonArray = JSONArray(jsonString)
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.optJSONObject(i) ?: continue
                val id = obj.optString("id", "")
                if (id.isEmpty()) continue

                val title = obj.optString("title", "New Session")
                val createdAt = obj.optLong("createdAt", System.currentTimeMillis())
                val updatedAt = obj.optLong("updatedAt", createdAt)
                val messagesArray = obj.optJSONArray("messages")
                val messagesJson = messagesArray?.toString() ?: "[]"
                val modelUsed = obj.optString("model", "Girionix Pro")

                // Enforce 90-day retention filter
                if (createdAt >= cutoff || updatedAt >= cutoff) {
                    entitiesToSave.add(
                        ChatSessionEntity(
                            id = id,
                            title = title,
                            createdAt = createdAt,
                            updatedAt = updatedAt,
                            messagesJson = messagesJson,
                            modelUsed = modelUsed
                        )
                    )
                }
            }

            if (entitiesToSave.isNotEmpty()) {
                chatSessionDao.insertSessions(entitiesToSave)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Also clean up any older records in DB
        chatSessionDao.deleteExpiredSessions(cutoff)
    }

    /**
     * Exports current valid sessions from Room back to a JSON string
     * that matches the website's `girionix_chat_sessions` structure.
     */
    suspend fun exportValidSessionsJson(): String = withContext(Dispatchers.IO) {
        purgeExpiredChats()
        val sessions = chatSessionDao.getAllSessionsDirect()
        val array = JSONArray()
        for (session in sessions) {
            val obj = JSONObject().apply {
                put("id", session.id)
                put("title", session.title)
                put("createdAt", session.createdAt)
                put("updatedAt", session.updatedAt)
                put("messages", JSONArray(session.messagesJson))
                session.modelUsed?.let { put("model", it) }
            }
            array.put(obj)
        }
        array.toString()
    }
}
