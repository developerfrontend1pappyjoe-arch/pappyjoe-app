# Use E: drive for Gradle cache and temp files (C: is often full on this machine).
$env:GRADLE_USER_HOME = "E:\gradle-cache"
$env:TEMP = "E:\rn-temp"
$env:TMP = "E:\rn-temp"
$env:JAVA_HOME = if ($env:JAVA_HOME) { $env:JAVA_HOME } else { "C:\Program Files\Java\jdk-17" }

New-Item -ItemType Directory -Force -Path $env:GRADLE_USER_HOME, $env:TEMP | Out-Null

Write-Host "GRADLE_USER_HOME=$env:GRADLE_USER_HOME"
Write-Host "TEMP=$env:TEMP"
