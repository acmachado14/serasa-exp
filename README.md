# Serasa Exp - API de Gestão de Propriedades Rurais

## 📋 Sobre o Projeto

O Serasa Exp é uma API desenvolvida em NestJS para gerenciamento de propriedades rurais, produtores e safras. O projeto implementa funcionalidades de criptografia para dados sensíveis e utiliza boas práticas de desenvolvimento.

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) - Framework Node.js para construção de aplicações escaláveis
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Prisma](https://www.prisma.io/) - ORM moderno para Node.js
- [Jest](https://jestjs.io/) - Framework de testes
- [Docker](https://www.docker.com/) - Containerização
- [Swagger](https://swagger.io/) - Documentação da API
- [Prometheus](https://prometheus.io/) - Monitoramento e coleta de métricas
- [Grafana](https://grafana.com/) - Visualização e análise de métricas

## 🛠️ Pré-requisitos

- Docker e Docker Compose
- PostgreSQL (se não estiver usando Docker)
- NodeJS (se não estiver usando Docker)

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
docker compose up serasa-app
```

## 🧪 Testes

### Testes Unitários
Para executar os testes dentro do container:

```bash
npm run test
```

### Testes com Cobertura

```bash
npm run test:cov
```

### Testes End-to-End

```bash
npm run test:e2e
```

## 📚 Documentação da API

A documentação da API está disponível através do Swagger UI quando o servidor estiver em execução:

```
http://localhost:3000/api
```

## 🏗️ Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── producer/       # Módulo de produtores
├── property/       # Módulo de propriedades
├── harvest/        # Módulo de safras
├── prisma/         # Configuração do Prisma
├── metrics/        # Módulo de métricas e monitoramento
└── utils/          # Utilitários e serviços compartilhados
```

## 🔒 Segurança

- Implementação de criptografia para dados sensíveis (CPF/CNPJ)
- Autenticação via JWT
- Validação de dados com class-validator
- Proteção contra ataques de força bruta com @nestjs/throttler

## 📊 Métricas e Monitoramento

O projeto inclui integração com Prometheus para coleta de métricas:

- Métricas de requisições HTTP
- Métricas de tempo de resposta
- Métricas de erros

## 🌐 Deploy e Infraestrutura

### Cloud Provider

- Google Cloud Platform (GCP)
- VM dedicada para execução da aplicação

### URLs de Produção

- API: [https://api.serasa.gelin.fun](https://api.serasa.gelin.fun)
- Grafana: [https://grafana.serasa.gelin.fun](https://grafana.serasa.gelin.fun)
  - Login: admin
  - Senha: puRbew-qyftur-0vadri

### Processo de Deploy

O deploy é automatizado e possui as seguintes características:

- Zero downtime durante atualizações
- Validação automática através de testes
- Pipeline de CI/CD integrado

### Monitoramento em Produção

- Dashboard em tempo real disponível no Grafana
- Alertas configurados para métricas críticas
- Logs centralizados e indexados

## 📝 Licença

Este projeto está sob a licença UNLICENSED.
