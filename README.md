# API de Web Scraping no site br.OpenFoodFacts.org

Esse propjeto é uma API que realiza web scraping no site Open Food Facts, desenvolvida como desafio de código para uma vaga de desenvolvedor junior. A API é capaz de buscar produtos e detalhes do produto, filtrando por critérios Nutri-Score, NOVA e pelo ID do produto (código de barras).

## Índice

- [Funcionalidades](#funcionalidades)
- [Desafios e Aprendizados](#desafios-e-aprendizados)
- [Stack](#stack)
- [Rodando localmente](#rodando-localmente)
- [Documentação da API](#documentação-da-api)
- [Desenvolvedor](#desenvolvedor)

## Funcionalidades

- Busca de todos os produtos
- Busca de produtos com filtro utilizando a classificação Nutri-Score e NOVA
- Busca de detalhes do produto através do código de barras (id)

## Desafios e Aprendizados

### Planejamento

O primeiro passo para o desenenvolvimento dessa API foi entender o que era, como funcionava e quais etapas eram realizadas em um processo de web scraping.

Em seguida, defini as tecnologias que seriam utilizadas para o desenvolvimento do projeto. Como critérios de decisão para escolha das tecnologias utilizei o nível de conhecimento e familiaridade com a tecnologia, a disponibilidade de boa documentação e suporte da comunidade.

Antes da etapa de desenvolvimento, foi feito um estudo do site Open Food Facts para entender sua organização, como estavam estruturados os dados que seriam coletados, comportamento das URLs e navegação.

### Desenvolvimento

Para a etapa de desenvolvimento, o projeto foi dividido em várias tarefas menores que funcionaram como "sprints", onde ao final de cada etapa havia a "entrega" de algo funcional e essencial para o desenvolvimento de toda aplicação. Dessa forma, pude avançar no projeto de forma organizada e com segurança até o desenvolvimento da aplicação completa.

As "entregas" das principais sprints foram:

- Buscar os dados de um produto em uma única página;
- Buscar os dados de todos os produtos em uma única página;
- Realizar busca com dois filtros (Nutri-Score e NOVA) em uma única página;
- Realizar busca com apenas um filtro em uma única página;
- Realizar busca de produtos (com e sem filtros) com navegação em multiplas páginas;
- Realizar a busca de detalhes de um produto.

### Desafios Técnicos

#### Extração dos dados

Um dos desafios técnicos enfrentados no desenvolvimento na aplicação foi a extração dos dados requisitados no projeto.

Os dados precisaram ser extraídos de diversas "fontes" diferentes como URLs, atributos de elementos HTML, classes CSS dos elementos.

Além disso, os dados desejados estavam, na maioria dos casos, estavam contidas em meio há outras informações que não eram necessárias ao projeto. Para conseguir extrair apenas os dados necessários foi feita a utilização de Expressões Regulares (RegEx).

#### Navegação entre as páginas

Outro desafio técnico foi o desenvolvimento da lógica para navegação entre as páginas para realização da busca de todos os produtos enfrentados no desenvolvimento na aplicação foi a extração dos dados requisitados no projeto.

#### Separação da aplicação em etapas do web scraping

Inicialmente a aplicação foi desenvolvida sem uma separação muito clara sobre as etapas do web scraping. Como a aplicação estava funcionando, houve um pouco de receio na para implementar da separação do código da aplicação em etapas do web scraping, pois poderia gerar novos problemas cuja solução impactaria o prazo de entrega do projeto.

Porém, além da separação do projeto ser um requisito de avaliação do projeto, também considerei essa tarefa era importante para própria organização, manutenção e compreensão do código da aplicação tanto por mim quanto por outros desenvolvedores.

A implementação da separação do projeto nas etapas do web scraping foi feita em uma branch separada e depois mergeada com a principal, o que me permitiu trabalhar na tarefa de separação do código sem o risco de "quebrar" a aplicação principal.

#### Refatoração do código

Ao longo do projeto, eu tive três preocupações principais: entregar uma aplicação funcional, atender todos os requisitos do projeto e entregar a aplicação dentro do prazo.Com isso em mente, algumas operações realizadas por trás das funcionalidades da aplicação foram desenvolvidas com a mentalidade de "fazer funcionar".

Uma vez que a funcionalidade estava "funcionando", havendo tempo disponível, eu busquei refatorar o código tanto para otimizar as operações de extração dos dados e melhorar a performance da aplicação, como também para facilitar a leitura e entendimento do código.

#### Principais Aprendizados

- A importância de compreender o objetivo do projeto e como a aplicação irá funcionar;
- Ter clareza sobre os motivos que levaram a escolha das tecnologias utilizadas no projeto e entender papel cada uma delas desempenha;
- Como a divisão da etapa de desenvolvimento do projeto em tarefas menores ("sprints") ajuda na evoluir o projeto de forma mais organizada e objetiva;
- Ter clareza sobre os requisitos do projeto e priorizar o que é mais importante.

## Stack

**Back-end:** Node.js, Express, Puppeteer e Swagger

## Rodando localmente

#### Pré-requisitos

- Node.js 18.16.0+

Clone o projeto

```bash
  git clone https://github.com/rodolfooliveiram/open-food-facts-web-scraping-api.git
```

Entre no diretório do projeto

```bash
  cd open-food-facts-web-scraping-api
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm start
```

## Documentação da API

#### Retorna dados de produtos

```http
  GET /v1/products
```

| Parâmetro   | Tipo     | Descrição                                        |
| :---------- | :------- | :----------------------------------------------- |
| `nutrition` | `string` | Classificação Nutri-Score do produto (opcional). |
| `nova`      | `int`    | Classificação NOVA do produto (opcional).        |

#### Retorna detalhes de um produto

```http
  GET /v1/products/${id}
```

| Parâmetro | Tipo     | Descrição                                                          |
| :-------- | :------- | :----------------------------------------------------------------- |
| `id`      | `string` | Código de barras utilizado como ID para buscar detalhes do produto |

#### Swagger API Docs

Também é possível consultar a API e testar o seu funcionamento através da documentação criada com Swagger.

```http
  GET /v1/api/
```

## Desenvolvedor

<a href="https://www.linkedin.com/in/rodolfooliveiram">
  <img width="150em" src="https://img.shields.io/badge/Rodolfo Oliveira-0a66c2?style=flat&logo=linkedin&logoColor=white&labelColor=0a66c2" />
</a>
