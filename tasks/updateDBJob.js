const { updateTask } = require('./scheduler');

updateTask()
.then(console.log('Tarefa realizada com sucesso'))
.catch(error => console.log(error));