# ============================================================
# Registration Wizard — Folder Structure Creator
# Run from the parent directory where you want the project.
# Usage:  .\create-structure.ps1
# ============================================================

$base = "registration-wizard"

$folders = @(
  "$base/src/components/steps",
  "$base/src/components/ui",
  "$base/src/hooks",
  "$base/src/lib",
  "$base/src/styles"
)

$files = @(
  "$base/index.html",
  "$base/vite.config.js",
  "$base/package.json",
  "$base/.gitignore",
  "$base/src/main.jsx",
  "$base/src/App.jsx",
  "$base/src/styles/globals.css",
  "$base/src/lib/schemas.js",
  "$base/src/components/Cursor.jsx",
  "$base/src/components/Navbar.jsx",
  "$base/src/components/Footer.jsx",
  "$base/src/components/RegistrationWizard.jsx",
  "$base/src/components/ui/ProgressBar.jsx",
  "$base/src/components/steps/Step1.jsx",
  "$base/src/components/steps/Step2.jsx",
  "$base/src/components/steps/Step3.jsx",
  "$base/src/components/steps/SuccessScreen.jsx"
)

# Create folders
foreach ($folder in $folders) {
  New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

# Touch files (create empty placeholders if they don't exist)
foreach ($file in $files) {
  if (-not (Test-Path $file)) {
    New-Item -ItemType File -Path $file -Force | Out-Null
  }
}

Write-Host ""
Write-Host "✅  Folder structure created under ./$base" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  cd $base"
Write-Host "  npm install"
Write-Host "  npm run dev"
Write-Host ""
