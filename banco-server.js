var express = require('express')
var app = express()
var body_parser = require('body-parser')
var cors = require('cors')
app.use(cors())


app.use(body_parser.urlencoded({
    extended: true
}))

app.use(body_parser.json())

app.use(express.static('public'))

var jwt = require('jsonwebtoken');

var mongo_cliente = require('mongodb').MongoClient
var dbo


app.post('/login', function(req, res) {
    var user = req.body;

    dbo.collection('membros').findOne({ nome: user.nome }, function(err, membros) {
        if (err) return res.status(500).send();

        if (!membros) {
            dbo.collection('admin').findOne({ nome: user.nome }, function(err, admin) {
                if (!admin) return res.status(404).send();

                if ( admin.password == user.password ) {
                    var token = jwt.sign({ id: admin._id }, 'supersecret', {
                        expiresIn: 86400
                    });

                    res.status(200);
                    res.send({ token: token, tipo: 'admin' });
                } else {
                    return res.status(401).send({ token: null, tipo: null });
                }
            });
        } else {
            if ( membros.password == user.password ) {
                var token = jwt.sign({ id: membros._id }, 'supersecret', {
                    expiresIn: 86400
                });

                res.status(200);
                res.send({ token: token, tipo: 'membros' });
            } else {
                return res.status(401).send({ token: null, tipo: null });
            }
        }
    });
});

function verificaToken(req, res, next) {

    var token = req.headers['x-access-token'];

    if (!token)
        return res.status(403).send({ auth: false, message: 'Nenhum token disponvível.' });

    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Erro de autenticação.' });

        req.userId = decoded.id;
        next();
    });
}

app.get('/membros', function(req,res){
    dbo.collection('membros').find().toArray(function(err,membros){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(membros))
    })
})

app.get('/reclamacoes', function(req,res){
    dbo.collection('reclamacoes').find().toArray(function(err,reclamacoes){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(reclamacoes))
    })
})

app.get('/gasto', function(req,res){
    dbo.collection('gasto').find().toArray(function(err,gasto){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(gasto))
    })
})

app.get('/projetos', function(req,res){
    dbo.collection('projetos').find().toArray(function(err,projetos){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(projetos))
    })
})

app.get('/sugestoes', function(req,res){
    dbo.collection('sugestoes').find().toArray(function(err,sugestoes){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(sugestoes))
    })
})

app.post('/membros',function(req,res){
    var membros = req.body;

    dbo.collection('membros').insertOne(membros, function(err,result){
        if (err){
            res.status(409)
            res.send("Membro já cadastrado!")
            return 
        }
        res.status(200)
        res.send("Membro adicionado com sucesso!")
    })
})

app.post('/reclamacoes',function(req,res){
    var reclamacoes = req.body;

    dbo.collection('reclamacoes').insertOne(reclamacoes, function(err,result){
        if (err) throw console.log(err)

        res.status(200)
        res.send("Reclamação adicionada com sucesso!")
    })
})

app.post('/gasto',function(req,res){
    var gasto = req.body;

    dbo.collection('gasto').insertOne(gasto, function(err,result){
        if (err) throw console.log(err)

        res.status(200)
        res.send("Gasto adicionado com sucesso!")
    })
})

app.post('/projetos',function(req,res){
    var projetos = req.body;
    dbo.collection('projetos').insertOne(projetos, function(err,result){
        if (err){
            res.status(409)
            res.send("Projeto já cadastrado!")
            return 
        }
        res.status(200)
        res.send("Projeto adicionado com sucesso!")
    })
})

app.post('/sugestoes',function(req,res){
    var sugestoes = req.body;
    dbo.collection('sugestoes').insertOne(sugestoes, function(err,result){
        if (err) throw console.log(err)
        res.status(200)
        res.send("Sugestão adicionada com sucesso!")
    })
})


app.delete('/membros', function(req,res){
    dbo.collection('membros').remove({},function(err,result){
        res.status(204)
        res.send("Membros removidos!")
    })
})

