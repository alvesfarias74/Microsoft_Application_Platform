# Microsoft Application Platform

## 📝 Introdução

Este documento descreve, de forma estruturada e com rigor técnico, os conceitos, decisões de arquitetura e o racional de implementação associados ao desafio **Microsoft Application Platform**.

> **Nota sobre execução prática**  
> Os procedimentos práticos previstos no desafio **não foram executados** em ambiente de nuvem, pois a conta do **Microsoft Azure** não possuía crédito disponível. Em razão disso, as etapas de provisionamento, deploy e monitoramento foram **planejadas e documentadas conceitualmente**, com roteiros e comandos reprodutíveis, mas **sem validação em execução real**.

***

## 🎯 Objetivos de Aprendizagem

1.  Compreender e articular os **fundamentos da plataforma Azure** aplicados a aplicações modernas (PaaS e CaaS).
2.  Projetar um fluxo de **deploy** para aplicações web/API usando **Azure App Service** e/ou **Azure Container Apps**.
3.  Descrever a **observabilidade** com **Application Insights** e **Log Analytics**, incluindo métricas, logs e traços.
4.  Planejar uma solução **end-to-end** com backend conteinerizado, armazenamento em nuvem e práticas mínimas de **DevOps**.

***

## 📚 Pré-requisitos (Conhecimentos Esperados)

*   **Azure**: básico (conceitos de recursos, grupos de recursos, regiões, modelo de cobrança).
*   **Git e GitHub**: básico (branching, pull requests, versionamento).
*   **Lógica de Programação**: intermediário.
*   **Desenvolvimento Web**: intermediário (API REST, HTTP, JSON).
*   **Terminal/CLI**: básico (execução de comandos, variáveis de ambiente).
*   **Desejável**: experiência em **C#**, **JavaScript** ou **Python**.

***

## 🛠️ Escopo de Conteúdo e Competências Desenvolvidas

### 1) Fundamentos da Plataforma Azure

*   **Serviços PaaS**: **Azure App Service** para hospedagem gerenciada de Web Apps/APIs.
*   **Ferramentas de Gestão**: **Azure Portal**, **Azure CLI** (az) para automação e reprodutibilidade.
*   **Armazenamento de Dados**: visão geral de opções (ex.: **Azure Storage**, **Azure SQL**, **Cosmos DB**) e critérios de escolha (latência, custo, consistência, opex/capex).

### 2) Contêineres e Orquestração

*   **Azure Container Apps (ACA)**: execução de contêineres sem gestão direta de nós, com escalonamento baseado em eventos.
*   **Azure Kubernetes Service (AKS)**: orquestração para cenários com requisitos de controle fino, multi-serviço e alto volume.
*   **Empacotamento & Deploy**: build de imagem, push para **Azure Container Registry (ACR)** e publicação em ACA/App Service (Containers).

### 3) Monitoramento e Performance (Observabilidade)

*   **Application Insights**: telemetria de aplicação (requisições, dependências, traces, exceptions).
*   **Log Analytics**: centralização e consulta (KQL) de dados de logs e métricas.
*   **Boas Práticas**: correlação de transações, alertas, painéis e SLOs iniciais.

### 4) Projeto Integrado (Conceitual)

*   **Arquitetura alvo**: API em contêiner + armazenamento gerenciado + camada de observabilidade.
*   **Pipeline**: passos de CI/CD descritos de forma reprodutível (sem execução por indisponibilidade de crédito).
*   **Deploy**: estratégia canário/blue-green (conceitual), rollback por imagem anterior.

***

## 🧭 Arquitetura Proposta (Visão Conceitual)

**Componentes principais:**

*   **Cliente** (navegador/consumidor de API).
*   **Azure Container Registry (ACR)** para armazenamento das imagens.
*   **Azure Container Apps (ACA)** *ou* **Azure App Service (Containers)** para execução da API.
*   **Armazenamento**:
    *   **Azure SQL** quando o modelo relacional e transações ACID forem essenciais, **ou**
    *   **Cosmos DB** quando baixa latência global e flexibilidade de schema forem prioritárias, **ou**
    *   **Azure Storage (Tables/Blobs)** para cenários de dados simples e custo otimizado.
*   **Observabilidade**: **Application Insights** + **Log Analytics**.

**Racional de decisão (ACA vs. App Service vs. AKS):**

*   **App Service (Containers)**: menor complexidade operacional; adequado para APIs e web apps tradicionais com um ou poucos contêineres.
*   **Azure Container Apps**: escalonamento por eventos, revisões e tráfego fracionado; útil para microsserviços leves sem gerenciar cluster.
*   **AKS**: indicado quando há necessidade de controle granular, rede avançada, sidecars complexos ou alto volume multi-serviço.

***

## 🔧 Fluxo de Trabalho Proposto (Reprodutível)

> *Observação*: comandos abaixo são **roteiro conceitual** (não executados por falta de crédito). Eles visam demonstrar domínio do processo e podem ser reproduzidos quando houver ambiente disponível.

### 1) Provisionamento (Azure CLI)

