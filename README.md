<h1 align="center"><strong>API VUTTR</strong></h1>

## 💬 Sobre

A aplicação foi desenvolvida para gestão de livros e usuários de uma biblioteca. 

*Desafio proposta pela South System.

## 📋 Tecnologias Utilizadas

- **NodeJS**
- **Express**
- **Jest**
- **Yarn**
- **MongoDB**
- **Heroku**

## 🖥 Instalação

1. Clonar o projeto
2. Criar os arquivos .env e .env.test configurando as variáveis de ambiente contidas no arquivo .env.example. ``` PORT ``` define em qual porta irá rodar a aplicação, ``` DATABASE_STRING_CONNECTION ``` define os dados de configuração do banco de dados no mongoDB e ``` AUTH_SECRET ``` define a chave secreta para autenticação jwt.
3. Instalar as dependências do projeto através de ``` yarn ```
4. Para rodar o servidor basta executar ``` yarn dev ```
  
## 🛤 Rotas da Aplicação

### Autenticação

- **` POST /auth `**: Rota para autenticação de um usuário. O corpo da requisição deve conter o e-mail e senha. Usuário padrão para autenticação:

```json
{
	"email": "auth@test.com.br",
	"password": "1234"
}
```

A partir disso, deverá ser enviado em todas requisições da aplicação o header ``` Authorization ``` com o valor ``` Bearer  {token} ``` onde *{token}* deverá ser substituido pelo valor retornado na rota de autenticação.

### Livros

- **` POST /books `**: Rota para cadastrar um novo livro. O corpo da requisição deve conter os dados do livro tais como: título, ISBN, categoria e ano. Após o cadastro, será retornado os dados do livro com o identificador gerado automaticamente.

- **` GET /books `**: Rota para listar todas os livros cadastrados. É possível paginar essa listagem através dos parâmetros ``` page ``` e ``` limit ```. Exemplo de paginação: ``` /books?page=2&limit=10 ```

- **` GET /books/:id `**: Rota para buscar um livro específico. O parâmetro ``` id ``` é o identificador do livro retornado ao cadastrar ou listar o(s) livro(s). 

- **` PUT /books/:id `**: Rota para atualizar um livro. O corpo da requisição deve conter os dados do livro que serão atualizados. O parâmetro ``` id ``` é o identificador do livro retornado ao cadastrar ou listar o(s) livro(s). 
  
- **` DELETE /books/:id `**: Rota para deletar um livro. O parâmetro ``` id ``` é o identificador do livro retornado ao cadastrar ou listar o(s) livro(s). 

### Usuários

- **` POST /users `**: Rota para cadastrar um novo usuário. O corpo da requisição deve conter os dados do usuário tais como: nome, idade, e-mail, senha e telefones. Após o cadastro, será retornado os dados do usuário com o identificador gerado automaticamente e a senha criptografada.
  
- **` GET /users `**: Rota para listar todas os usuários cadastrados. É possível paginar essa listagem através dos parâmetros ``` page ``` e ``` limit ```. Exemplo de paginação: ``` /users?page=2&limit=10 ```
  
- **` GET /users/:id `**: Rota para buscar um usuário específico. O parâmetro ``` id ``` é o identificador do usuário retornado ao cadastrar ou listar o(s) usuário(s).

- **` PUT /users/:id `**: Rota para atualizar um usuário. O corpo da requisição deve conter os dados do usuário que serão atualizados. O parâmetro ``` id ``` é o identificador do usuário retornado ao cadastrar ou listar o(s) usuário(s). 

- **` DELETE /users/:id `**: Rota para deletar um usuário. O parâmetro ``` id ``` é o identificador do usuário retornado ao cadastrar ou listar o(s) usuário(s). 

### Lista de favoritos

- **` POST /bookmark `**: Rota para adicionar um livro na lista de favoritos de um usuário. O corpo da requisição deve conter o identificador do usuário e o identificador do livro. Exemplo de corpo de requisição:

```json
{
	"userId": "60071455d345cd0015191279",
	"emailId": "6007133b36408d82d6998473"
}
```

- **` DELETE /bookmark `**: Rota para remover um livro da lista de favoritos de um usuário. O corpo da requisição deve conter o identificador do usuário e o identificador do livro. Exemplo de corpo de requisição:

```json
{
	"userId": "60071455d345cd0015191279",
	"emailId": "6007133b36408d82d6998473"
}
```

## ⚙️ Testes

Para executar os testes, basta executar ``` yarn test ```

**Importante:** Necessário criar o arquivo ``` .env.test ``` para definir as variáveis de ambiente.

### Autenticação

