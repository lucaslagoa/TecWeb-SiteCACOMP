var mongo_cliente = require('mongodb').MongoClient

mongo_cliente.connect('mongodb://localhost:27017/' , { useNewUrlParser : true }, function(err,db){
    if (err) throw err

    var dbo = db.db('CACOMP')

    dbo.collection('membros').remove({},function(err, result) {});
    dbo.collection('admin').remove({},function(err, result) {})
    dbo.collection('reclamacoes').remove({},function(err, result) {});
    dbo.collection('gasto').remove({},function(err, result) {});
    dbo.collection('projetos').remove({},function(err, result) {});
    dbo.collection('sugestoes').remove({},function(err, result) {});

    dbo.createCollection('membros',function(err,res){
        if (err) throw err
        
        var membros = [
            {nome: 'Jonas', email: 'joao@gmail.com', cargo: 'Secretario',password: '123'},
            {nome: 'Maria',email: 'maria@gmail.com', cargo:'Presidente',password: '123'},
            {nome: 'Jose', email: 'jose@gmail.com', cargo:'Tesoureiro',	password: '123'}
        ]
        


        dbo.collection('membros').insertMany(membros, function(err,res){
            if (err) throw err
            console.log("Membros inscritos!")
            db.close()
        })
    })

    dbo.createCollection('admin',function(err,res){
        if (err) throw err
        
        var admin = [
            {nome: 'Lagoa',password: '123'}
        ]
        


        dbo.collection('admin').insertMany(admin, function(err,res){
            if (err) throw err
            console.log("Admin inscritos!")
            db.close()
        })
    })    


    dbo.createCollection('reclamacoes',function(err,res){
        if (err) throw err
        
        var reclamacoes = [
            {nome: 'Madeira', materia: 'Tecnologias Web', data : '11/11/2011' , assunto: 'Trabalho muito grande!!'},
       ]
        
        dbo.collection('reclamacoes').insertMany(reclamacoes, function(err,res){
            if (err) throw err
            console.log("Reclamação inserida!")
            db.close()
        })
    })

    dbo.createCollection('gasto',function(err,res){
        if (err) throw err
        
        var gasto = [
            {nomeGasto: 'Geladeira', valorGasto: '200.00', data : '11/11/2011' , observacoes: 'Foi recebido uma geladeira doada para o CACOMP.'},
       ]
        
        dbo.collection('gasto').insertMany(gasto, function(err,res){
            if (err) throw err
            console.log("Gasto inserido!")
            db.close()
        })
    })

    dbo.createCollection('projetos',function(err,res){
        if (err) throw err
        
        var projetos = [
            {nomeProjeto: 'HackFest', dataProjeto: '11/11/2011', membro1: 'Lagoa', membro2: 'Isa', membro3: 'Barbara' , observacoes: 'O projeto consiste em um Hackfest para envolver os alunos.'},
        ]
        
        dbo.collection('projetos').insertMany(projetos, function(err,res){
            if (err) throw err
            console.log("Projeto inserido!")
            db.close()
        })
    })

    dbo.createCollection('sugestoes',function(err,res){
        if (err) throw err
        
        var sugestoes = [
            {nomeSugestao: 'Compra do PingPong.', descricaoSugestao: 'Queria sugerir a compra de um PingPong.'},
        ]
        
        dbo.collection('sugestoes').insertMany(sugestoes, function(err,res){
            if (err) throw err
            console.log("Sugestão inserida!")
            db.close()
        })
    })
} )
