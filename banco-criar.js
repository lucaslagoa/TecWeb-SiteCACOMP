var mongo_cliente = require('mongodb').MongoClient

mongo_cliente.connect('mongodb://localhost:27017/CACOMP', { useNewUrlParser : true } ,
    function (err,db){
        if(err) throw err
        console.log("Banco de Dados CACOMP criado!")
        db.close()
})