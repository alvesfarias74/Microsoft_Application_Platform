# 📍 API de CEP

Uma API simples e rápida para buscar endereços pelo CEP usando a [ViaCEP](https://viacep.com.br/).

## 🚀 Instalação

```bash
npm install
```

## 🏃 Executar

**Modo produção:**
```bash
npm start
```

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 📚 Endpoints

### 1️⃣ Buscar Endereço por CEP

**Requisição:**
```http
GET /cep/:cep
```

**Parâmetros:**
- `cep` (string): CEP com 8 dígitos numéricos

**Exemplos:**

```bash
# Av. Paulista, São Paulo
curl http://localhost:3000/cep/01310100

# Com formatação
curl http://localhost:3000/cep/20040020
```

**Resposta (Sucesso - 200):**
```json
{
  "erro": false,
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "complemento": ""
}
```

**Resposta (CEP Inválido - 400):**
```json
{
  "erro": true,
  "mensagem": "CEP inválido. Use 8 dígitos numéricos (ex: 01310100)"
}
```

**Resposta (CEP Não Encontrado - 404):**
```json
{
  "erro": true,
  "mensagem": "CEP não encontrado",
  "cep": "12345678"
}
```

### 2️⃣ Health Check

**Requisição:**
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK"
}
```

### 3️⃣ Root (Instruções)

**Requisição:**
```http
GET /
```

**Resposta:**
```json
{
  "mensagem": "Bem-vindo à API de CEP",
  "versao": "1.0.0",
  "endpoints": {...}
}
```

## 💡 Exemplos de Uso

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function buscarEndereco(cep) {
  try {
    const response = await axios.get(`http://localhost:3000/cep/${cep}`);
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data);
  }
}

buscarEndereco('01310100');
```

### JavaScript/Fetch (Browser)

```javascript
fetch('http://localhost:3000/cep/01310100')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### cURL

```bash
curl -X GET http://localhost:3000/cep/01310100
```

### Python

```python
import requests

response = requests.get('http://localhost:3000/cep/01310100')
print(response.json())
```

## 📋 Estrutura

```
API/
├── server.js          # Aplicação principal
├── package.json       # Dependências
└── README.md          # Este arquivo
```

## ⚙️ Dependências

- **Express**: Framework web minimalista
- **Axios**: Cliente HTTP para requisições

## 🔒 Variáveis de Ambiente

- `PORT`: Porta para rodar a API (padrão: 3000)
- `NODE_ENV`: Ambiente (development/production)

## 📝 Considerações

- A API valida se o CEP possui exatamente 8 dígitos
- O CEP é consultar diretamente na ViaCEP (sem cache)
- Erros de conexão retornam status 500
- Endpoints inexistentes retornam status 404

## 🤝 Contribuindo

Essa é uma API simples para aprendizado. Sinta-se livre para melhorar!

## 📄 Licença

ISC
