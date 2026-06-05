# Capture crash logs from a connected Android device (USB debugging on).
# Usage: .\scripts\android-logcat-crash.ps1
# Reproduce the crash, then press Ctrl+C and inspect pappyjoe-crash.log

$logFile = Join-Path $PSScriptRoot "..\pappyjoe-crash.log"
Write-Host "Logging to $logFile"
Write-Host "1. Open the app on the device and reproduce the crash."
Write-Host "2. Press Ctrl+C when done."
Write-Host ""

adb logcat -c
adb logcat -v time ReactNative:V ReactNativeJS:V AndroidRuntime:E SoLoader:W Hermes:V "com.pappyjoe.app":V *:S | Tee-Object -FilePath $logFile
