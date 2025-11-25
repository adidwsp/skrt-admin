<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Scan Barcode</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Arahkan kamera ke barcode tiket</p>
          </div>
          <button
            @click="$router.back()"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Status Info -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p class="text-sm text-blue-600 dark:text-blue-400">Total Scanned</p>
            <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ scannedCount }}</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p class="text-sm text-green-600 dark:text-green-400">Success</p>
            <p class="text-2xl font-bold text-green-700 dark:text-green-300">{{ successCount }}</p>
          </div>
        </div>
      </div>

      <!-- Scanner Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <!-- Camera Preview -->
        <div class="relative">
          <video
            ref="videoElement"
            class="w-full h-64 object-cover bg-black"
            :class="{ 'hidden': !cameraActive }"
            playsinline
          ></video>
          
          <!-- Scanner Overlay -->
          <div v-if="cameraActive" class="absolute inset-0 flex items-center justify-center">
            <div class="border-2 border-green-400 rounded-lg w-64 h-32 relative">
              <!-- Scanning Animation -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
              <!-- Corner Borders -->
              <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400"></div>
              <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400"></div>
              <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400"></div>
              <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400"></div>
            </div>
          </div>

          <!-- Camera Placeholder -->
          <div v-if="!cameraActive" class="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Kamera siap untuk scan</p>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="p-4">
          <div class="flex space-x-3 mb-4">
            <button
              @click="toggleCamera"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              :disabled="loading"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!cameraActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path v-if="cameraActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
              </svg>
              <span>{{ cameraActive ? 'Stop Camera' : 'Start Camera' }}</span>
            </button>
            
            <button
              @click="toggleFlash"
              class="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              :disabled="!cameraActive || !hasFlash"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </button>
          </div>

          <!-- Manual Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Atau input manual ticket number:
            </label>
            <div class="flex space-x-2">
              <input
                v-model="manualInput"
                type="text"
                placeholder="Masukkan ticket number"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                @keypress.enter="processManualInput"
              />
              <button
                @click="processManualInput"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                :disabled="loading || !manualInput"
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Scans -->
      <div v-if="recentScans.length > 0" class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scan Terakhir</h3>
        <div class="space-y-3">
          <div
            v-for="scan in recentScans"
            :key="scan.ticket_number"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ scan.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ scan.ticket_number }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="scan.success ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
            >
              {{ scan.success ? 'Berhasil' : 'Gagal' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="showSuccessModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-auto text-center"
        @click.stop
      >
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Scan Berhasil!</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-2">
          Tiket <strong>{{ lastScannedTicket?.ticket_number }}</strong> berhasil di-scan.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {{ lastScannedTicket?.name }}
        </p>

        <button
          @click="showSuccessModal = false"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Lanjutkan Scan
        </button>
      </div>
    </div>

    <!-- Error Modal -->
    <div
      v-if="showErrorModal"
      class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="showErrorModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-auto text-center"
        @click.stop
      >
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Scan Gagal</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ errorMessage }}
        </p>

        <button
          @click="showErrorModal = false"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../utils/supabase'

interface Ticket {
  id: string
  name: string
  ticket_number: string
  is_scanned: boolean
}

interface ScanHistory {
  ticket_number: string
  name: string
  success: boolean
  timestamp: Date
}

// State
const videoElement = ref<HTMLVideoElement>()
const cameraActive = ref(false)
const hasFlash = ref(false)
const flashOn = ref(false)
const loading = ref(false)
const scannedCount = ref(0)
const successCount = ref(0)
const manualInput = ref('')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const lastScannedTicket = ref<Ticket | null>(null)
const recentScans = ref<ScanHistory[]>([])

// Barcode detector (modern browsers)
let barcodeDetector: any = null
let stream: MediaStream | null = null
let animationFrameId: number | null = null

// Initialize barcode detector
onMounted(async () => {
  if ('BarcodeDetector' in window) {
    // @ts-ignore
    barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'code_128', 'code_39', 'ean_13'] })
  } else {
    console.warn('Barcode Detection API not supported')
  }

  // Load scan history from localStorage
  const savedScans = localStorage.getItem('recentScans')
  if (savedScans) {
    recentScans.value = JSON.parse(savedScans)
  }

  // Auto-start camera on mobile
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    setTimeout(() => {
      startCamera()
    }, 1000)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  stopCamera()
})