app.delete('/reclamacoes', function(req,res){
    dbo.collection('reclamacoes').remove({},function(err,result){
        res.status(204)
        res.send("Reclamações removidos!")
    })
})

app.delete('/gasto', function(req,res){
    dbo.collection('gasto').remove({},function(err,result){
        res.status(204)
        res.send("Gastos removidos!")
    })
})

app.delete('/projetos', function(req,res){
    dbo.collection('projetos').remove({},function(err,result){
        res.status(204)
        res.send("Projetos removidos!")
    })
})

app.delete('/sugestoes', function(req,res){
    dbo.collection('sugestoes').remove({},function(err,result){
        res.status(204)
        res.send("Sugestões removidos!")
    })
})

//deletar membro por Nome

app.delete('/membros/nome', function(req,res){
    var nome_membro = req.query.eq

    var id = {nome: nome_membro}

    dbo.collection('membros').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Membro removido com sucesso!")
    })
})

//deletar membro por cargo

app.delete('/membros/cargo', function(req,res){
    var nome_cargo = req.query.eq

    var id = {cargo: nome_cargo}

    dbo.collection('membros').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Membro removido com sucesso!")
    })
})

//deletar reclamação por nome

app.delete('/reclamacoes/nome', function(req,res){
    var nome_reclamacao = req.query.eq

    var id = {nome: nome_reclamacao}

    dbo.collection('reclamacoes').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Reclamação removida com sucesso!")
    })
})

//deletar reclamação por matéria

app.delete('/reclamacoes/materia', function(req,res){
    var nome_materia = req.query.eq

    var id = {materia: nome_materia}

    dbo.collection('reclamacoes').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Reclamação removida com sucesso!")
    })
})

//remover gasto por nome 

app.delete('/gasto/nome', function(req,res){
    var nome_gasto = req.query.eq

    var id = {nomeGasto: nome_gasto}

    dbo.collection('gasto').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Gasto removido com sucesso!")
    })
})

//remover projeto por nome 

app.delete('/projetos/nome', function(req,res){
    var nome_projeto = req.query.eq

    var id = {nomeProjeto: nome_projeto}

    dbo.collection('projetos').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Projeto removido com sucesso!")
    })
})

//remover sugestão por nome

app.delete('/sugestoes/nome', function(req,res){
    var nome_sugestao = req.query.eq

    var id = {nomeSugestao: nome_sugestao}

    dbo.collection('sugestoes').deleteOne(id,function(err,result){
        res.status(204)
        res.send("Sugestão removida com sucesso!")
    })
})


app.put("/membros", function (req,res){
    var membros = req.body
    delete membros._id;
    var id = { nome: membros.nome };

    dbo.collection('membros').updateOne(id, {$set : membros}, function(err,result){
        if(err) return console.log(err)

        res.status(200)
        res.send('Membro ' + membros.nome + ' alterado com sucesso!')
    })
})

app.put("/reclamacoes", function (req,res){
    var reclamacoes = req.body
    delete reclamacoes._id;
    var id = { nome: reclamacoes.nome };

    dbo.collection('reclamacoes').updateOne(id, {$set : reclamacoes}, function(err,result){
        if(err) return console.log(err)

        res.status(200)
        res.send('Reclamação ' + reclamacoes.nome + ' alterada com sucesso!')
    })
})

app.put("/gasto", function (req,res){
    var gasto = req.body
    delete gasto._id;
    var id = { nomeGasto: gasto.nomeGasto };

    dbo.collection('gasto').updateOne(id, {$set : gasto}, function(err,result){
        if(err) return console.log(err)

        res.status(200)
        res.send('Gasto ' + gasto.nomeGasto + ' alterado com sucesso!')
    })
})

app.put("/projetos", function (req,res){
    var projetos = req.body
    delete projetos._id;
    var id = { nomeProjeto: projetos.nomeProjeto };

    dbo.collection('projetos').updateOne(id, {$set : projetos}, function(err,result){
        if(err) return console.log(err)

        res.status(200)
        res.send('Projeto ' + projetos.nomeProjeto + ' alterado com sucesso!')
    })
})

