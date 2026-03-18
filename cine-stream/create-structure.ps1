# ============================================================
# Cine-Stream — Folder Structure Creator
# Run from the parent directory: .\create-structure.ps1
# ============================================================

$base = "cine-stream"

$folders = @(
  "$base/src/components",
  "$base/src/hooks",
  "$base/src/lib",
  "$base/src/pages",
  "$base/src/styles"
)

$files = @(
  "$base/index.html",
  "$base/vite.config.js",
  "$base/package.json",
  "$base/.env.example",
  "$base/.gitignore",
  "$base/src/main.jsx",
  "$base/src/App.jsx",
  "$base/src/styles/globals.css",
  "$base/src/lib/tmdb.js",
  "$base/src/lib/favorites.js",
  "$base/src/hooks/useDebounce.js",
  "$base/src/hooks/useInfiniteScroll.js",
  "$base/src/hooks/useMovies.js",
  "$base/src/hooks/useFavorites.js",
  "$base/src/components/Navbar.jsx",
  "$base/src/components/MovieCard.jsx",
  "$base/src/components/SkeletonGrid.jsx",
  "$base/src/components/MoodMatcher.jsx",
  "$base/src/components/GenrePills.jsx",
  "$base/src/components/Toast.jsx",
  "$base/src/pages/Home.jsx",
  "$base/src/pages/Favorites.jsx"
)

foreach ($folder in $folders) {
  New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

foreach ($file in $files) {
  if (-not (Test-Path $file)) {
    New-Item -ItemType File -Path $file -Force | Out-Null
  }
}

Write-Host ""
Write-Host "✅  Folder structure created under ./$base" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd $base"
Write-Host "  2. Copy .env.example to .env.local and add your API keys"
Write-Host "  3. npm install"
Write-Host "  4. npm run dev"
Write-Host ""
