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
### 200 - Políticos não encontrados
```js
{
  "message": "Políticos não encontrados"
}
```
### 201 - Políticos encontrados
```js
{
  "politicians": [...], // Array de objetos
  "total": 17,          // Number. Quantidade total de políticos encontrados.
	"pages": 4            // Number. Quantidade total de páginas.
}
```
- **politicians** é composto por objetos como o exemplo abaixo:
```js
{
  "_id": "5b9c034614572fd78650b47b",  // String.
  "cargo": "Deputado Federal",        // String. Valores válidos ["Deputado Federal", "Senador"]
  "nome": "Assis Carvalho",           // String.
  "siglaPartido": "PT",               // String.
  "siglaUf": "PI",                    // String.
  "urlFoto": "http://www.camara.leg.br/internet/deputado/bandep/159237.jpg", // String
  "totalDespesas": "324505.07"        // String. Duas casas decimais separadas por ponto.
},
```
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
```js
{
	"_id": "5b9c034614572fd78650b480",
	"cargo": "Deputado Federal",
	"email": "dep.átilalira@camara.leg.br",
	"endereco": "Gabinete 640, Prédio 4, Sala 640, Andar 6",
	"nome": "Atila Lira",
	"siglaPartido": "PSB",
	"siglaUf": "PI",
	"telefone": "3215-5640",
	"urlFoto": "http://www.camara.leg.br/internet/deputado/bandep/74459.jpg",
	"totalDespesas": "275104.15"
}
```
### 404 - Político não encontrado
```js
{
	"code": "NotFound",
	"message": "Político não encontrado"
}
```
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
### 200 - Políticos não encontrados
```js
{
  "message": "Políticos não encontrados"
}
```
### 201 - Lista
## Exemplos de chamada
### Políticos maranhenses do PP, 2 políticos por página
- Requisição POST com body abaixo:
```js
{
	"terms": ["MA", "PP"],
	"perPage": 2
}
```
- Resposta 200 com body abaixo:
```js
{
	"politicians": [
		{
			"_id": "5b9c034614572fd78650b44e",
			"cargo": "Deputado Federal",
			"nome": "Alberto Filho",
			"siglaPartido": "PP",
			"siglaUf": "MA",
			"urlFoto": "http://www.camara.leg.br/internet/deputado/bandep/160582.jpg",
			"totalDespesas": "124765.53",
			"score": 4.4
		},
		{
			"_id": "5b9c034614572fd78650b464",
			"cargo": "Deputado Federal",
			"nome": "Andre Fufuca",
			"siglaPartido": "PP",
			"siglaUf": "MA",
			"urlFoto": "http://www.camara.leg.br/internet/deputado/bandep/178882.jpg",
			"totalDespesas": "199757.49",
			"score": 4.4
		}
	],
	"total": 98,
	"pages": 49
}
```



