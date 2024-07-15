# Desafio de SQL e API REST

## Instruções para entrega

1. Faça o fork deste repositório
2. Clone o repositório forkado
3. Edite o final deste README colocando o nome da dupla no local indicado (não é necessário clonar o repositório. Você pode fazer esse passo pelo próprio GitHub)
4. Abra um pull request colocando o nome da dupla e sobrenome no título do pull request
5. Copie o link do seu pull request (PR) e cole-o na Plataforma do Aluno no local indicado para a entrega (o link do pull request termina com "/pull/`NUMERO_DO_PULL_REQUEST`")

#### ⚠️ Importante: o passo a passo acima visa priorizar a entrega do desafio logo nos primeiros minutos. Se desejar, pode deixar para fazer o pull request (PR) e a entrega do link na plataforma após o término do projeto

#### ⚠️ Importante: você NÃO deve abrir mais de um pull request. Ao atualizar a branch main do seu repositório remoto (git push), seu PR será atualizado também

#### ⚠️ Importante: se o pull request não for criado e enviado na plataforma, o feedback não será fornecido e o desafio NÃO constará como entregue

## Primeiros passos

1. Clone o projeto
2. Use o comando `npm install` para instalar as dependências
3. Troque o nome do arquivo `.exemplo.env` para `.env`
4. A porta configurada para sua aplicação rodar é a 3000. Caso deseje trocá-la, mude o valor da variável "PORTA" que está dentro do arquivo ".env"
5. Use o comando `npm run dev` para rodar o projeto

#### ⚠️ Importante: repare que o projeto já inicia com uma estrutura inicial. Você NÃO deve mexer nessa estrutura

## Como testar seu código e saber a nota

Para testar seu código, use o comando:

- `npm run test`: esse comando irá mostrar no terminal sua nota e irá gerar uma pasta chamada "resultados". Dentro da pasta terá um arquivo chamado "relatorio.html", que é um relatório detalhando os resultados dos testes. Esse relatório será aberto automaticamente no seu navegador

#### ⚠️ Importante: se por algum motivo o relatório não for aberto automaticamente no seu navegador, sugerimos que instale uma extensão no VS Code chamada "Live Server". Após instalada, clique com o botão direito em cima do arquivo "resultados/relatorio.html" e clique em "Abrir com Live Server" ("Open with Live Server")

#### ⚠️ Importante: seu banco de dados será limpo sempre que realizar os testes

## Dicas

- Faça commits regulares
- Quando terminar, lembre-se de atualizar seu repositório remoto (`git push`)

## Descrição do desafio

A empresa onde você trabalha como desenvolvedor, a Cubos Tecnologia, está prestes a lançar um novo produto inovador voltado ao auxílio dos alunos em seus estudos. Esse produto promete transformar a maneira como os estudantes interagem com o conteúdo das aulas, oferecendo uma série de funcionalidades projetadas para otimizar a organização e a revisão dos materiais estudados. As principais funcionalidades incluem:

- **Cadastro de Usuários:** Os alunos poderão se registrar no sistema, criando uma conta pessoal para acessar todas as funcionalidades do produto
- **Login Seguro:** Após o cadastro, os alunos poderão realizar login no sistema, garantindo um acesso seguro e personalizado
- **Listagem de Matéria:** O sistema permitirá a listagem de todas as matérias existentes no banco de dados, permitindo ao aluno associar os resumos criados à uma matéria
- **Criação de Resumos de Aula:** Os alunos terão a possibilidade de criar resumos das aulas com base nos tópicos que digitarem, permitindo uma síntese eficiente do conteúdo aprendido
- **Listagem de Resumos:** O sistema permitirá a listagem de todos os resumos criados, facilitando o acesso e a organização dos materiais de estudo
- **Filtragem por Matéria:** Quando os alunos clicarem em salvar o resumo, abrirá uma janela que perguntará a eles a qual matéria aquele resumo pertence (na Figura 2, os nomes "Resumo 1", "Resumo 2", ..., representam as matérias às quais os resumos estão ligados). Sendo assim, os alunos poderão filtrar os resumos criados por matéria, o que ajudará a localizar rapidamente informações relevantes para cada disciplina
- **Edição de Resumos:** Será possível editar resumos já criados, permitindo atualizações e correções conforme necessário
- **Exclusão de Resumos:** O sistema também permitirá a deleção de resumos, garantindo que os alunos possam gerenciar seu conteúdo de maneira eficiente e manter apenas o que for realmente útil

