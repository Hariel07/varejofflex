# deploy-vars.ps1 - Script para configurar variáveis de ambiente no Vercel

Write-Host "================================" -ForegroundColor Green
Write-Host "CONFIGURAÇÃO DE VARIÁVEIS - VERCEL" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Execute os comandos abaixo no terminal:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. NEXTAUTH_SECRET (obrigatório para NextAuth funcionar):" -ForegroundColor Cyan
Write-Host "   vercel env add NEXTAUTH_SECRET production" -ForegroundColor White
Write-Host "   Valor: FTbJBhfMXsAiuYBRIYrYFzgq3o9bnqUvZPI7qnfaiHk=" -ForegroundColor Gray
Write-Host ""
Write-Host "2. NEXTAUTH_URL (URL base da aplicação):" -ForegroundColor Cyan
Write-Host "   vercel env add NEXTAUTH_URL production" -ForegroundColor White
Write-Host "   Valor: https://varejofflex-git-main-hariel-soares-marans-projects.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Para verificar variáveis existentes:" -ForegroundColor Cyan
Write-Host "   vercel env ls" -ForegroundColor White
Write-Host ""
Write-Host "4. Após adicionar as variáveis, fazer redeploy:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "VARIÁVEIS ATUAIS NECESSÁRIAS:" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ MONGODB_URI - Configurado" -ForegroundColor Green
Write-Host "❓ NEXTAUTH_SECRET - Verificar" -ForegroundColor Yellow
Write-Host "❓ NEXTAUTH_URL - Verificar" -ForegroundColor Yellow
Write-Host "✅ OWNER_SECRET_KEY - Configurado" -ForegroundColor Green
Write-Host ""

# Opcional: Executar comandos automaticamente se o usuário confirmar
$confirm = Read-Host "Deseja configurar automaticamente as variáveis? (y/N)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host ""
    Write-Host "Configurando NEXTAUTH_SECRET..." -ForegroundColor Yellow
    $env:NEXTAUTH_SECRET = "FTbJBhfMXsAiuYBRIYrYFzgq3o9bnqUvZPI7qnfaiHk="
    echo $env:NEXTAUTH_SECRET | vercel env add NEXTAUTH_SECRET production
    
    Write-Host "Configurando NEXTAUTH_URL..." -ForegroundColor Yellow
    $env:NEXTAUTH_URL = "https://varejofflex-git-main-hariel-soares-marans-projects.vercel.app"
    echo $env:NEXTAUTH_URL | vercel env add NEXTAUTH_URL production
    
    Write-Host ""
    Write-Host "Fazendo redeploy..." -ForegroundColor Yellow
    vercel --prod
}