```bash
# Variáveis de exemplo
RG="rg-app-platform"
LOC="brazilsouth"
ACR="acrappplatform$RANDOM"

# Grupo de recursos
az group create -n $RG -l $LOC

# Container Registry
az acr create -n $ACR -g $RG --sku Basic

# (Opcional) App Service Plan + Web App para contêiner
PLAN="asp-app-platform"
WEB="webapi-app-platform"
az appservice plan create -n $PLAN -g $RG --is-linux --sku B1
az webapp create -n $WEB -g $RG -p $PLAN -i "$ACR.azurecr.io/minhaapi:1.0"

# (Alternativo) Azure Container Apps (ambiente + app)
ENV="aca-env-app-platform"
APP="api-aca-app-platform"
az extension add --name containerapp
az containerapp env create -n $ENV -g $RG -l $LOC
az containerapp create -n $APP -g $RG --environment $ENV \
  --image "$ACR.azurecr.io/minhaapi:1.0" --target-port 8080 --ingress external
```

### 2) Build & Push da Imagem

```bash
# Login no ACR
az acr login -n $ACR

# Build de imagem no ACR (ACR Tasks) ou local (docker build) e push
az acr build -r $ACR -t minhaapi:1.0 .
# ou, localmente:
# docker build -t $ACR.azurecr.io/minhaapi:1.0 .
# docker push $ACR.azurecr.io/minhaapi:1.0
```

### 3) Configurações de Aplicação / Segredos

```bash
# App Settings (ex.: string de conexão, chaves)
az webapp config appsettings set -g $RG -n $WEB --settings \
  ASPNETCORE_ENVIRONMENT=Production \
  ConnectionStrings__Default="<<<string-de-conexao>>>"

# Para ACA: adicionar secretos e env vars
az containerapp secret set -n $APP -g $RG --secrets \
  db-conn="<<<string-de-conexao>>>"

az containerapp update -n $APP -g $RG \
  --set-env-vars "ConnectionStrings__Default=secretref:db-conn"
```

### 4) Observabilidade

```bash
# Habilitar Application Insights e vincular ao app
INSIGHTS="appi-app-platform"
az monitor app-insights component create -g $RG -l $LOC -a $INSIGHTS

# App Service: apontar para o AI
az webapp config appsettings set -g $RG -n $WEB --settings \
  APPLICATIONINSIGHTS_CONNECTION_STRING="<<<connection-string>>>"

# ACA: habilitar logging/telemetria via env/configuração no código e side settings
```

### 5) Estratégia de Deploy e Rollback

*   **Versionamento por tag** (`minhaapi:1.0`, `1.1`, `1.2`).
*   **Tráfego progressivo** (ACA revisões) ou **slot de staging** (App Service) para testes sem downtime.
*   **Rollback**: reverter tag/slot ou ativar revisão anterior com tráfego 100%.

***

## ✅ Critérios de Aceite (Propostos)

1.  **Documentação técnica** clara, com propósito, arquitetura e passos reprodutíveis.
2.  **Padronização de configurações** (variáveis, nomes de recursos e regiões).
3.  **Roteiro de deploy** com comandos CLI e/ou pipelines.
4.  **Plano de observabilidade** (métricas, logs, alertas mínimos).
5.  **Plano de rollback** e versionamento de imagens/artefatos.

***

## 🔍 Evidências de Aprendizado (mesmo sem execução real)

*   Elaboração de **pipeline conceitual** com separação de fases (build, test, package, release).
*   Definição de **nomenclatura de recursos** e variáveis de ambiente seguras.
*   Seleção justificada entre **App Service**, **ACA** e **AKS**.
*   Planejamento de **telemetria** com **Application Insights** (requisições, dependências, exceptions, custom events).
*   Demonstração de domínio dos principais **comandos Azure CLI** envolvidos.

***

## 🧪 Próximos Passos (para execução quando houver crédito)

1.  Provisionar ambiente real (crédito ativo) e validar o roteiro CLI end-to-end.
2.  Adicionar **CI/CD** com GitHub Actions (build de imagem, push no ACR, deploy).
3.  Instrumentar código com SDK do **Application Insights** para **tracing distribuído**.
4.  Criar **painéis e alertas** no Azure Monitor; definir **SLOs** mínimos (p. ex., latência p95, taxa de erro).
5.  Executar **teste de carga** leve para validar escalabilidade/limites e custos.

***

## 📖 Referências Essenciais

*   Documentação Microsoft Azure — **App Service**: <https://learn.microsoft.com/azure/app-service/>
*   Documentação Microsoft Azure — **Container Apps**: <https://learn.microsoft.com/azure/container-apps/>
*   Documentação Microsoft Azure — **Container Registry**: <https://learn.microsoft.com/azure/container-registry/>
*   Documentação Microsoft Azure — **Application Insights**: <https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview>
*   Documentação Microsoft Azure — **Log Analytics / Azure Monitor**: <https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview>
*   **Azure CLI** (Referência de comandos): <https://learn.microsoft.com/cli/azure/>