Com este novo produto, a Cubos Tecnologia visa fornecer uma ferramenta poderosa e intuitiva que ajudará os alunos da Cubos Academy a maximizar seu potencial de aprendizado e a organizar seus estudos de forma mais eficaz

Os profissionais de design da empresa fizeram um primeiro desenho as duas telas principais do sistema, que serão mostradas após a tela de cadastro e login (após o usuário estar logado)

| ![Página principal do Resume AI](assets/resumeAiHome.png) |
| :-------------------------------------------------------: |
|         _Figura 1. Página principal do Resume AI_         |

| ![Página de gerencimento de resumos do Resume AI](assets/resumeAiGerenciamentoResumos.png) |
| :----------------------------------------------------------------------------------------: |
|                _Figura 2. Página de gerenciamento de resumos do Resume AI_                 |

Seu papel é construir uma API RESTful que permita ao usuário:

- Cadastrar no sistema
- Fazer login no sistema
- Listar as matérias
- Criar um resumo
- Listar os resumos criados
- Filtrar os resumos criados por uma matéria
- Editar um resumo criado
- Deletar um resumo criado

#### ⚠️ Importante: sempre que a validação de uma requisição falhar, responda com código de erro e mensagem adequada à situação. Essa mensagem, que deverá ser exatamente a pedida em cada cenário, deve ser o valor de uma propriedade chamada "mensagem" de um JSON (veja o exemplo abaixo)

#### ⚠️ Importante: todos os retornos deverão ser no formato JSON

**Exemplo:**

```json
// id informado de um resumo não existe
// HTTP status 404
{
  "mensagem": "Resumo não encontado"
}
```

## ⚠️ Padronização do projeto

Você deve seguir exatamente o padrão de nomenclatura solitado neste documento. Ou seja, se for pedido que seja criado um campo em um objeto ou tabela do banco de dados chamado "nomeCompleto", você deve seguir exatamente o padrão, não sendo aceito "nome_completo", "nome-completo" ou outros derivados

## Requisitos Obrigatórios

- A API a ser criada deverá persistir os dados em um banco PostgreSQL
- O campo "id" das tabelas deve ser auto incremento, chave primária e não deve permitir edição
- Seu código deverá estar organizado, delimitando as responsabilidades de cada arquivo adequadamente
- Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função/método

### Status Code

Abaixo, listamos alguns dos possíveis **status code** esperados como resposta da API

Obs.: A lista abaixo é para consulta. **Não** significa que todos os **status codes** precisam necessariamente ser utilizados

```ts
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
// 409 (Conflict) = indica que a requisição não pôde ser completada devido a um conflito com o estado atual do recurso
// 500 (Internal Server Error) = falhas causadas pelo servidor
```

---

---

<details>
<summary>Parte 01</summary>

### Criação do Banco de Dados

Crie um banco de dados chamado `resume_ai` contendo as seguintes tabelas e colunas:

- usuarios

  - id (chave primária e autoincremento)
  - nome (tipo texto e obrigatório)
  - email (tipo texto, obrigatório e único)
  - senha (tipo texto e obrigatório)

- resumos

  - id (chave primária e autoincremento)
  - usuario_id (chave estrangeira para o id do usuário)
  - materia_id (chave estrangeira para o id da matéria)
  - topicos (tipo texto e obrigatório)
  - descricao (tipo texto e obrigatório)
  - criado (tipo data, não nula e gerada pelo banco como a data atual)

- materias

  - id (chave primária e autoincremento)
  - nome (tipo texto e obrigatório)

#### ⚠️ Importante: atente-se aos nomes pedidos para as tabelas, as colunas e ao banco de dados

#### ⚠️ Importante: você deve disponibilizar os comandos SQL usadados para a criação do banco de dados e das tabelas no arquivo chamado "comandos.sql", que está na raiz do seu projeto

### Criação dos comando SQL necessários

