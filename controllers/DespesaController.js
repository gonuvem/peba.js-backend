exports.test = async function (req, res, next) {
    const { obterDeputadosV1, obterRelatorioDePresenca } = require('../services/coletorService');
    const { getDeputadosMatriculas } =require('../services/parserService');
    const x = await obterDeputadosV1();
    const y = await getDeputadosMatriculas(x);
    //const k = await matchDeputados(y)
    const k = await obterRelatorioDePresenca(392);

    return res.send(k);
    return res.send({ message: 'Teste do controller de despesas' });
}

const Politico = require('../models/PoliticoModel');

async function matchDeputados(deputados) {
    const deputadosDB = await Politico.find({ cargo: 'Deputado Federal' });

    console.log('DB: ', deputadosDB.length, 'V1: ', deputados.length)

    const codigosDB = deputadosDB.map(d => d.codigo);
    //console.log(codigosDB)
    const codigosV1 = deputados.map(d => d.matricula).sort((a,b) => a-b);
    //console.log(codigosV1)
    //const difference = codigosDB.filter(x => !codigosV1.includes(x));

    //const erro = deputadosDB.map(codigosDB.filter(x => difference.includes(x)));

    return codigosV1
}