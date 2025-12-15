# Vapor API 🎮

API backend para aplicação mobile de gerenciamento de listas personalizadas de jogos da Steam, desenvolvida como parte da disciplina de **Tópicos Especiais II** do curso **Ciência da Computação**, no **IFSULDEMINAS - Campus Muzambinho**.

![Preview](assets/images/preview.png)

## 📋 Sobre o Projeto

A **Vapor API** é uma API RESTful que serve como backend para uma aplicação mobile estilo Pinterest/MyAnimeList, voltada especificamente para jogos da plataforma Steam. A API permite que usuários criem e gerenciem listas personalizadas de jogos, integrada diretamente com dados oficiais da Steam.

Este projeto faz parte de uma arquitetura maior, onde:
- **Frontend**: [Vapor](https://github.com/augustoglago/vapor) (React Native);
- **Backend**: [Vapor API](https://github.com/lucas-0331/project) (NodeJS).

## 🏗️ Infraestrutura

- **Modelagem do Banco**: [drawDB](https://www.drawdb.app/)
  - [https://www.drawdb.app/editor?shareId=2c02833a1771f681013881c8d7be846d](https://www.drawdb.app/editor?shareId=2c02833a1771f681013881c8d7be846d)
- **Hospedagem da API**: [Render](https://render.com/)
  - [https://vapor-73xs.onrender.com/](https://vapor-73xs.onrender.com/)
- **Banco de Dados**: [Aiven](https://aiven.io/) (PostgreSQL)

## 🚀 Tecnologias Utilizadas

### Core
- **Node.js** - Ambiente de execução JavaScript;
- **Express** - Framework web;
- **Prisma ORM** - ORM para gerenciamento do banco de dados;
- **PostgreSQL** - Banco de dados relacional.

### Autenticação e Segurança
- **JWT** - Autenticação via tokens;
- **bcrypt** - Criptografia de senhas.

### Integrações
- **Axios** - Cliente HTTP para consumir APIs externas;
- **Steam API** - Integração com APIs oficiais da Steam;
- **Cheerio** - Biblioteca para realizar parsing e extração de dados a partir do HTML das páginas de conquistas da Steam.

### Documentação
- **Swagger** - Documentação interativa da API.

### Outras Dependências
- **CORS** - Controle de acesso cross-origin;
- **dotenv** - Gerenciamento de variáveis de ambiente;
- **pg** - Driver PostgreSQL.

## 🔗 Integração com Steam API

A aplicação consome duas rotas públicas da Steam API:

1. **Lista de Aplicativos**
   ```
   GET https://api.steampowered.com/ISteamApps/GetAppList/v2/
   ```
   Retorna lista completa de aplicativos disponíveis na Steam.

2. **Detalhes do Aplicativo**
   ```
   GET https://store.steampowered.com/api/appdetails?appids={appId}
   ```
   Retorna informações detalhadas de um jogo específico.

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI.

Após iniciar o servidor, acesse:
```
http://localhost:3000/api-docs
```

Ou acesse a versão em produção:
```
https://vapor-73xs.onrender.com/api-docs/
```

## ✨ Funcionalidades

- **Autenticação**: login via `/auth/login` com emissão de token JWT (Bearer);
- **Gerenciamento de usuários**: registro (`/users/register`), leitura (`/users`, `/users/me`), atualização parcial (`/users/{id}`) e permissões administrativas;
- **Avatares**: listagem de avatares disponíveis (`/avatars`);
- **Listas pessoais**: criação, leitura, atualização e exclusão de listas do usuário (`/lists`, `/lists/{id}`) com ícone e cor;
- **Associação de jogos a listas**: adicionar/remover múltiplos jogos e listar jogos de uma lista específica com paginação, busca e ordenação (`/games-lists/{id}`);
- **Jogos**: listagem paginada de jogos com cursor, ordenação e busca por nome (`/games`);
- **Detalhes de jogo**: obtenção de detalhes completos via Steam API (`/games/{appId}/details`), incluindo imagens, screenshots, descrição e requisitos;
- **Conquistas**: listar conquistas de um jogo e gerenciar conquistas concluídas do usuário (`/achievements/{id}`);
- **Paginação e filtros**: suporte a `cursor`, `search`, `sortBy` e `setOrder` em endpoints relevantes;
- **Segurança e erros**: rotas protegidas com `BearerAuth` e respostas de erro padronizadas (401/403/404/500).

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas:

1. Faça login através da rota de autenticação;
2. Inclua o token recebido no header das requisições:
```
Authorization: Bearer {seu-token-aqui}
```

## 📦 Instalação e Configuração

### Pré-requisitos
- PostgreSQL;
- Node.js (versão 18 ou superior recomendada);
- Conta no Aiven (para banco de dados);
- Conta no Render (para deploy).

### Instalação Local

1. Clone o repositório
```bash
git clone https://github.com/lucas-0331/project.git
cd project
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database"
JWT_SECRET="seu-secret-jwt-aqui"
JWT_EXPIRES_IN=24h
```

4. Execute as migrations do Prisma
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 👥 Equipe de Desenvolvimento

**Integrantes:**
- [Augusto Lago](https://github.com/augustoglago);
- [Erik Abdala](https://github.com/ErikAbdala);
- [Lucas Costa](https://github.com/lucas-0331);
- [Pedro Elias](https://github.com/pedrelias).

**IFSULDEMINAS - Campus Muzambinho**  
**Docente:** Hudson de Jesus Ferreira Júnior  
**Disciplina:** Tópicos Especiais II  
**Curso:** Ciência da Computação  
**Turma:** COMP8 (Noturno)

## 📝 Licença

Este projeto é licenciado sob a Licença GNU GPLv3 - veja o arquivo LICENSE para mais detalhes.