app.put("/sugestoes", function (req,res){
    var sugestoes = req.body
    delete sugestoes._id;
    var id = { nomeSugestao: sugestoes.nomeSugestao };

    dbo.collection('sugestoes').updateOne(id, {$set : sugestoes}, function(err,result){
        if(err) return console.log(err)

        res.status(200)
        res.send('Sugestão ' + sugestoes.nomeSugestao + ' alterado com sucesso!')
    })
})

//pesquisar membro por nome e saber suas infos. 

app.get('/membro/:id', function(req,res){

    var nome_membro = req.query.eq

    var nome = {nome: nome_membro}
    
    dbo.collection('membros').find(nome).toArray(function(err,membros){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(membros))
    })
})

//pesquisar membro por cargo

app.get('/membros/cargo', function(req,res){

    var cargo_membro = req.query.eq

    var cargo = {cargo: cargo_membro}
    
    dbo.collection('membros').find(cargo).toArray(function(err,membros){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(membros))
    })
})

//pesquisar reclamação por nome

app.get('/reclamacoes/:id', function(req,res){

    var nome_reclamacao = req.query.eq

    var nome = {nome: nome_reclamacao}
    
    dbo.collection('reclamacoes').find(nome).toArray(function(err,reclamacoes){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(reclamacoes))
    })
})

//pesquisar reclamações por matéria

app.get('/reclamacoes/materia', function(req,res){

    var nome_materia = req.query.eq

    var materia = {materia: nome_materia}
    
    dbo.collection('reclamacoes').find(materia).toArray(function(err,reclamacoes){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(reclamacoes))
    })
})

//pesquisar gasto por nome

app.get('/gasto/nome', function(req,res){

    var nome_gasto = req.query.eq

    var nomeGasto = {nomeGasto: nome_gasto}
    
    dbo.collection('gasto').find(nomeGasto).toArray(function(err,gasto){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(gasto))
    })
})

//pesquisar gasto por valor 


app.get('/gasto/valor', function(req,res){

    var valor_gasto = req.query.eq

    var valorGasto = {valorGasto: {$eq : valor_gasto}}
    
    dbo.collection('gasto').find(valorGasto).toArray(function(err,gasto){
            res.setHeader('Content-Type','application/json')
            res.status(200)
            res.send(JSON.stringify(gasto))
    })
   
})

//pesquisar projeto por nome

app.get('/projetos/nome', function(req,res){

    var nome_projeto = req.query.eq

    var nomeProjeto = {nomeProjeto: nome_projeto}
    
    dbo.collection('projetos').find(nomeProjeto).toArray(function(err,projetos){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(projetos))
    })
})

//pesquisar projeto por membro envolvido 

app.get('/projetos/membros', function(req,res){

    var nome_membros = req.query.eq

    dbo.collection('projetos').find().toArray(function(err,projetos){
        projetosMembro = []
        for(var i=0;i<projetos.length;i++){
            if((projetos[i].membro1 == nome_membros) || (projetos[i].membro2 == nome_membros) || (projetos[i].membro3 == nome_membros)){
                projetosMembro.push(projetos[i])
            }
        }
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(projetosMembro))
    })
})

//pesquisar sugestão por nome 

app.get('/sugestoes/nome', function(req,res){

    var nome_sugestao = req.query.eq

    var nomeSugestao = {nomeSugestao: nome_sugestao}
    
    dbo.collection('sugestoes').find(nomeSugestao).toArray(function(err,sugestoes){
        res.setHeader('Content-Type','application/json')
        res.status(200)
        res.send(JSON.stringify(sugestoes))
    })
})

mongo_cliente.connect('mongodb://localhost:27017/' , { useNewUrlParser : true }, function(err,db){
    if (err) throw err
    dbo = db.db('CACOMP')

    app.listen(3000,function(){
        console.log('Funcionando...')
    })
})
