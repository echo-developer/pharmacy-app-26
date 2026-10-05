package com.pharmacyapp

import android.app.DownloadManager
import android.net.Uri
import android.os.Environment
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class InvoiceDownloadModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "InvoiceDownload"

  @ReactMethod
  fun downloadInvoice(url: String, requestedFileName: String, promise: Promise) {
    try {
      val uri = Uri.parse(url)
      require(uri.scheme == "https" || uri.scheme == "http") { "Invalid invoice URL." }

      val safeFileName = requestedFileName
        .replace(Regex("[^A-Za-z0-9._-]"), "_")
        .let { if (it.endsWith(".pdf", ignoreCase = true)) it else "$it.pdf" }

      val request = DownloadManager.Request(uri)
        .setTitle(safeFileName)
        .setDescription("Downloading your order invoice")
        .setMimeType("application/pdf")
        .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
        .setAllowedOverMetered(true)
        .setAllowedOverRoaming(false)
        .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, safeFileName)

      val manager = reactApplicationContext.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
      val downloadId = manager.enqueue(request)
      promise.resolve(downloadId.toString())
    } catch (error: Exception) {
      promise.reject("INVOICE_DOWNLOAD_FAILED", error.message, error)
    }
  }
}
