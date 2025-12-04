#!/bin/bash

echo "🚀 Configurando projeto FinUnity..."

# Instalar dependências raiz
echo "📦 Instalando dependências raiz..."
npm install

# Instalar dependências backend
echo "📦 Instalando dependências backend..."
cd backend
npm install
cd ..

# Instalar dependências frontend
echo "📦 Instalando dependências frontend..."
cd frontend
npm install
cd ..

echo "✅ Configuração concluída!"
echo ""
echo "Próximos passos:"
echo "1. Configure o arquivo backend/.env com suas credenciais do banco"
echo "2. Execute o schema SQL: psql -U usuario -d finunity -f database/schema.sql"
echo "3. Execute: npm run dev"

