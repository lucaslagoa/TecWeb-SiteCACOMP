var mongo_cliente = require('mongodb').MongoClient

mongo_cliente.connect('mongodb://localhost:27017/' , { useNewUrlParser : true }, function(err,db){
    if (err) throw err

    var dbo = db.db('CACOMP')

    dbo.createCollection('membros',function(err,res){
        if (err) throw err
        
        var membros = [
            {nome: 'Joao', email: 'joao@gmail.com', cargo: 'Secretario'},
            {nome: 'Maria',email: 'maria@gmail.com', cargo:'Presidente'},
            {nome: 'Jose', email: 'jose@gmail.com', cargo:'Tesoureiro'}
        ]
        


        dbo.collection('membros').insertMany(membros, function(err,res){
            if (err) throw err
            console.log("Membros inscritos!")
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
