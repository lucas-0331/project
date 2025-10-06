# Vapor - Backend

Vapor é um projeto backend desenvolvido em **Node.js** com o framework **Express**, que oferece uma API RESTful para um aplicativo de gerenciamento de listas de jogos. O projeto permite que os usuários criem, atualizem, visualizem e excluam listas de jogos, como "Jogos Completados", "Jogos Desejados", "Jogos Platinados", entre outras.

O backend integra-se com as APIs públicas da **Steam** para obter informações detalhadas sobre os jogos, como nome, descrição, preço e detalhes adicionais, permitindo uma experiência personalizada para o usuário.

Este projeto foi desenvolvido como parte da disciplina **Tópicos Especiais II** no curso de **Ciência da Computação**.

---

## Tecnologias Utilizadas

* **Node.js**: Plataforma para execução do código JavaScript no lado do servidor.
* **Express**: Framework web para Node.js, utilizado para construção das APIs.
* **Axios**: Biblioteca para realizar requisições HTTP (usada para consumir a API da Steam).
* **PostgreSQL**: Banco de dados relacional para armazenar as listas de jogos e dados dos usuários.
* **Sequelize**: ORM (Object-Relational Mapping) para PostgreSQL, usado para facilitar a manipulação do banco de dados.
* **dotenv**: Biblioteca para carregar variáveis de ambiente a partir de um arquivo `.env`.

---

## [Modelagem do Banco](https://www.drawdb.app/editor?shareId=2c02833a1771f681013881c8d7be846d)

---

## Funcionalidades

* **CRUD de Listas de Jogos**:

  * Criar, listar, editar e excluir listas de jogos.
  * Tipos de listas: "Jogos Completados", "Jogos Desejados", "Jogos Platinados", etc.

* **Integração com a API da Steam**:

  * Obtém informações detalhadas sobre os jogos utilizando as rotas públicas da API da Steam:

    * `http://api.steampowered.com/ISteamApps/GetAppList/v2/` – Lista todos os jogos disponíveis na Steam.
    * `https://store.steampowered.com/api/appdetails?appids=<APP_ID>` – Obtém informações detalhadas de um jogo específico.

* **Busca por jogos**:

  * Permite que os usuários busquem jogos na Steam para adicionar às suas listas, utilizando o nome do jogo ou ID da Steam.

---

## Endpoints

### 1. **Listas de Jogos**

* **GET** `/api/lists`

  * Retorna todas as listas de jogos do usuário.

* **POST** `/api/lists`

  * Cria uma nova lista de jogos.
  * Corpo da requisição:

    ```json
    {
      "name": "Jogos Completados",
      "description": "Lista de jogos que já terminei"
    }
    ```

* **GET** `/api/lists/:id`

  * Retorna uma lista de jogos específica.

* **PUT** `/api/lists/:id`

  * Atualiza as informações de uma lista de jogos.

* **DELETE** `/api/lists/:id`

  * Exclui uma lista de jogos.

### 2. **Jogos**

* **GET** `/api/games/:gameId`

  * Obtém informações detalhadas de um jogo da Steam com base no ID do jogo.
* **POST** `/api/games/search`

  * Busca jogos na Steam com base em um nome de jogo ou ID.

### 3. **Adicionando Jogos à Lista**

* **POST** `/api/lists/:listId/games`

  * Adiciona um jogo a uma lista específica.
  * Corpo da requisição:

    ```json
    {
      "steamAppId": "570",
      "status": "completado"
    }
    ```

---

## Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
