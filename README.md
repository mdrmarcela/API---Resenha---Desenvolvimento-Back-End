# API de Resenha – Desenvolvimento Back-End

API RESTful desenvolvida em **Node.js + Express** para gerenciar usuários, livros e resenhas. jurídicos.  
A API utiliza **JWT** para autenticação e **bcrypt** para armazenar as senhas de forma segura(hash).  
Na persistência de dados é usado o ORM **Sequelize** com banco de dados **MySQL**.
A validação de dados é feita com Ajv. 

Este projeto faz parte da disciplina de **Desenvolvimento Back-End** e pode ser usado como base para estudo de:
- CRUD com Node.js + Express;
- Autenticação com JWT;
- Modelagem relacional simples (1:N);
- Rotas aninhadas.

---

## Compatibilidade

- Node.js;
- Express;
- MySQL;
- Sequelize;
- bcrypt;
- json web token;
- Ajv;
- Cors;
- Swagger-ui-express.

---

## Modelagem de Dados

O banco de dados MySQL  possui **3 tabelas** principais:

### 1. `usuario`
Armazena quem pode acessar o sistema.

- `id` (INT, PK, AUTO_INCREMENT)  
- `nome` (VARCHAR)  
- `email` (VARCHAR, UNIQUE)  
- `senha` (VARCHAR) – **hash da senha com bcrypt**, nunca texto plano.

### 2. `livro`
Armazena os livros cadastrados.

- `id` (INT, PK, AUTO_INCREMENT)  
- `titulo` (VARCHAR)  
- `autor` (VARCHAR, UNIQUE) 
- `genero` (VARCHAR) – opcional
- `isbn` (VARCHAR, UNIQUE)

### 3. `resenha`
Armazena as resenhas relacionadas aos livros.

- `id` (INT, PK, AUTO_INCREMENT)  
- `titulo` (VARCHAR)
- `conteudo` (TEXT)  
- `nota` (INT) – 1-5 
- `livro_id` (INT, FK → `livro.id`)  
- `usuario_id` (INT, FK → `usuario.id`)  

**Relacionamento:**  
- Um **livro** pode ter **várias resenhas** (1:N);
- Um **usuário** pode ter **várias resenhas** (1:N).

---

## Organização do Projeto

Estrutura principal de pastas/arquivos:

```text
/app
  /commons        # helpers e utilitários
  /controllers    # lógica de cada recurso (Usuario, Livro, Resenha)
  /middlewares    # middlewares, ex.: validação de token JWT
  /models         # models Sequelize e conexão com o banco
  /routes         # definição das rotas da API
/modelagem        # arquivos de modelagem/diagrama do banco 
app.js            # ponto de entrada da aplicação (Express)
config.js         # configurações globais (BD e JWT)
package.json      # metadados e dependências do projeto
```

## Configuração do Banco de Dados

Crie um banco de dados MySQL, por exemplo: resenhas_db
(pode ser pelo phpMyAdmin ou outro cliente).

No XAMPP, inicie o MySQL e o Apache. 

---

## Diagrama do Banco de Dados
![Diagrama do banco](./modelagem/Modelagem.png)

---

## Instalação e Execução

Clonar ou baixar este repositório.

Dentro da pasta do projeto, instalar as dependências:

```text
npm install
```

Certificar-se de que o MySQL está rodando e o banco resenhas_db existe.

Iniciar a aplicação em modo desenvolvimento:

```text
npm run dev
# ou
npx nodemon
```

A API ficará disponível em (por padrão):
http://localhost:3000

---

## Autenticação e Fluxo de Uso

A API utiliza JWT (JSON Web Token) para proteger as rotas.
Fluxo básico:

Cadastro de usuário

Login para obter um token JWT

Uso das rotas protegidas enviando o token no cabeçalho Authorization.

1. Cadastro de Usuário

Endpoint: POST /usuarios
Body (JSON):

{
  "nome": "Marcela",
  "email": "marcela@teste.com",
  "senha": "123456"
}

A senha é automaticamente convertida em hash com bcrypt antes de ser salva.

O email é único.

2. Login
Endpoint: POST /usuarios/login
Body (JSON):

{
  "email": "marcela@teste.com",
  "senha": "123456"
}

---

## Rotas principais

### Usuários
- `POST /usuarios` – cadastro de usuário (público)
- `POST /usuarios/login` – login e geração de JWT (público)
- `GET /usuarios` – lista usuários (rota protegida)

### Livros (Recurso A)
- `GET /livros` – lista todos
- `GET /livros/:id` – busca por id
- `POST /livros` – criar (protegida)
- `PUT /livros/:id` – atualizar (protegida)
- `DELETE /livros/:id` – remover  (protegida)

### Resenhas (Recurso B aninhado)
- `GET /resenha` – lista resenhas do livro
- `GET /resenha/:id` – busca por id
- `POST /resenha` – criar resenhas para livro 
- `PUT /resenha/:id` – atualizar resenha 
- `DELETE /resenha/:id` – remover resenha 

- Nas rotas aninhadas, o livro_id vem pela URL. 

---

### Validação
Os dados de entrada são validados no servidor com Ajv, evitando envio de campos extras e garantindo tipos e obrigatoriedades conforme os schemas definidos. 

---

## Exemplo no Postman:

Aba Authorization

Type: Bearer Token

Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

O middleware em app/middlewares/tokenValido.js é responsável por:

Ler o cabeçalho Authorization;

Verificar se é um Bearer Token;

Validar o JWT usando o segredo configurado em config.js;

Bloquear a requisição caso o token seja inválido ou ausente.

---

## Documentação da API (Swagger)

A documentação interativa da API está disponível em:

- `http://localhost:3000/docs`  