Nessa etapa vamos criar os comandos SQL que usaremos posteriormente em nossa API. Crie o SQL necessário para:

- Insira os valores que serão válidos na tabela "materias". Os valores serão:
  - Back-end
  - Front-end
  - Carreira
  - Mobile
  - Design
  - Dados
  - SQL
- Crie o comando para listar as matérias
- Crie o comando para verificar se existe um usuário com um dado e-mail
- Crie o comando para criar um usuário
- Crie o comando para criar um resumo
- Crie o comando para listar os resumos que correspondem a um determinado usuário
- Crie o comando para listar os resumos filtrados por uma matéria e que correspondem a um determinado usuário
- Crie o comando para verificar se um resumo com um determinado id pertence a um determinado usuário (lembre-se que um usuário é identificado pelo seu id)
- Crie o comando para editar todos os campos de um resumo especificado pelo seu id
- Crie o comando para deletar um resumo especificado pelo seu id
- Crie o comando para visualizar a quantidade de resumos gerados em um determinado mês e ano

</details>

<details>
<summary>Parte 02</summary>

### Criar uma conta

#### `POST` `/usuarios`

Esse endpoint deverá cadastrar um novo usuário no sistema

- ### Requisição

Sem parâmetros de rota ou de consulta

O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

- nome: campo **obrigatório** do tipo string
- email: campo **obrigatório** do tipo string
- senha: campo **obrigatório** do tipo string

- ### Resposta

- Em caso de **sucesso**: informações do usuário cadastrado, incluindo seu id e excluindo sua senha criptografada
- Em caso de **erro**:

  - algum campo obrigatório não enviado: status code apropriado e a mensagem "Todos os campos são obrigatórios"
  - caso exista algum usuário cadastrado com o e-mail passado: status code apropriado e a mensagem "E-mail já cadastrado"

- ### REQUISITOS OBRIGATÓRIOS

```
- Validar se todos os campos obrigatórios foram enviados
- Validar se o e-mail informado já existe
- Criptografar a senha usando bcrypt antes de persistir no banco de dados
- Cadastrar o usuário no banco de dados
- Retornar as informações do usuário
```

- ### Exemplo de requisição

```json
// POST /usuario
{
  "nome": "José",
  "email": "jose@email.com",
  "senha": "123456"
}
```

- ### Exemplos de respostas

```json
// HTTP Status 200 / 201 / 204
{
  "id": 1,
  "nome": "José",
  "email": "jose@email.com"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Todos os campos são obrigatórios"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "E-mail já cadastrado"
}
```

### Fazer login

#### `POST` `/login`

Esse endpoint será responsável pelo login do usuário

Usaremos o jsonwebtoken para gerar o token de autenticação. Crie uma variável de ambiente dentro do arquivo `.env` (nessa parte, você já deve ter renomeado o arquivo `.exemplo.env` para `.env`, conforme pedido) para armazenar a frase secreta usada pelo jwt

- ### Requisição

Sem parâmetros de rota ou de consulta

O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

- email: campo **obrigatório** do tipo string
- senha: campo **obrigatório** do tipo string

- ### Resposta

- Em caso de **sucesso**: retornar o token de autenticação
- Em caso de **erro**:

  - algum campo obrigatório não enviado: status code apropriado e a mensagem "Todos os campos são obrigatórios"
  - caso e e-mail passado não exista no banco de dados: status code apropriado e a mensagem "E-mail ou senha inválidos"
  - caso a senha passada não corresponda à senha cadastrada no banco de dados: status code apropriado e a mensagem "E-mail ou senha inválidos"

- ### REQUISITOS OBRIGATÓRIOS

```
- Validar campos obrigatórios
- Verificar se o e-mail passado existe no banco
- Validar se a senha passada corresponde à senha cadastrada
- Retornar o token de autenticação
```

- ### Exemplo de requisição

```json
// POST /login
{
  "nome": "José",
  "email": "jose@email.com"
}
```

- ### Exemplos de respostas

```json
// HTTP Status 200 / 201 / 204
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.sp3k-Xf-Um4tKxTMNnJ777_q43IyaN17TyS0-pzAaIY"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Todos os campos são obrigatórios"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "E-mail ou senha inválidos"
}
```

</details>

