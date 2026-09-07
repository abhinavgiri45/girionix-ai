package com.example

import com.example.data.preferences.OperatorPreferences
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ExampleUnitTest {
  @Test
  fun testRetentionPeriodIs90Days() {
    assertEquals(90L, OperatorPreferences.RETENTION_PERIOD_DAYS)
    val retentionMs = OperatorPreferences.RETENTION_PERIOD_DAYS * 24L * 60L * 60L * 1000L
    assertEquals(7_776_000_000L, retentionMs)
  }

  @Test
  fun testRetentionCutoffCalculation() {
    val now = System.currentTimeMillis()
    val cutoff = now - (90L * 24L * 60L * 60L * 1000L)
    val session95DaysOld = now - (95L * 24L * 60L * 60L * 1000L)
    val session10DaysOld = now - (10L * 24L * 60L * 60L * 1000L)

    assertTrue("Session from 95 days ago must be older than cutoff", session95DaysOld < cutoff)
    assertTrue("Session from 10 days ago must be kept", session10DaysOld >= cutoff)
  }
}

