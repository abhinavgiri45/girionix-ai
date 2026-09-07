package com.example.data.preferences

import android.content.Context
import android.content.SharedPreferences

/**
 * Manages persistent preferences for the Operator Name and first-launch state.
 * Ensured to ask the operator name only for the first time.
 */
class OperatorPreferences(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "girionix_operator_prefs"
        private const val KEY_OPERATOR_NAME = "key_operator_name"
        private const val KEY_IS_SETUP_COMPLETED = "key_is_setup_completed"
        private const val KEY_LAST_CLEANUP_TIMESTAMP = "key_last_cleanup_timestamp"
        const val RETENTION_PERIOD_DAYS = 90L
    }

    fun isSetupCompleted(): Boolean {
        return prefs.getBoolean(KEY_IS_SETUP_COMPLETED, false) && !getOperatorName().isNullOrBlank()
    }

    fun getOperatorName(): String? {
        return prefs.getString(KEY_OPERATOR_NAME, null)
    }

    fun saveOperatorName(name: String) {
        val trimmed = name.trim()
        prefs.edit()
            .putString(KEY_OPERATOR_NAME, trimmed)
            .putBoolean(KEY_IS_SETUP_COMPLETED, trimmed.isNotEmpty())
            .apply()
    }

    fun getLastCleanupTimestamp(): Long {
        return prefs.getLong(KEY_LAST_CLEANUP_TIMESTAMP, 0L)
    }

    fun recordCleanupTimestamp(timestamp: Long = System.currentTimeMillis()) {
        prefs.edit().putLong(KEY_LAST_CLEANUP_TIMESTAMP, timestamp).apply()
    }

    fun clearAll() {
        prefs.edit().clear().apply()
    }
}
