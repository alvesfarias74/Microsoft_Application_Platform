const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

/**
 * Rota para buscar endereço por CEP
 * GET /cep/:cep
 * 
 * Exemplo: http://localhost:3000/cep/01310100
 */
app.get('/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;

    // Validação básica do CEP
    if (!cep || cep.length !== 8 || isNaN(cep)) {
      return res.status(400).json({
        erro: true,
        mensagem: 'CEP inválido. Use 8 dígitos numéricos (ex: 01310100)'
      });
    }

    // Buscar no ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    // Verificar se o CEP foi encontrado
    if (response.data.erro) {
      return res.status(404).json({
        erro: true,
        mensagem: 'CEP não encontrado',
        cep: cep
      });
    }

    // Retornar o endereço formatado
    return res.status(200).json({
      erro: false,
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf,
      complemento: response.data.complemento || ''
    });

  } catch (error) {
    console.error('Erro ao buscar CEP:', error.message);
    return res.status(500).json({
      erro: true,
      mensagem: 'Erro ao processar a requisição',
      detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Rota de health check
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

/**
 * Rota raiz com instruções
 */
app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'Bem-vindo à API de CEP',
    versao: '1.0.0',
    endpoints: {
      cep: {
        metodo: 'GET',
        rota: '/cep/:cep',
        exemplo: 'GET /cep/01310100',
        descricao: 'Busca endereço pelo CEP (8 dígitos)'
      },
      health: {
        metodo: 'GET',
        rota: '/health',
        descricao: 'Verifica o status da API'
      }
    }
  });
});

// Middleware para rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    erro: true,
    mensagem: 'Rota não encontrada',
    dica: 'Visite GET / para ver os endpoints disponíveis'
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 API de CEP rodando em http://localhost:${PORT}`);
  console.log(`📝 Acesse http://localhost:${PORT} para instruções`);
});
