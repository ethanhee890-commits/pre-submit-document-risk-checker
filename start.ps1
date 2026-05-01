$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$candidatePorts = @(4173, 4187, 4190, 5173)

if (-not $env:PORT) {
  foreach ($candidatePort in $candidatePorts) {
    $occupied = Get-NetTCPConnection -LocalPort $candidatePort -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $occupied) {
      $env:PORT = [string]$candidatePort
      break
    }
  }
}

if (-not $env:PORT) {
  $env:PORT = "4173"
}

if (Test-Path -LiteralPath $bundledNode) {
  & $bundledNode (Join-Path $projectRoot "server.js")
  exit $LASTEXITCODE
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  & $nodeCommand.Source (Join-Path $projectRoot "server.js")
  exit $LASTEXITCODE
}

Write-Error "Node.js 실행 파일을 찾지 못했습니다. Codex 번들 Node 또는 로컬 Node.js 설치가 필요합니다."
