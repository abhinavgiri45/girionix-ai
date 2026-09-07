package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [ChatSessionEntity::class], version = 1, exportSchema = false)
abstract class GirionixDatabase : RoomDatabase() {

    abstract fun chatSessionDao(): ChatSessionDao

    companion object {
        @Volatile
        private var INSTANCE: GirionixDatabase? = null

        fun getInstance(context: Context): GirionixDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    GirionixDatabase::class.java,
                    "girionix_ai_vault.db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
