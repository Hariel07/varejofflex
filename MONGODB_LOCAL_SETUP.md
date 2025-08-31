# 🔧 Configuração MongoDB Local

Este arquivo contém as instruções para configurar o MongoDB local durante o desenvolvimento.

## 📋 Passos para Configurar MongoDB Local

### 1. **Verificar se MongoDB está instalado**
```bash
mongod --version
```

### 2. **Iniciar o serviço MongoDB**

**No Windows:**
```bash
# Opção 1: Iniciar como serviço
net start MongoDB

# Opção 2: Iniciar manualmente
mongod --dbpath "C:\data\db"
```

**No Linux/Mac:**
```bash
# Opção 1: Com systemctl
sudo systemctl start mongod

# Opção 2: Manualmente
mongod --dbpath /data/db
```

### 3. **Verificar se está funcionando**
```bash
# Conectar ao MongoDB
mongosh

# Ou no shell do mongo:
show dbs
```

### 4. **Configuração no Projeto**

O arquivo `.env.local` já foi configurado para usar MongoDB local:

```bash
# MongoDB Local (para desenvolvimento)
MONGODB_URI="mongodb://localhost:27017/varejoflex"
```

### 5. **Comandos Úteis**

```bash
# Conectar ao banco varejoflex
mongosh varejoflex

# Ver coleções
show collections

# Ver usuários
db.users.find()

# Limpar banco para testes
db.dropDatabase()
```

## 🔄 Para Voltar ao MongoDB Atlas

Quando terminar o desenvolvimento e quiser usar o MongoDB Atlas:

1. Comente a linha do MongoDB local no `.env.local`
2. Descomente a linha do MongoDB Atlas
3. Faça deploy

```bash
# MongoDB Atlas (produção)
MONGODB_URI="mongodb+srv://Hariel07:Thmpv1996%40@cluster0.ivrgf0m.mongodb.net/varejoflex?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000&maxPoolSize=10"

# MongoDB Local (comentado)
# MONGODB_URI="mongodb://localhost:27017/varejoflex"
```

## ⚠️ Observações Importantes

1. **Backup**: Se você tem dados importantes no Atlas, faça backup antes
2. **Porta**: Certifique-se que a porta 27017 está livre
3. **Segurança**: MongoDB local não tem autenticação por padrão
4. **Performance**: MongoDB local pode ser mais rápido durante desenvolvimento

## 🚀 Testando a Configuração

Após configurar, teste executando:

```bash
npm run dev
```

Se aparecer no console:
```
✅ MongoDB connected successfully
```

Então está funcionando corretamente!