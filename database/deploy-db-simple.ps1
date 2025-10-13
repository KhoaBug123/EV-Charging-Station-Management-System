# =====================================================
# Script: Deploy Database - SkaEV Project (Simple Version)
# =====================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SkaEV Database Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra file SQL
$scriptPath = Join-Path $PSScriptRoot "DEPLOY_COMPLETE.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: File DEPLOY_COMPLETE.sql not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Found SQL script file" -ForegroundColor Green
Write-Host ""

# SQL Server configuration
Write-Host "SQL Server Configuration:" -ForegroundColor Yellow
Write-Host "  Common options:" -ForegroundColor Gray
Write-Host "    - localhost (default instance)" -ForegroundColor Gray
Write-Host "    - localhost\SQLEXPRESS (SQL Express)" -ForegroundColor Gray
Write-Host ""

$serverName = Read-Host "Enter SQL Server instance [default: localhost]"
if ([string]::IsNullOrWhiteSpace($serverName)) {
    $serverName = "localhost"
}

Write-Host ""
Write-Host "Authentication:" -ForegroundColor Yellow
Write-Host "  1. Windows Authentication (Recommended)" -ForegroundColor Gray
Write-Host "  2. SQL Server Authentication" -ForegroundColor Gray
Write-Host ""

$authChoice = Read-Host "Choose [1/2, default: 1]"
if ([string]::IsNullOrWhiteSpace($authChoice)) {
    $authChoice = "1"
}

# Build sqlcmd command
$sqlcmdArgs = @("-S", $serverName)

if ($authChoice -eq "1") {
    $sqlcmdArgs += "-E"
    Write-Host "Using Windows Authentication" -ForegroundColor Green
}
else {
    $username = Read-Host "Enter SQL Username [default: sa]"
    if ([string]::IsNullOrWhiteSpace($username)) {
        $username = "sa"
    }
    
    $securePassword = Read-Host "Enter Password" -AsSecureString
    $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    )
    
    $sqlcmdArgs += @("-U", $username, "-P", $password)
    Write-Host "Using SQL Server Authentication" -ForegroundColor Green
}

# Test connection
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow

$testArgs = $sqlcmdArgs + @("-Q", "SELECT @@VERSION", "-h", "-1")
$testOutput = & sqlcmd @testArgs 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Cannot connect to SQL Server!" -ForegroundColor Red
    Write-Host $testOutput -ForegroundColor Red
    exit 1
}

Write-Host "Connection successful!" -ForegroundColor Green
Write-Host ""

# Deploy database
Write-Host "Deploying database..." -ForegroundColor Yellow
Write-Host "(This may take 30-60 seconds)" -ForegroundColor Gray
Write-Host ""

$deployArgs = $sqlcmdArgs + @("-i", $scriptPath)
$deployOutput = & sqlcmd @deployArgs 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Database deployment failed!" -ForegroundColor Red
    Write-Host $deployOutput -ForegroundColor Red
    exit 1
}

Write-Host $deployOutput -ForegroundColor Gray
Write-Host ""
Write-Host "Database deployed successfully!" -ForegroundColor Green
Write-Host ""

# Verify
Write-Host "Verifying database..." -ForegroundColor Yellow

$verifyQuery = "USE SkaEV_DB; SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';"
$verifyArgs = $sqlcmdArgs + @("-Q", $verifyQuery, "-h", "-1")
$verifyOutput = & sqlcmd @verifyArgs 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Verification successful!" -ForegroundColor Green
    Write-Host "Total tables: $verifyOutput" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connection String:" -ForegroundColor Yellow

if ($authChoice -eq "1") {
    Write-Host "Server=$serverName;Database=SkaEV_DB;Trusted_Connection=True;TrustServerCertificate=True" -ForegroundColor Cyan
}
else {
    Write-Host "Server=$serverName;Database=SkaEV_DB;User Id=$username;Password=YOUR_PASSWORD;TrustServerCertificate=True" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update connection string in SkaEV.API/appsettings.json" -ForegroundColor Gray
Write-Host "  2. Run: cd SkaEV.API && dotnet build" -ForegroundColor Gray
Write-Host "  3. Run: dotnet run" -ForegroundColor Gray
Write-Host ""
