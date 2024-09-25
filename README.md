<h1 align="center">
  Web Developer Essentials - API
</h1>

## 💻 Projeto

Este projeto foi desenvolvido como uma loja completa e inicialmente seguia o padrão arquitetural MVC (Model, View, Controller). Agora, evoluiu para uma **API RESTful**, com essa transição, todas as operações que antes dependiam de uma aplicação server-side com renderização de views, agora são gerenciadas por endpoints REST, proporcionando maior flexibilidade e escalabilidade para integrações com diferentes front-ends.

O sistema continua a oferecer funcionalidades como explorar e visualizar produtos, criar novas ofertas, editar e excluí-las. As operações de conta também estão presentes, permitindo a criação de novas contas, acesso a informações do usuário, adição de produtos ao carrinho e conclusão de compras. A integração com o **Stripe** para simulação de transações foi mantida, aproveitando os métodos de pagamento da plataforma.

O sistema abrange todas as operações de um CRUD completo (Create, Read, Update, Delete) e vai além, proporcionando uma experiência abrangente para o usuário.

### 🛠 Funcionalidades:

- Autenticação e autorização;
- Operações de CRUD para produtos, contas e pedidos;
- Integração com o Stripe para processamento de pagamentos;
- Adição de produtos ao carrinho e conclusão de compras.

### 💡 Novas tecnologias e funcionalidades:

- **11/23** - Introdução do uso de `.env` para gerenciamento seguro de variáveis de ambiente sensíveis;

- **09/24** - Introdução do uso de `Typescript` para tipagem de dados e mitigação de erros;


## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [MongoDB](https://www.mongodb.com/)
- [.ENV](https://www.dotenv.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Stripe](https://stripe.com/)