- **` should be able to authenticate an existent user `**: Para que o teste passe, a aplicação deve retornar um json com o um token válido de autenticação.

- **` should not be able to authenticate an user that not exists `**: Para que o teste passe, a aplicação não deve permitir a autenticação de um usuário que não existe.

- **` should not be able to authenticate an existent user with an invalid password `**: Para que o teste passe, a aplicação não deve permitir a autenticação de um usuário existente com a senha inválida.

- **` should be able to authorize an user through token `**: Para que o teste passe, a aplicação deve processar/autorizar a requisição com o header ``` Authorization ``` setado com o token de autenticação.

- **` should not be able to authorize an user without token `**: Para que o teste passe, a aplicação não deve autorizar a requisição sem o header ``` Authorization ``` setado corretamente.

### Livros

- **` should be able to create a new book `**: Para que o teste passe, a aplicação deve criar um novo livro e retorná-lo em formato JSON junto com identificador gerado automaticamente.

- **` should not be able to create a new book without required fields `**: Para que o teste passe, a aplicação não deve criar um novo livro sem que os campos obrigatórios sejam enviados.

- **` should be able to update an existent book `**: Para que o teste passe, a aplicação deve atualizar um livro existente com base no identificador informado por parâmetro e retorná-lo (atualizado) em formato JSON.

- **` should not be able to update a book that not exists `**: Para que o teste passe, a aplicação não deve atualizar um livro que não existe.

- **` should be able to get an specific book `**: Para que o teste passe, a aplicação deve retornar um livro específico com base no identificador informado por parâmetro.

- **` should be able to list the books `**: Para que o teste passe, a aplicação deve retornar uma lista (array) com os livros cadastrados.

- **` should be able to delete an existent book `**: Para que o teste passe, a aplicação deve deletar um livro com base no identificador informado por parâmetro.

- **` should not be able to delete a book that not exists `**: Para que o teste passe, a aplicação não deve permitir que seja deletado um livro que não existe. 

### Usuários

- **` should be able to create a new user `**: Para que o teste passe, a aplicação deve criar um novo usuário e retorná-lo em formato JSON junto com identificador gerado automaticamente.

- **` should not be able to create a new user without required fields `**: Para que o teste passe, a aplicação não deve criar um novo usuário sem que os campos obrigatórios sejam enviados.

- **` should be able to update an existent user `**: Para que o teste passe, a aplicação deve atualizar um usuário existente com base no identificador informado por parâmetro e retorná-lo (atualizado) em formato JSON.

- **` should not be able to update an user that not exists `**: Para que o teste passe, a aplicação não deve atualizar um usuário que não existe.

- **` should be able to get an specific user `**: Para que o teste passe, a aplicação deve retornar um usuário específico com base no identificador informado por parâmetro.

- **` should be able to list the users `**: Para que o teste passe, a aplicação deve retornar uma lista (array) com os usuários cadastrados.

- **` should be able to delete an existent user `**: Para que o teste passe, a aplicação deve deletar um usuário com base no identificador informado por parâmetro.

- **` should not be able to delete an user that not exists `**: Para que o teste passe, a aplicação não deve permitir que seja deletado um usuário que não existe.

### Lista de favoritos

- **` should be able to add a book on a users bookmark list `**: Para que o teste passe, a aplicação deve permitir a adição de um livro na lista de favoritos de um usuário.

- **` should not be able to add a book on an user bookmark list that does not exist `**: Para que o teste passe, a aplicação não deve permitir a adição de um livro na lista de favoritos de um usuário que não existe.

- **` should not be able to add an nonexistent book on a users bookmark list `**: Para que o teste passe, a aplicação não deve permitir a adição de um livro inexistente na lista de favoritos de um usuário.

- **` should not be able to add a book twice on a users bookmark list `**: Para que o teste passe, a aplicação não deve permitir que o mesmo livro seja adicionado duas vezes na mesma lista de favoritos.

- **` should be able to remove a book on a users bookmark list `**: Para que o teste passe, a aplicação deve permitir a remoção de um livro da lista de favoritos de um usuário.

- **` should not be able to remove an nonexistent book on a users bookmark list `**: Para que o teste passe, a aplicação não deve permitir a remoção de um livro inexistente da lista de favoritos de um usuário.

- **` should not be able to remove a book on an user bookmark list that does not exist `**: Para que o teste passe, a aplicação não deve permitir a remoção de um livro da lista de favoritos de um usuário que não existe.

## 🚀 Deploy

Hospedagem do código feito no heroku e cluster criado no MongoDB Atlas.

A API está disponível [aqui](https://node-library-challenge.herokuapp.com).