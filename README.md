=====
PEBA.JS
=====

PEBA é um projeto Open Source idealizado pelo Teresina Hacker Clube e que está sendo mantido atualmente pela [GoNuvem](http://sitegonuvem.herokuapp.com/). Ele é um indexador de dados públicos, no qual você eleitor, pode buscar por informações sobre políticos. Com isso esperamos que você consiga acompanhar e que te ajude a entender como nossos impostos estão sendo gastos pela classe política.

---
Softwares utilizados
---

* Node.js
* MongoDB

---
Como executar?
---

**Via Docker**

Antes de mais nada, tenha certeza de que tenha `docker` e `docker-compose` instalado.

1. Execute:

    ```
    $ docker-compose up
    ```

2. Faça um teste. [Mostra a mensagem "Teste do controller de deputados"](http://localhost:8080/deputados)

3. Popule o banco de dados.
	1. Opção 1 - Execute uma única task, mais longa
		```
		$ docker exec -e MONGODB_URI=mongodb://db:27017/peba -it peba_api node tasks/updateDBJob.js
		```
	2. Opção 2 - Execute as tasks separadamente, nessa ordem
	- Obter as informações dos políticos
		```
		$ docker exec -e MONGODB_URI=mongodb://db:27017/peba -it peba_api node tasks/updatePoliticiansJob.js
		```
	- Obter as despesas de todos os políticos
		```
		$ docker exec -e MONGODB_URI=mongodb://db:27017/peba -it peba_api node tasks/updateExpensesJob.js
		```
	- Calcular o total de despesas de cada político
		```
		$ docker exec -e MONGODB_URI=mongodb://db:27017/peba -it peba_api node tasks/updateTotalExpenditureJob.js
		```
	- Obter a frequência dos políticos
		```
		$ docker exec -e MONGODB_URI=mongodb://db:27017/peba -it peba_api node tasks/updateFrequenciesJob.js
		```

---
Como colaborar?
---
Você pode nos ajudar abrindo issues através do github reportando bugs e nos enviando sugestões. Aos que desejam colaborar com código, peço que enviem Pull Requests.

---
Onde nos encontrar?
---

Nos envie um email: contato@gonuvem.com
