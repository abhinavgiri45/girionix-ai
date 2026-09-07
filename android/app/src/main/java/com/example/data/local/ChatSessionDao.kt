package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ChatSessionDao {

    @Query("SELECT * FROM chat_sessions ORDER BY updatedAt DESC")
    fun getAllSessions(): Flow<List<ChatSessionEntity>>

    @Query("SELECT * FROM chat_sessions ORDER BY updatedAt DESC")
    suspend fun getAllSessionsDirect(): List<ChatSessionEntity>

    @Query("SELECT * FROM chat_sessions WHERE id = :sessionId LIMIT 1")
    suspend fun getSessionById(sessionId: String): ChatSessionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: ChatSessionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSessions(sessions: List<ChatSessionEntity>)

    @Query("DELETE FROM chat_sessions WHERE id = :sessionId")
    suspend fun deleteSession(sessionId: String)

    /**
     * Delete sessions older than the specified cutoff timestamp (e.g. 90 days ago).
     */
    @Query("DELETE FROM chat_sessions WHERE createdAt < :cutoffTimestamp OR updatedAt < :cutoffTimestamp")
    suspend fun deleteExpiredSessions(cutoffTimestamp: Long): Int

    @Query("SELECT COUNT(*) FROM chat_sessions")
    fun getSessionCount(): Flow<Int>

    @Query("DELETE FROM chat_sessions")
    suspend fun clearAll()
}