// Camera controls
const startCamera = async () => {
  try {
    loading.value = true
    
    // Request camera permissions
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    })

    if (videoElement.value) {
      videoElement.value.srcObject = stream
      await videoElement.value.play()
      cameraActive.value = true
      startBarcodeDetection()
    }

    // Check if device has flash/torch
    const track = stream.getVideoTracks()[0]
    // @ts-ignore
    hasFlash.value = track.getCapabilities().torch !== undefined

  } catch (error) {
    console.error('Error accessing camera:', error)
    errorMessage.value = 'Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.'
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

const stopCamera = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  cameraActive.value = false
  flashOn.value = false
}

const toggleCamera = () => {
  if (cameraActive.value) {
    stopCamera()
  } else {
    startCamera()
  }
}

const toggleFlash = async () => {
  if (!stream || !hasFlash.value) return

  const track = stream.getVideoTracks()[0]
  try {
    // @ts-ignore
    await track.applyConstraints({
      advanced: [{ torch: !flashOn.value }]
    })
    flashOn.value = !flashOn.value
  } catch (error) {
    console.error('Error toggling flash:', error)
  }
}

// Barcode detection
const startBarcodeDetection = () => {
  if (!barcodeDetector || !videoElement.value) return

  const detectBarcode = async () => {
    if (!barcodeDetector || !videoElement.value || videoElement.value.readyState !== 4) {
      animationFrameId = requestAnimationFrame(detectBarcode)
      return
    }

    try {
      const barcodes = await barcodeDetector.detect(videoElement.value)
      
      if (barcodes.length > 0) {
        const barcode = barcodes[0]
        await processScannedCode(barcode.rawValue)
      }
    } catch (error) {
      console.error('Barcode detection error:', error)
    }

    animationFrameId = requestAnimationFrame(detectBarcode)
  }

  detectBarcode()
}

// Process scanned barcode
const processScannedCode = async (code: string) => {
  if (loading.value) return

  loading.value = true
  scannedCount.value++

  try {
    // Find ticket in database
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', code.trim())
      .single()

    if (error) {
      throw new Error('Tiket tidak ditemukan')
    }

    if (!ticket) {
      throw new Error('Tiket tidak valid')
    }

    if (ticket.is_scanned) {
      throw new Error('Tiket sudah di-scan sebelumnya')
    }

    // Update ticket as scanned
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ 
        is_scanned: true,
        scanned_at: new Date().toISOString()
      })
      .eq('id', ticket.id)

    if (updateError) {
      throw new Error('Gagal update status tiket')
    }

    // Success
    successCount.value++
    lastScannedTicket.value = ticket
    
    // Add to recent scans
    recentScans.value.unshift({
      ticket_number: ticket.ticket_number,
      name: ticket.name,
      success: true,
      timestamp: new Date()
    })

    // Keep only last 5 scans
    if (recentScans.value.length > 5) {
      recentScans.value = recentScans.value.slice(0, 5)
    }

    // Save to localStorage
    localStorage.setItem('recentScans', JSON.stringify(recentScans.value))

    // Show success modal
    showSuccessModal.value = true

    // Play success sound (optional)
    playBeepSound()

  } catch (error: any) {
    errorMessage.value = error.message
    
    // Add failed scan to history
    recentScans.value.unshift({
      ticket_number: code,
      name: 'Tiket tidak ditemukan',
      success: false,
      timestamp: new Date()
    })

    if (recentScans.value.length > 5) {
      recentScans.value = recentScans.value.slice(0, 5)
    }

    localStorage.setItem('recentScans', JSON.stringify(recentScans.value))
    
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

// Manual input processing
const processManualInput = async () => {
  if (!manualInput.value.trim()) return

  await processScannedCode(manualInput.value.trim())
  manualInput.value = ''
}

// Utility functions
const playBeepSound = () => {
  // Simple beep sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('Audio not supported')
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
}

.scan-line {
  animation: scan-line 2s ease-in-out infinite;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Dark mode improvements */
.dark .bg-gray-50 {
  background-color: #111827;
}

.dark .bg-white {
  background-color: #1f2937;
}
</style>