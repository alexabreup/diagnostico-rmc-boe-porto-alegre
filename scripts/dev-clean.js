#!/usr/bin/env node

/**
 * Script para iniciar o ambiente de desenvolvimento sem warnings desnecessários
 * Author: Alexandre de Abreu Pereira - Eletromidia Hardware Department
 */

const { spawn } = require('child_process');
const path = require('path');

// Configurar variáveis de ambiente para suprimir warnings
process.env.NODE_ENV = 'development';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.POSTCSS_SUPPRESS_WARNINGS = 'true';
process.env.SUPPRESS_WARNINGS = 'true';

// Configurações do webpack dev server
process.env.WDS_SOCKET_HOST = 'localhost';
process.env.WDS_SOCKET_PORT = '3013';

console.log('🚀 Iniciando servidor de desenvolvimento sem warnings...');
console.log('📍 Servidor disponível em: http://localhost:3013/?suppress-warnings=true');
console.log('⚙️  Warnings de validação suprimidos para melhor experiência de desenvolvimento');
console.log('💡 Para ver warnings completos, use: npm start');

// Iniciar o servidor Docusaurus com configurações customizadas
const docusaurus = spawn('npx', ['docusaurus', 'start', '--port', '3013', '--host', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
  env: {
    ...process.env,
    SUPPRESS_WARNINGS: 'true'
  }
});

docusaurus.on('error', (error) => {
  console.error('❌ Erro ao iniciar o servidor:', error);
  process.exit(1);
});

docusaurus.on('close', (code) => {
  console.log(`\n🛑 Servidor encerrado com código: ${code}`);
  process.exit(code);
});

// Capturar sinais de interrupção
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  docusaurus.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando servidor...');
  docusaurus.kill('SIGTERM');
});