<h3 style="color: yellow;">TODAS AS ROTAS A PARTIR DESSE PONTO SERÃO PROTEGIDAS. DEVE-SE VALIDAR O TOKEN DE AUTENTICAÇÃO</h3>

<details>
<summary>Parte 03</summary>

### Validação do token

Você deve criar a validação do token, que deve ser enviado no cabeçalho da requisição

- Retorne um status apropriado com a mensagem "Falha na autenticação" caso o token não seja passado ou caso ele não seja válido. Lembre-se de verificar se os dado(s) presente(s) no token existem no banco de dados

- ### Exemplo de resposta

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Falha na autenticação"
}
```

#### ⚠️ Dica: crie a validação do token em um intermediário

### Listar matérias

#### `GET` `/materias`

Essa rota será responsável pela listagem das matérias cadastradas

- ### Requisição

Sem parâmetros de rota, consulta e sem corpo

- ### Resposta

- Em caso de **sucesso**: retornar as matérias cadastradas no banco de dados

- ### REQUISITOS OBRIGATÓRIOS

```
- Retornar todas as matérias
```

- ### Exemplo de requisição

```json
// GET /materias
```

- ### Exemplo de resposta

```json
// HTTP Status 200 / 201 / 204

[
  {
    "id": 1,
    "nome": "Back-end"
  },
  {
    "id": 2,
    "nome": "Front-end"
  },
  {
    "id": 3,
    "nome": "Carreira"
  }
]
```

**OBS: o exemplo de resposta acima não mostra a listagem completa das matérias, sendo meramente ilustrativo**

</details>

<details>
<summary>Parte 04</summary>

### Criar um resumo

#### `POST` `/resumos`

Essa rota será responsável pela criação de um novo resumo

O cliente deverá enviar:

- id da matéria: um número contendo a qual matérias aquele resumo pertence
- título do resumo: uma string contendo o título que será dado ao resumo. Caso não seja passado, você deve cadastrar o nome do resumo como "Sem nome"
- os tópicos que serão usados para fazer o texto do resumo: um array de strings (**NÃO VAZIO**). Eles serão salvos no banco de dados como uma string separada por ", " (vírula seguida de um espaço em branco). Apesar de serem persistidos como uma string, eles serão sempre devolvidos ao cliente como um array

#### ⚠️ Importante: em um primeiro momento, a descrição do resumo será uma string qualquer que desejar. Futuramente, a descrição será gerada por um serviço de Inteligência Artificial. Sendo assim, sugere-se, fortemente, que seja criada uma função/método à parte para gerar a descrição. Isso facilitará, no futuro, que mude a forma de geração

- ### Requisição

Sem parâmetros de rota e consulta

O corpo (body) deverá possuir um objeto com a seguinte propriedade (respeitando estes nomes):

- materiaId: campo **obrigatório** do tipo number
- titulo: campo **optativo** do tipo string
- topicos: campo **obrigatório** do tipo array (não vazio) de strings

- ### Resposta

- Em caso de **sucesso**: cadastrar o novo resumo e retornar os seus dados, incluindo o id
- Em caso de **erro**:

  - campo obrigatório não enviado ou array de tópicos vazio: status code apropriado e a mensagem "Todos os campos são obrigatórios"
  - id da matéria não existe: status code apropriado e a mensagem "Matéria não encontrada"

- ### REQUISITOS OBRIGATÓRIOS

```
- Validar se os campos obrigatórios foram enviados
- Validar se a matéria passada existe
- Cadastrar no banco de dados o resumo com o título "Sem título" caso o campo "titulo" não seja passado
- Cadastrar no banco de dados o resumo
- Retornar os dados do resumo
```

- ### Exemplo de requisição

```json
// POST /resumos
{
  "materiaId": 3,
  "titulo": "Resumo sobre API",
  "topicos": ["rotas", "intermediarios", "controladores"]
}
```

- ### Exemplos de respostas

```json
// HTTP Status 200 / 201 / 204
{
  "id": 1,
  "usuarioId": 22,
  "materiaId": 3,
  "titulo": "Resumo sobre API",
  "topicos": "rotas, intermediarios, controladores",
  "descricao": "Em uma API REST, rotas são os pontos de entrada que mapeiam URLs específicas para ações específicas, permitindo que clientes interajam com o servidor. Intermediários, ou middlewares, são funções que interceptam as requisições e respostas, podendo realizar tarefas como autenticação, registro de logs e manipulação de dados antes que estes cheguem aos controladores. Os controladores, por sua vez, são responsáveis por implementar a lógica de negócios da aplicação, processando as requisições, interagindo com o banco de dados ou outros serviços, e retornando as respostas apropriadas aos clientes. Dessa forma, rotas definem o caminho, intermediários manipulam o fluxo de dados e controladores executam a lógica principal, colaborando para criar uma arquitetura modular e organizada em uma API REST.",
  "criado": "2024-06-24T03:00:00.000Z"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Todos os campos são obrigatórios"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Matéria não encontrada"
}
```

### Listar resumos

#### `GET` `/resumos`

Essa rota será responsável pela listagem dos resumos do usuário logado

- ### Requisição

Sem parâmetros de rota e sem corpo

O parâmetro de consulta chamado "materia" armazena o nome da matéria que o usuário deseja filtrar seus resumos

- ### Resposta

- Em caso de **sucesso**: retornar os resumos do usuário logado. Caso o usuário logado consiga ver algum resumo que não esteja relacionada a ele, teremos um erro muito grave de segurança e privacidade

- ### REQUISITOS OBRIGATÓRIOS

```
- O usuário logado só pode ver os resumos ligados a ele
- Caso o parâmetro de consulta "materia" seja passado, deve-se retornar os resumos filtrados pela matéria pedida
- Caso o parâmetro de consulta "materia" não seja passado, deve-se retornar todos os resumos
```

- ### Exemplo de requisição

```json
// GET /resumos?materia=Back-end
```

- ### Exemplo de resposta

```json
// HTTP Status 200 / 201 / 204

