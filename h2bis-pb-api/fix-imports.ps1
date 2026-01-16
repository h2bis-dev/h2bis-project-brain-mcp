# Fix ES Module Imports - Add .js extensions to all relative imports
# This script processes all TypeScript files and adds .js extensions where missing

$srcPath = "src"
$files = Get-ChildItem -Path $srcPath -Recurse -Filter "*.ts"

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Pattern 1: from '../path' or from '../../path' or from './path' (without .js)
    # Only match if it doesn't already end with .js
    $content = $content -replace "from\s+(['\"])(\.\./[^'\"]+)(?<!\.js)\1", "from `$1`$2.js`$1"
    $content = $content -replace "from\s+(['\"])(\./[^'\"]+)(?<!\.js)\1", "from `$1`$2.js`$1"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "`nTotal files fixed: $count"
