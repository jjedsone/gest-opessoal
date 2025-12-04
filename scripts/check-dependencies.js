const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando dependências...\n');

const checkPackageJson = (dir, name) => {
  const packagePath = path.join(dir, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.error(`❌ ${name}: package.json não encontrado`);
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const nodeModulesPath = path.join(dir, 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    console.warn(`⚠️  ${name}: node_modules não encontrado. Execute: npm install`);
    return false;
  }

  console.log(`✅ ${name}: Dependências instaladas`);
  return true;
};

const backendOk = checkPackageJson('backend', 'Backend');
const frontendOk = checkPackageJson('frontend', 'Frontend');

console.log('\n📋 Verificando arquivos de configuração...');

const checkEnvFile = () => {
  const envExample = path.join('backend', '.env.example');
  const env = path.join('backend', '.env');

  if (fs.existsSync(envExample)) {
    console.log('✅ backend/.env.example encontrado');
  }

  if (fs.existsSync(env)) {
    console.log('✅ backend/.env encontrado');
  } else {
    console.warn('⚠️  backend/.env não encontrado. Copie o .env.example e configure.');
  }
};

checkEnvFile();

console.log('\n📋 Verificando estrutura de arquivos...');

const requiredFiles = [
  'backend/src/index.ts',
  'frontend/src/main.tsx',
  'database/schema.sql',
  'README.md',
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ ${file} não encontrado`);
  }
});

console.log('\n✨ Verificação concluída!');

