# GET /expenses
## Descrição
Listagem e busca de despesas por político.  
A lista retornada é paginada e ordenada da despesa mais nova para a mais velha.
## Parâmetros
### politicianId
- Tipo: String
- Obrigatório
- Regex: /^[0-9a-fA-F]{24}$/
- Modo de passagem: query
### year
- Tipo: Number
- Opcional
- Mínimo: ano atual - 5
- Máximo: ano atual
- Modo de passagem: query
### month
- Tipo: Number
- Opcional
- Mínimo: 1
- Máximo: 12
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
### 200 - Despesas não encontradas
```js
{
	"message": "Despesas não encontradas"
}
```
### 201 - Despesas encontradas
```js
{
  "expenses": [...],
  "total": 207,       // Number. Quantidade total de despesas encontradas
	"pages": 42         // Number. Quantidade total de páginas.
}
```
- O array **expenses** é formado de objetos como o exemplo abaixo:
```js
{
  "provider": {
    "cnpjCpf": "02927004000307",          // String. 11 ou 14 caracteres.
    "name": "TRANSSERVICE PETROLEO LTDA"  // String.
  },
  "date": "2018-07-02T00:00:00.000Z",     // Date.
  "month": 7,                             // Number. 1 a 12.
  "numDoc": "8354",                       // String.
  "type": "COMBUSTÍVEIS E LUBRIFICANTES.",// String.
  "value": "4420.66",                     // String. Duas casas decimais separadas por ponto.
  "year": 2018                            // Number.
},
```

## Exemplos de chamada
- [/expenses?politicianId=5b9c034614572fd78650b47b&year=2018](http://localhost:8080/expenses?politicianId=5b9c034614572fd78650b47b&year=2018)
- [/expenses?politicianId=5b9c034e14572fd78650b7f4&year=2018&perPage=50](http://localhost:8080/expenses?politicianId=5b9c034e14572fd78650b7f4&year=2018&perPage=50)

# GET /expenses/charts
## Descrição
Obtém os dados para a geração dos gráficos.
## Parâmetros
### politicianId
- Tipo: String
- Obrigatório
- Regex: /^[0-9a-fA-F]{24}$/
- Modo de passagem: query
## Respostas
### 200 - Objeto com 3 arrays, um para cada gráfico
```js
{
  "expensesByMonth": [...],         // Ordenado do menor mês para o maior.
  "expensesByType": [...],
  "expensesByTopNProviders": [...]  // Ordenado do maior total para o menor.
}
```
- **expensesByMonth** é composto de objetos como o exemplo abaixo:
```js
{
  "month": 1,         // Number. Mínimo 1, máximo 12.
  "total": "42632.66" // String. Duas casas decimais separadas por ponto.
}
```
- **expensesByType** é composto de objetos como o exemplo abaixo:
```js
{
  "type": "MANUTENÇÃO DE ESCRITÓRIO DE APOIO À ATIVIDADE PARLAMENTAR", // String. Formato livre.
  "total": "31692.52" // String. Duas casas decimais separadas por ponto.
}
```
- **expensesByTopNProviders** é composto de objetos como o exemplo abaixo:
```js
{
  "provider": {
    "cnpjCpf": "10644834000193", // String. Pode ter 11 (CPF) ou 14 caracteres (CNPJ).
    "name": "BR  LOCADORA 20/03" // String. Formato livre.
  },
  "total": "72800.00" // String. Duas casas decimais separadas por ponto.
}
```
## Exemplos de chamada
- [/expenses/charts?politicianId=5b9c034614572fd78650b47b](http://localhost:8080/expenses/charts?politicianId=5b9c034614572fd78650b47b)
- [/expenses/charts?politicianId=5b9c034e14572fd78650b7f4](http://localhost:8080/expenses/charts?politicianId=5b9c034e14572fd78650b7f4)
