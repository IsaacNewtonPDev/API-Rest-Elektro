# ⚡ Elektro API REST

## Sobre o Projeto

A **Elektro API REST** é uma API desenvolvida para um marketplace de eletrônicos seminovos e usados, permitindo que vendedores anunciem produtos e compradores realizem aquisições de forma segura e organizada.

O objetivo da plataforma é oferecer um ambiente confiável para negociação de produtos tecnológicos, disponibilizando recursos como autenticação de usuários, gerenciamento de produtos, upload de imagens, autorização de acesso e demais funcionalidades necessárias para uma aplicação REST moderna.

Este projeto foi desenvolvido como parte do processo de treinamento técnico da **EJCM (Empresa Júnior de Consultoria em Microinformática)**, seguindo os requisitos propostos para avaliação do trainee.

---

# Funcionalidades

* ✅ CRUD completo de Usuários
* ✅ CRUD completo de Produtos
* ✅ Autenticação utilizando Tokens (JWT)
* ✅ Autorização baseada em autenticação
* ✅ Upload de imagens utilizando Multer
* ✅ Validação de dados utilizando Zod
* ✅ Seeder para popular o banco de dados
* ✅ Documentação completa da API utilizando Postman

---

# Tecnologias Utilizadas

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* TypeScript
* JWT
* Multer
* Zod
* Postman

---

# Modelagem do Banco de Dados

> **Importante**

A modelagem do banco de dados utilizada durante o desenvolvimento encontra-se disponível na **raiz deste repositório**.

O arquivo foi desenvolvido utilizando o **brModelo** e documenta toda a estrutura das entidades, seus relacionamentos e cardinalidades.

---

# Documentação da API (Postman)

## ⚠️ IMPORTANTE — LEIA ANTES DE TESTAR A API

A documentação foi gerada através do **Postman** e pode ser acessada pelo link abaixo:

https://documenter.getpostman.com/view/56769796/2sBY4VKczj#e1b77643-3dac-414c-af84-b39d6c501894

### Cada endpoint possui diversos exemplos de requisição.

Por padrão, o Postman exibe apenas **um Example Request**, porém **existem mais de 50 exemplos disponíveis**.

## **Para visualizar todos os testes, é OBRIGATÓRIO alterar o "Example Request" localizado na mesma linha do endpoint.**

**Sempre procure pela opção "Example Request" e vá alternando entre os exemplos disponíveis.**

Caso contrário, você visualizará apenas um pequeno conjunto da documentação e poderá pensar que ela está incompleta.

### Os exemplos disponíveis incluem:

* CRUD User - Create
* CRUD User - Read
* CRUD User - Update
* CRUD User - Delete
* Autentificação - Login
* CRUD Product - Create
* CRUD Product - Read
* CRUD Product - Update e Delete
* Multer - Upload
* Autorização e Segurança
* Estudos de Caso
* Estudos de Caso - Tipos e Autorização

Cada uma dessas categorias possui diversos exemplos demonstrando diferentes cenários de utilização da API.

---

# Como executar o projeto

## 1. Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado em sua máquina:

- Node.js (versão 20 ou superior)
- npm
- PostgreSQL
- Git

---

## 2. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

---

## 3. Instale as dependências

Todas as bibliotecas utilizadas pelo projeto serão instaladas automaticamente com:

```bash
npm install
cd ApiRestElektro
```

---

## 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto contendo as variáveis necessárias para conexão com o banco de dados e autenticação.

Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

PRIVATE_KEY_PATH="src/config/keys/private.key"
PUBLIC_KEY_PATH="src/config/keys/public.key"
```

---

## 5. Gere o par de chaves RSA

Caso as chaves ainda não existam, execute:

```bash
npm run keys
```

Esse comando criará automaticamente a chave pública e a chave privada utilizadas pela autenticação JWT.

---

## 6. Configure o banco de dados

Certifique-se de que o PostgreSQL esteja em execução e que o banco de dados configurado no `.env` exista.

---

## 7. Popule o banco (opcional)

```bash
npm run seeder
```

---

## 8. Inicie a aplicação

```bash
npm start
```

---

# Requisitos atendidos

Este projeto contempla os seguintes requisitos da atividade proposta:

* Modelagem completa do banco de dados
* CRUD completo da entidade Usuário
* CRUD completo de entidade relacionada em One-to-Many
* Autenticação por Tokens
* Upload de imagens utilizando Multer
* Validação utilizando Zod
* Seeder
* Documentação completa em Postman

Conforme especificado no enunciado da atividade.

---

# Autor

Desenvolvido por **Isaac Newton da Silva Previtali Bastos** durante o processo seletivo para a área de Back-End da **EJCM – Empresa Júnior de Consultoria em Microinformática da UFRJ**.