[
  {
    "id": 1,
    "usuarioId": 22,
    "materia": "Back-end",
    "titulo": "Resumo sobre API",
    "topicos": ["rotas", "intermediarios", "controladores"],
    "descricao": "Em uma API REST, rotas são os pontos de entrada que mapeiam URLs específicas para ações específicas, permitindo que clientes interajam com o servidor. Intermediários, ou middlewares, são funções que interceptam as requisições e respostas, podendo realizar tarefas como autenticação, registro de logs e manipulação de dados antes que estes cheguem aos controladores. Os controladores, por sua vez, são responsáveis por implementar a lógica de negócios da aplicação, processando as requisições, interagindo com o banco de dados ou outros serviços, e retornando as respostas apropriadas aos clientes. Dessa forma, rotas definem o caminho, intermediários manipulam o fluxo de dados e controladores executam a lógica principal, colaborando para criar uma arquitetura modular e organizada em uma API REST.",
    "criado": "2024-05-01T10:45:00.000Z"
  },
  {
    "id": 6,
    "usuarioId": 22,
    "materia": "Back-end",
    "titulo": "Resumo sobre NodeJS",
    "topicos": ["typescript", "node"],
    "descricao": "TypeScript é uma linguagem de programação que adiciona tipagem estática ao JavaScript, permitindo o desenvolvimento de aplicações Node.js mais robustas e escaláveis.",
    "criado": "2024-06-24T03:00:00.000Z"
  }
]
```

### Editar um resumo

#### `PUT` `/resumos/:id`

Essa rota será responsável pela edição de um resumo

O usuário só poderá editar o título do resumo e a matéria

- ### Requisição

Sem parâmetros de consulta

O id do resumo a ser editado deve ser passado como parâmetro de rota

O corpo (body) deverá possuir um objeto com a seguinte propriedade (respeitando estes nomes):

- materiaId: campo **obrigatório** do tipo number
- titulo: campo **obrigatório** do tipo string (veja que na edição, ao contrário do cadastro, o campo será obrigatório)

- ### Resposta

- Em caso de **sucesso**: editar o resumo e retornar os seus dados editados
- Em caso de **erro**:

  - campo obrigatório não enviado: status code apropriado e a mensagem "Todos os campos são obrigatórios"
  - id do resumo não existe ou o resumo não pertence ao usuário logado: status code apropriado e a mensagem "Resumo não encontrado"
  - id da matéria não existe: status code apropriado e a mensagem "Matéria não encontrada"

- ### REQUISITOS OBRIGATÓRIOS

```
- Validar se os campos obrigatórios foram enviados
- Validar se a matéria passada existe
- Validar se o resumo passado existe e pertence ao usuário logado
- Editar no banco de dados o resumo
- Retornar os dados do resumo editado
```

- ### Exemplo de requisição

```json
// PUT /resumos/10
{
  "materiaId": 3,
  "titulo": "Novo título"
}
```

- ### Exemplos de respostas

```json
// HTTP Status 200 / 201 / 204
{
  "id": 10,
  "usuarioId": 22,
  "materiaId": 3,
  "titulo": "Novo título",
  "topicos": ["rotas", "intermediarios", "controladores"],
  "descricao": "Em uma API REST, rotas são os pontos de entrada que mapeiam URLs específicas para ações específicas, permitindo que clientes interajam com o servidor. Intermediários, ou middlewares, são funções que interceptam as requisições e respostas, podendo realizar tarefas como autenticação, registro de logs e manipulação de dados antes que estes cheguem aos controladores. Os controladores, por sua vez, são responsáveis por implementar a lógica de negócios da aplicação, processando as requisições, interagindo com o banco de dados ou outros serviços, e retornando as respostas apropriadas aos clientes. Dessa forma, rotas definem o caminho, intermediários manipulam o fluxo de dados e controladores executam a lógica principal, colaborando para criar uma arquitetura modular e organizada em uma API REST.",
  "criado": "2024-06-24T03:00:00.000Z"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Todos os campos são obrigatórios"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Matéria não encontrada"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Resumo não encontrado"
}
```

### Deletar um resumo

#### `DELETE` `/resumo/:id`

Essa rota será responsável por deletar um resumo do usuário logado

- ### Requisição

Sem parâmetros de consulta ou corpo

O parâmetro de rota é responsável por identificar o resumo a ser deletado

- ### Resposta

- Em caso de **sucesso**: sem corpo
- Em caso de **erro**:

  - caso não exista o resumo do usuário logado com o id passado: status code apropriado e a mensagem "Resumo não encontrado"

- ### REQUISITOS OBRIGATÓRIOS

```
- Validar se o id do resumo passado existe no banco de dados e se pertence ao usuário logado
```

- ### Exemplo de requisição

```json
// DELETE /resumo/1
```

- ### Exemplos de respostas

```json
// HTTP Status 200 / 201 / 204
```

```json
// HTTP Status 400 / 401 / 403 / 404 / 409
{
  "mensagem": "Resumo não encontrado"
}
```

</details>

<details>
<summary>[Optativa] Parte 05</summary>

Os itens pedidos abaixo são optativos

#### ⚠️ Importante: caso opte por fazer os itens abaixo, faça um commit do seu código antes. Assim, caso tenha algum problema, você pode retornar à versão desejada. Além disso, faça aos poucos e teste regularmente o projeto, não tente fazer tudo de uma única fez

### Tente utilizar algum serviço de inteligência artificial para gerar o resumo

Tente se conectar a algum serviço de inteligência artificial, por exemplo, a API do Chat GPT para gerar os resumos. Você terá que ler a documentação do serviço que escolher e deverá, necessariamente, utilizar o `axios` para fazer a requisição, ou seja, não use a biblioteca do serviço escolhido (caso tenha). Isso fará com que seu código tenha maior flexibilidade para uma possível troca de serviço no futuro

#### ⚠️ Dica: a maioria dos serviços vai solicitar que você passe uma frase, geralmente uma pergunta ou comando, para que ele gere a resposta. Sendo assim, sugere-se que você monte uma frase do tipo `Crie um resumo de um parágrafo baseado nas seguintes palavras chave: ${topicos.join(', ')}`. A parte "de um parágrafo" é para agilizar a resposta do serviço

#### ⚠️ Dica: Caso queira utilizar a API do Chat GPT, a documentação de como fazer uma requisição pode ser encontrada em <https://platform.openai.com/docs/api-reference/making-requests>

</details>

---

---

**COLOQUE SEU NOME AQUI:**
