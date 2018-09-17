# POST /glossary
## Descrição
Cria um termo no dicionário.
## Parâmetros
### term
- Tipo: String
- Obrigatório
- Modo de passagem: body
### definition
- Tipo: String
- Obrigatório
- Modo de passagem: body
## Respostas
### 409 - Termo já cadastrado
```js
{
	"code": "Conflict",
	"message": "Termo já cadastrado"
}
```
### 201 - Termo cadastrado
```js
{
	"_id": "5b9fb81f3990e1004e5c63a6",
	"term": "Legislatura",
	"definition": "Período de quatro anos, cuja duração coincide com a dos mandatos dos deputados. Começa no dia 1º de fevereiro, data em que tomam posse os senadores e deputados eleitos. A posse ocorre em uma primeira reunião preparatória, realizando-se depois a segunda reunião para eleição do presidente da Casa, e a terceira, destinada à escolha dos demais integrantes da Mesa, para mandato de dois anos. No fim da legislatura são arquivadas todas as proposições em tramitação na Casa, salvo as originárias da Câmara dos Deputados ou as que tenham passado por sua revisão, bem como as que receberam parecer favorável das comissões. Também são arquivadas matérias que tramitam há duas legislaturas. As proposições arquivadas nessas condições não podem ser desarquivadas.",
	"__v": 0
}
```
## Exemplos de chamada
Para a resposta acima, a requisição feita contém o seguinte body:
```js
{
	"term": "Legislatura",
	"definition": "Período de quatro anos, cuja duração coincide com a dos mandatos dos deputados. Começa no dia 1º de fevereiro, data em que tomam posse os senadores e deputados eleitos. A posse ocorre em uma primeira reunião preparatória, realizando-se depois a segunda reunião para eleição do presidente da Casa, e a terceira, destinada à escolha dos demais integrantes da Mesa, para mandato de dois anos. No fim da legislatura são arquivadas todas as proposições em tramitação na Casa, salvo as originárias da Câmara dos Deputados ou as que tenham passado por sua revisão, bem como as que receberam parecer favorável das comissões. Também são arquivadas matérias que tramitam há duas legislaturas. As proposições arquivadas nessas condições não podem ser desarquivadas."
}
```

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
- Termos que iniciam com a letra L - [/glossary?letter=l](http://peba-api-dev.herokuapp.com/glossary?letter=l)
