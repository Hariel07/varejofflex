# 🚀 Configuração de Deploy - VarejoFlex

## ❌ Erro: "Invalid scheme, expected connection string to start with mongodb://"

Este erro indica que a variável `MONGODB_URI` não está configurada na Vercel. Siga os passos abaixo:

## 📋 Variáveis de Ambiente Necessárias

Configure estas variáveis no painel da Vercel:

### 1. MONGODB_URI
```
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/varejoflex?retryWrites=true&w=majority&appName=Cluster0
```

### 2. NEXTAUTH_SECRET
```
um-segredo-muito-forte-com-pelo-menos-64-caracteres-para-seguranca-maxima
```

### 3. NEXTAUTH_URL
```
https://seu-projeto.vercel.app
```

### 4. NEXT_PUBLIC_APP_URL
```
https://seu-projeto.vercel.app
```

## 🔧 Como Configurar na Vercel

### Método 1: Interface Web
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto **varejofflex**
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Configure cada variável:
   - **Name**: `MONGODB_URI`
   - **Value**: Sua string de conexão MongoDB
   - **Environments**: Production, Preview, Development
6. Repita para todas as variáveis
7. **Redeploy** o projeto

### Método 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Configurar variáveis
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NEXT_PUBLIC_APP_URL production

# Redeploy
vercel --prod
```

## 🎯 Valores Atuais para Configurar

Use os valores do arquivo `.env.local`:

```bash
MONGODB_URI="mongodb+srv://Hariel07:Thmpv1996%40@cluster0.ivrgf0m.mongodb.net/varejoflex?retryWrites=true&w=majority&appName=Cluster0"
NEXTAUTH_SECRET="Thmpv1996@"
NEXTAUTH_URL="https://seu-projeto.vercel.app"
NEXT_PUBLIC_APP_URL="https://seu-projeto.vercel.app"
```

⚠️ **Importante**: Substitua `seu-projeto.vercel.app` pela URL real do seu projeto.

## ✅ Verificação

Após configurar, verifique nos logs da Vercel se aparece:
- `✅ MongoDB URI format is valid`
- `✅ MongoDB connected successfully`

## 🐛 Debug

Se ainda houver problemas, verifique:
1. MongoDB Atlas permite conexões de qualquer IP (0.0.0.0/0)
2. Usuário do MongoDB tem permissões corretas
3. Senha não contém caracteres especiais não codificados
4. Nome do banco de dados está correto

## 📞 Próximos Passos

Após corrigir, o deploy deve funcionar normalmente e você poderá:
1. Registrar usuários Owner com chave: `VAREJOFLEX_OWNER_2025`
2. Registrar lojistas normalmente
3. Acessar dashboards diferenciados