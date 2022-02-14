<h1 align="center">
  <img src=".github/logo.svg" width="300">
</h1>

<p align="center">
  <a href="#-tecnologias">Introdução</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-recursos">Recursos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>
<br>

## 📍 Introdução
API Projects é uma api desenvolvida para o gerenciamento de um portfólio de projetos. Com ele é possível armazenar projetos de forma prática e com segurança, estabelecendo permissões entre os responsáveis pelo gerenciamento da sua marca e com um excelente recurso de armazenagem de imagens, sendo perfeito para empresas que precisam exibir seus projetos ao público, como escritórios de engenharia civil e arquitetura, design e muito mais!

## 🚀 Tecnologias
* [NodeJS](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [MariaDB](https://mariadb.org/)
* [Sequelize](https://sequelize.org/)
* [JWT](https://yarnpkg.com/package/jsonwebtoken)
* [Multer](https://yarnpkg.com/package/multer)
* [SwaggerUI](https://swagger.io/tools/swagger-ui/)

## 📑 Recursos
* Gerencie seus projetos organizando-os por categoria;
* Crie diferentes grupos de usuários para diferentes cargos;
* Rotas utilizadas apenas por usuários com permissões;
* Armazene imagens poupando recursos do host convertendo-as para formato WEBP;
* Faça a requisição das imagens em qualquer tamanho adicionando as medidas no final da url. Exemplo:
```
Padrão: http://localhost:3030/projects/images/1643670539768_29979.webp
400x400: http://localhost:3030/projects/images/1643670539768_29979_400x400.webp
```

## 📖 Documentação
Acesse a rota "/doc" para acessar a documentação do projeto feito com SwaggerUI.

## ⚙️ Antes de tudo...
Configure .env: altere o conteúdo exemplo do arquivo ".env.example" localizado na raíz do projeto com as informações do seu banco de dados, token secret e dados do host, e renomeie-o para .env;

## 🔧 Desenvolvimento
```
yarn add all
yarn dev
```

## 🏭 Produção
```
yarn add all
yarn build
yarn start
```

Obs: Em ambos ambientes serão criados os grupos de usuário e usuário para administração padrão.

## 📌 Usuário Admin
E-mail | Senha
------ | -----
admin@mail.com | 12345678

## :memo: Licença
Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
