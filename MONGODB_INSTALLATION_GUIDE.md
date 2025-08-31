# 📥 Guia de Instalação MongoDB Local no Windows

## 🔍 Status Atual
MongoDB não foi encontrado no seu sistema. Siga este guia para instalar.

## 📋 Opções de Instalação

### Opção 1: MongoDB Community Server (Recomendado)

1. **Download:**
   - Acesse: https://www.mongodb.com/try/download/community
   - Escolha: Windows x64
   - Versão: 7.0 (atual)
   - Package: MSI

2. **Instalação:**
   - Execute o arquivo .msi baixado
   - Escolha "Complete" installation
   - Marque "Install MongoDB as a Service"
   - Marque "Run service as Network Service user"
   - Instale o MongoDB Compass (interface gráfica)

3. **Verificar Instalação:**
   ```powershell
   # Verificar se foi instalado
   mongod --version
   mongosh --version
   ```

### Opção 2: Chocolatey (Mais Rápido)

```powershell
# Instalar Chocolatey se não tiver
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar MongoDB
choco install mongodb

# Instalar MongoDB Shell
choco install mongosh
```

### Opção 3: Docker (Alternativa)

```powershell
# Se você tem Docker instalado
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Para parar
docker stop mongodb

# Para iniciar novamente
docker start mongodb
```

## 🚀 Configuração Após Instalação

### 1. Criar Diretório de Dados
```powershell
# Criar pasta para dados do MongoDB
mkdir C:\data\db
```

### 2. Iniciar MongoDB
```powershell
# Opção 1: Como serviço (automático)
net start MongoDB

# Opção 2: Manual
mongod --dbpath "C:\data\db"
```

### 3. Testar Conexão
```powershell
# Conectar ao MongoDB
mongosh

# Comandos de teste
show dbs
use varejoflex
show collections
exit
```

## 🔧 Configuração do Projeto

Após a instalação, sua configuração atual já está pronta:

```bash
# MongoDB Local (já configurado no .env.local)
MONGODB_URI="mongodb://localhost:27017/varejoflex"
```

## ✅ Teste Final

Execute o projeto e verifique se conecta:

```powershell
npm run dev
```

Deve aparecer no console:
```
✅ MongoDB connected successfully to LOCAL DATABASE
```

## 🆘 Solução de Problemas

### Erro: "MongoNetworkError"
- Verifique se MongoDB está rodando: `net start MongoDB`
- Verifique se a porta 27017 está livre

### Erro: "ENOENT"
- Certifique-se que existe a pasta: `C:\data\db`

### MongoDB não inicia
- Execute como administrador
- Verifique logs em: `C:\data\log\mongod.log`

## 📌 Comandos Úteis

```powershell
# Verificar status do serviço
sc query MongoDB

# Parar serviço
net stop MongoDB

# Iniciar serviço
net start MongoDB

# Ver processos MongoDB
tasklist | findstr mongo
```