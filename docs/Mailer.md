# POST /email
## Descrição
Envia email para um político.
## Parâmetros
### from
- Tipo: String
- Obrigatório
- Formato de email
- Modo de passagem: body
### to
- Tipo: String
- Obrigatório
- Formato de email
- Modo de passagem: body
### subject
- Tipo: String
- Obrigatório
- Modo de passagem: body
### message
- Tipo: String
- Obrigatório
- Modo de passagem: body
## Respostas
### 500 - Falha no envio
### 200 - Enviado com sucesso
```js
```
## Exemplos de chamadas
- Requisição POST com body abaixo:
```js
{
	"from": "joao@email.com",
	"to": "moitaneto@hotmail.com",
	"subject": "Despesas inconsistentes",
	"message": "Tá gastando demais, meu consagrado!"
}
```
- Resposta 200 com body abaixo:
```js
{
	"accepted": [
		"moitaneto@hotmail.com"
	],
	"rejected": [],
	"envelopeTime": 363,
	"messageTime": 272,
	"messageSize": 336,
	"response": "250 Ok: queued as KfSZEeuDSYmXW5wfrFp8Eg",
	"envelope": {
		"from": "joao@email.com",
		"to": [
			"moitaneto@hotmail.com"
		]
	},
	"messageId": "<2f4f8d5c-8e35-aeae-659d-04588e2cd6a0@email.com>"
}
```