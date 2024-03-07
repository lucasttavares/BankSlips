# BankSlips - API REST para geração de boletos

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4A7DA4?style=for-the-badge&logoColor=white"/>
<img src="https://img.shields.io/badge/Knex.js-%23FF9900.svg?style=for-the-badge&logoColor=white"/><img src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logoColor=white"/>
<img src="https://img.shields.io/badge/Swagger-%2FFFF.svg?style=for-the-badge&logoColor=white"/>

Este projeto consiste em uma API REST responsável por gerar e gerenciar boletos, visando execução de cinco endpoints:

- Criar boleto - POST localhost:8080/rest/bankslips
- Listar boletos - GET localhost:8080/rest/bankslips
- Ver detalhes - GET localhost:8080/rest/bankslips/{id}
- Pagar um boleto - POST localhost:8080/rest/bankslips/{id}/payments
- Cancelar um boleto - DELETE localhost:8080/rest/bankslips/{id}

## Tecnologias utilizadas:

- [Typescript](https://www.typescriptlang.org/) - Linguagem de programação fortemente tipada baseada em JavaScript
- [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript do lado do servidor
- [MySQL](https://www.mysql.com/) - Sistema de gerenciamento de banco de dados, que utiliza a linguagem SQL como interface
- [Knex.js](https://knexjs.org/) - Construtor de consultas SQL
- [Jest](https://jestjs.io/) - Framework de teste em JavaScript
- [Swagger](https://swagger.io/) - Ferramenta para edição, vizualização e especificação de documentação

## Como executar

1. Clone o repositório e acesse a pasta do projeto

2. Configure a conexão da sua imagem Docker

3. Crie um aquivo `.env` na raiz do projeto com a seguinte estrutura

```
PORT=8080
TOKEN_KEY=ZNG_vsEZiHl8teDpokN_bw (ou a chave que desejar)
DB_HOST=localhost
DB_USER=root (ou usuário que desejar)
DB_PASSWORD=root-pw (ou senha que desejar)
DB_NAME=bankslips
DB_PORT=3306
```

4. Instale os pacotes com o comando `npm install`

5. Execute o comando `docker compose up` na pasta do projeto

6. Crie uma conexão no Gerenciador de Bancos de Dados de sua preferência com as informações necessárias dispostas no `.env`

## Exemplos de requisições

### Registrar Administrador

```
{
 "email": "admin@admin.com",
 "user": "admin",
 "password": "123456"
}
```

### Autenticar Administrador

```
{
 "email": "admin@admin.com",
 "password": "123456"
}
```

### Criar Boleto

```
{
 "due_date":"2023-12-05",
 "total_in_cents":"10000",
 "customer":"Trillian Company"
}
```

### Pagar um boleto

```
{
 "payment_date":"2023-12-01"
}
```

## Dokcer

A imagem Docker do `MySQL` pode ser instalada manualmente através do comando `docker pull mysql`.

Altere o arquivo `docker-compose.yml` seguindo as configurações do seu `.env` (altere os campos que julgar necessário):

```
version: '3.3'

services:
  mysql:
    container_name: mysql-server
    image: mysql
    restart: always
    environment:
      MYSQL_USER: ''
      MYSQL_PASSWORD: ''
      MYSQL_ROOT_USER: root
      MYSQL_ROOT_PASSWORD: root-pw
    ports:
      - '3306:3306'
    expose:
      - 3306

```
