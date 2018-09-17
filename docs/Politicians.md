# GET /politicos
## Descrição
Listagem e busca de políticos por Unidade Federativa.  
A lista retornada é paginada.
## Parâmetros
### uf
- Tipo: String
- Obrigatório
- Tamanho: 2 caracteres
- Caixa alta
- Modo de passagem: query
### page
- Tipo: Number
- Opcional
- Inteiro
- Mínimo: 0
- Default: 0
- Modo de passagem: query
### perPage
- Tipo: Number
- Opcional
- Inteiro
- Mínimo: 1
- Default: 5
- Modo de passagem: query
## Respostas
### 200 - Lista
## Exemplos de chamada
- Políticos do Piauí - [/politicos?uf=PI](http://peba-api-dev.herokuapp.com/politicos?uf=PI)
- Políticos do Piauí, segunda página - [/politicos?uf=PI&page=1](http://peba-api-dev.herokuapp.com/politicos?uf=PI&page=1)

# GET /politicos/{id}
## Descrição
Detalha um político de acordo com o id fornecido.
## Parâmetros
### id
- Tipo: String
- Obrigatório
- Regex: /^[0-9a-fA-F]{24}$/
- Modo de passagem: path
## Respostas
### 200 - Detalhes
### 404 - Político não encontrado
## Exemplos de chamada
- Detalhes Capitão Fábio Abreu - [/politicos/5b9c034614572fd78650b49f](http://peba-api-dev.herokuapp.com/politicos/5b9c034614572fd78650b49f)

# POST /politicos
## Descrição
Listagem e busca de políticos por termos.  
A lista retornada é paginada.
## Parâmetros
### terms
- Tipo: Array de String
- Obrigatório
- Tamanho mínimo: 1 String
- Modo de passagem: body
### page
- Tipo: Number
- Opcional
- Inteiro
- Mínimo: 0
- Default: 0
- Modo de passagem: body
### perPage
- Tipo: Number
- Opcional
- Inteiro
- Mínimo: 1
- Default: 5
- Modo de passagem: body
## Respostas
