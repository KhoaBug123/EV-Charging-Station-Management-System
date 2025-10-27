# Start backend in Development mode
# This ensures appsettings.Development.json is used
$env:ASPNETCORE_ENVIRONMENT = "Development"
Write-Host "Starting SkaEV API in Development mode..." -ForegroundColor Green
Write-Host "Using connection string from appsettings.Development.json" -ForegroundColor Yellow
dotnet run --no-launch-profile
