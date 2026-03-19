/**
 * 🧪 Script de Testes Automatizados - API de CEP
 * 
 * Este script realiza testes automatizados em todos os endpoints da API
 * Uso: node testes.js
 */

const http = require('http');

// Cores para output no console
const cores = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  vermelho: '\x1b[31m',
  amarelo: '\x1b[33m',
  azul: '\x1b[36m',
  bold: '\x1b[1m'
};

// Função para fazer requisições HTTP
function fazerRequisicao(host, port, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Função para exibir resultado do teste
function exibirResultado(nome, passou, detalhes = '') {
  const status = passou 
    ? `${cores.verde}✅ PASSOU${cores.reset}` 
    : `${cores.vermelho}❌ FALHOU${cores.reset}`;
  
  console.log(`\n${cores.bold}${status}${cores.reset} - ${nome}`);
  if (detalhes) {
    console.log(`   ${detalhes}`);
  }
}

// Suite de testes
async function executarTestes() {
  console.log(`\n${cores.azul}${cores.bold}🧪 INICIANDO TESTES DA API DE CEP${cores.reset}\n`);
  
  const host = 'localhost';
  const port = 3000;
  let totalTestes = 0;
  let testesPassed = 0;

  try {
    // Teste 1: Endpoint Raiz
    console.log(`${cores.amarelo}Teste 1: Endpoint Raiz${cores.reset}`);
    totalTestes++;
    try {
      const res1 = await fazerRequisicao(host, port, '/');
      const passou1 = res1.statusCode === 200 && res1.data.mensagem;
      exibirResultado('GET / - Info da API', passou1, `Status: ${res1.statusCode}`);
      if (passou1) testesPassed++;
    } catch (err) {
      exibirResultado('GET / - Info da API', false, err.message);
    }

    // Teste 2: Health Check
    console.log(`\n${cores.amarelo}Teste 2: Health Check${cores.reset}`);
    totalTestes++;
    try {
      const res2 = await fazerRequisicao(host, port, '/health');
      const passou2 = res2.statusCode === 200 && res2.data.status === 'OK';
      exibirResultado('GET /health - Status da API', passou2, `Status: ${res2.statusCode}, Resposta: ${res2.data.status}`);
      if (passou2) testesPassed++;
    } catch (err) {
      exibirResultado('GET /health - Status da API', false, err.message);
    }

    // Teste 3: CEP Válido
    console.log(`\n${cores.amarelo}Teste 3: CEP Válido${cores.reset}`);
    totalTestes++;
    try {
      const res3 = await fazerRequisicao(host, port, '/cep/01310100');
      const passou3 = res3.statusCode === 200 && res3.data.erro === false && res3.data.logradouro;
      exibirResultado('GET /cep/01310100 - Buscar CEP Válido', passou3, 
        `Status: ${res3.statusCode}, Endereço: ${res3.data.logradouro || 'N/A'}`);
      if (passou3) testesPassed++;
    } catch (err) {
      exibirResultado('GET /cep/01310100 - Buscar CEP Válido', false, err.message);
    }

    // Teste 4: CEP Inválido (Poucos dígitos)
    console.log(`\n${cores.amarelo}Teste 4: CEP Inválido (Poucos dígitos)${cores.reset}`);
    totalTestes++;
    try {
      const res4 = await fazerRequisicao(host, port, '/cep/123');
      const passou4 = res4.statusCode === 400 && res4.data.erro === true;
      exibirResultado('GET /cep/123 - Rejeitar CEP Inválido', passou4, `Status: ${res4.statusCode}`);
      if (passou4) testesPassed++;
    } catch (err) {
      exibirResultado('GET /cep/123 - Rejeitar CEP Inválido', false, err.message);
    }

    // Teste 5: CEP com Letras
    console.log(`\n${cores.amarelo}Teste 5: CEP com Letras${cores.reset}`);
    totalTestes++;
    try {
      const res5 = await fazerRequisicao(host, port, '/cep/0131010a');
      const passou5 = res5.statusCode === 400 && res5.data.erro === true;
      exibirResultado('GET /cep/0131010a - Rejeitar CEP com Letras', passou5, `Status: ${res5.statusCode}`);
      if (passou5) testesPassed++;
    } catch (err) {
      exibirResultado('GET /cep/0131010a - Rejeitar CEP com Letras', false, err.message);
    }

    // Teste 6: CEP com Hífen
    console.log(`\n${cores.amarelo}Teste 6: CEP com Hífen${cores.reset}`);
    totalTestes++;
    try {
      const res6 = await fazerRequisicao(host, port, '/cep/01310-100');
      const passou6 = res6.statusCode === 400 && res6.data.erro === true;
      exibirResultado('GET /cep/01310-100 - Rejeitar CEP com Hífen', passou6, `Status: ${res6.statusCode}`);
      if (passou6) testesPassed++;
    } catch (err) {
      exibirResultado('GET /cep/01310-100 - Rejeitar CEP com Hífen', false, err.message);
    }

    // Teste 7: CEP Inexistente
    console.log(`\n${cores.amarelo}Teste 7: CEP Inexistente${cores.reset}`);
    totalTestes++;
    try {
      const res7 = await fazerRequisicao(host, port, '/cep/00000000');
      const passou7 = res7.statusCode === 404 && res7.data.erro === true;
      exibirResultado('GET /cep/00000000 - CEP Não Encontrado', passou7, `Status: ${res7.statusCode}`);
      if (passou7) testesPassed++;
    } catch (err) {
      exibirResultado('GET /cep/00000000 - CEP Não Encontrado', false, err.message);
    }

    // Teste 8: Rota Inexistente
    console.log(`\n${cores.amarelo}Teste 8: Rota Inexistente${cores.reset}`);
    totalTestes++;
    try {
      const res8 = await fazerRequisicao(host, port, '/rota-inexistente');
      const passou8 = res8.statusCode === 404 && res8.data.erro === true;
      exibirResultado('GET /rota-inexistente - Rota Não Encontrada', passou8, `Status: ${res8.statusCode}`);
      if (passou8) testesPassed++;
    } catch (err) {
      exibirResultado('GET /rota-inexistente - Rota Não Encontrada', false, err.message);
    }

    // Resumo Final
    console.log(`\n${cores.bold}${'='.repeat(60)}${cores.reset}`);
    console.log(`${cores.bold}📊 RESUMO DOS TESTES${cores.reset}`);
    console.log(`${cores.bold}${'='.repeat(60)}${cores.reset}`);
    
    const percentual = Math.round((testesPassed / totalTestes) * 100);
    const cor = percentual === 100 ? cores.verde : cores.vermelho;
    
    console.log(`\n${cor}${testesPassed} de ${totalTestes} testes passaram (${percentual}%)${cores.reset}\n`);

    if (testesPassed === totalTestes) {
      console.log(`${cores.verde}${cores.bold}✅ TODOS OS TESTES PASSARAM!${cores.reset}`);
      console.log(`${cores.verde}🚀 API está pronta para produção${cores.reset}\n`);
    } else {
      console.log(`${cores.vermelho}${cores.bold}❌ ALGUNS TESTES FALHARAM${cores.reset}`);
      console.log(`${cores.vermelho}⚠️  Verifique os erros acima${cores.reset}\n`);
    }

  } catch (erro) {
    console.error(`\n${cores.vermelho}${cores.bold}❌ Erro ao conectar à API${cores.reset}`);
    console.error(`${cores.vermelho}Verifique se o servidor está rodando em http://localhost:3000${cores.reset}`);
    console.error(`Erro: ${erro.message}\n`);
  }
}

// Executar testes
executarTestes();
