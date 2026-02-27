# API Irriga

API REST desenvolvida em Node.js com Express para controle de usuários, pivôs de irrigação e registros de irrigação.

Projeto criado como parte de um desafio técnico.

---

## Tecnologias utilizadas

- Node.js
- Express
- bcryptjs
- jsonwebtoken (JWT)
- uuid
- dotenv
- Docker
- Docker Compose

---

## Estrutura de pastas

```
src/
  app.js
  server.js
  controllers/
  routes/
  middlewares/
  data/
Dockerfile
docker-compose.yml
```

---

# Rodando com Docker (Recomendado)

Certifique-se de ter o Docker instalado na sua máquina.

Na raiz do projeto, execute:

```bash
docker compose up --build
```

A API ficará disponível em:

```
http://localhost:3001
```

Para parar a aplicação:

```bash
docker compose down
```

---

# Rodando sem Docker (modo local)

Caso queira rodar sem Docker:

## Instalação

```bash
npm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3001
JWT_SECRET=53cdfa6fa0d6e9f7124d65f843279e7ea87a61fbd052dfe4b84a73603d1a04cb440ab1b3bc295fa13947a2294d53b77418509f9872027abecb88ef6508aa83bc

```

## Executar

Modo desenvolvimento:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

A API ficará disponível em:

```
http://localhost:3001
```

---

# Testando no Postman


### Registrar usuário

- Método: **POST**
- URL: `http://localhost:3001/auth/register`
- Body → raw → JSON:

```json
{
  "username": "Arthur Zanon",
  "password": "1234"
}
```

---

### Login

- Método: **POST**
- URL: `http://localhost:3001/auth/login`
- Body → raw → JSON:

```json
{
  "username": "Arthur Zanon",
  "password": "1234"
}
```

A resposta retornará um token JWT.

---

## Pivôs (rotas protegidas)

Todas as rotas abaixo exigem token JWT no header do Postman:

Key:
```
Authorization
```

Value:
```
Bearer SEU_TOKEN_AQUI
```

---

### Criar pivô

- Método: **POST**
- URL: `http://localhost:3001/pivots`
- Body → raw → JSON:

```json
{
  "description": "Pivo Central Fazenda A",
  "flowRate": 150.5,
  "minApplicationDepth": 5.0
}
```

---

### Listar pivôs

- Método: **GET**
- URL: `http://localhost:3001/pivots`

---

### Buscar pivô por ID

- Método: **GET**
- URL: `http://localhost:3001/pivots/ID_DO_PIVO`



### Atualizar pivô

- Método: **PUT**
- URL: `http://localhost:3001/pivots/ID_DO_PIVO`
- Body → raw → JSON:

```json
{
  "description": "Pivot Atualizado",
  "flowRate": 30,
  "minApplicationDepth": 12
}
```

---

### Deletar pivô

- Método: **DELETE**
- URL: `http://localhost:3001/pivots/ID_DO_PIVO`

---

## Irrigações (rotas protegidas)

Todas as rotas abaixo exigem token JWT no header do Postman:

Key:
```
Authorization
```

Value:
```
Bearer SEU_TOKEN_AQUI
```



### Criar irrigação

- Método: **POST**
- URL: `http://localhost:3001/irrigations`
- Body → raw → JSON:

```json
{
  "pivotId": "ID_DO_PIVO",
  "applicationAmount": 20.0,
  "irrigationDate": "2025-07-01T10:00:00Z"
}
```

---

### Listar irrigações

- Método: **GET**
- URL: `http://localhost:3001/irrigations`

---

### Buscar irrigação por ID

- Método: **GET**
- URL: `http://localhost:3001/irrigations/ID_DA_IRRIGACAO`

---


### Atualizar irrigação

- Método: **PUT**
- URL: `http://localhost:3001/irrigations/ID_DA_IRRIGACAO`
- Body → raw → JSON:

```json
{
  "pivotId": "ID_DO_PIVO",
  "applicationAmount": 25.0,
  "irrigationDate": "2025-07-02T10:00:00Z"
}
```

---

### Deletar irrigação

- Método: **DELETE**
- URL: `http://localhost:3001/irrigations/ID_DA_IRRIGACAO`

---

# Regras implementadas

- Senha armazenada com hash usando bcryptjs.
- Login retorna JWT com validade de 1 hora.
- Todas as rotas protegidas exigem token válido.
- Usuário só pode acessar seus próprios pivôs e irrigações.
- Ao criar irrigação, é validado se o pivô pertence ao usuário autenticado.
- Persistência em memória (os dados são perdidos ao reiniciar o servidor).

---
