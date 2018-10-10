# GET /glossary
## Descrição
Obtém a lista de termos segundo uma letra inicial.
A lista é paginada e ordenada alfabeticamente.
## Parâmetros
### letter
- Tipo: String
- Obrigatório
- Tamanho: 1 caractere
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
### 201 - Termos não encontrados
```js
{
	"message": "Termos não encontrados"
}
```
### 201 - Termos encontrados
```js
{
	"terms": [...],   // Array de objetos.
	"total": 1,       // Number. Total de termos encontrados.
	"pages": 1        // Number. Total de páginas.
}
```
- **terms** composto por objetos como o abaixo:
```js
{
  "term": "Legislatura",
  "definition": "Período de quatro anos ..."
}
```
## Exemplos de chamada
- Termos que iniciam com a letra L - [/glossary?letter=l](http://localhost:8080/glossary?letter=l)
