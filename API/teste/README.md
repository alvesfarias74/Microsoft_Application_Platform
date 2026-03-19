# 🧪 Pasta de Testes - API de CEP

Esta pasta contém todos os testes realizados na API de Consulta de CEP.

## 📁 Arquivos

### 1. `RESULTADOS_TESTES.md`
Documento detalhado com todos os testes realizados, incluindo:
- ✅ Resposta esperada vs. observada
- 📊 Resumo de todos os testes
- 🎯 Status de cada validação

**Como usar:** Abra o arquivo para visualizar o relatório completo dos testes.

---

### 2. `testes.js`
Script automatizado que executa todos os testes na API.

**Como executar:**

```bash
# Certifique-se de estar na pasta API
cd ..

# Execute o servidor (em outro terminal)
node server.js

# Em outro terminal, execute os testes
node teste/testes.js
```

**Recursos do script:**
- 🎨 Output colorido com emojis
- 📊 Resumo percentual dos testes
- ✅ Validação automática de todos os endpoints
- 🔄 Rápido e fácil de executar

---

## 🧪 Testes Inclusos

| # | Teste | Endpoint | Status Esperado |
|---|-------|----------|-----------------|
| 1 | Info da API | `GET /` | 200 |
| 2 | Health Check | `GET /health` | 200 |
| 3 | CEP Válido | `GET /cep/01310100` | 200 |
| 4 | CEP Inválido | `GET /cep/123` | 400 |
| 5 | CEP com Letras | `GET /cep/0131010a` | 400 |
| 6 | CEP com Hífen | `GET /cep/01310-100` | 400 |
| 7 | CEP Inexistente | `GET /cep/00000000` | 404 |
| 8 | Rota Inexistente | `GET /rota-inexistente` | 404 |

---

## 📝 Exemplo de Saída

Quando você executa `node teste/testes.js`, verá algo como:

```
🧪 INICIANDO TESTES DA API DE CEP

Teste 1: Endpoint Raiz
✅ PASSOU - GET / - Info da API
   Status: 200

Teste 2: Health Check
✅ PASSOU - GET /health - Status da API
   Status: 200, Resposta: OK

...

============================================================
📊 RESUMO DOS TESTES
============================================================

8 de 8 testes passaram (100%)

✅ TODOS OS TESTES PASSARAM!
🚀 API está pronta para produção
```

---

## 🚀 Como Reexecutar os Testes

1. Certifique-se de que o servidor está rodando:
   ```bash
   node server.js
   ```

2. Em outro terminal, na pasta `API/teste`, execute:
   ```bash
   node testes.js
   ```

3. Verifique o resultado no console

---

## ✨ Status Atual

- **Total de Testes:** 8
- **Testes Passando:** 8 ✅
- **Taxa de Sucesso:** 100%
- **API Status:** 🟢 Pronta para Produção

---

## 📌 Notas Importantes

- 📍 Os testes assumem que a API está rodando em `localhost:3000`
- ⏱️ Cada teste leva alguns milissegundos para executar
- 🔌 Certifique-se de ter instalado as dependências com `npm install`
- 🌐 A API depende da ViaCEP (API externa)

---

Documento gerado em: 19 de março de 2026
