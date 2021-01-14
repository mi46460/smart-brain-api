const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

 const db = knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'smart-brain'
}});

db.select('*').from('users').then(data => {
    console.log(data);
});;

const app = express();

app.use(bodyParser.json());
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            name:'john',
            has: '',
            email: 'john@gmail.com'
        }
    ]
}

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res)=>{
    res.send(database.users);
})

app.post('/signin', (req, res) =>{
   db.select('email','hash').from('login')
   .where('email', '=', req.body.email)
   .then(data => {
       const isValid = bycrpt.compareSync(req.body.password, data[0].hash);
       if (isValid){
           return db.select('*').from('users')
             .where('email', '=', req.body.email)
             .then(user => {
                 res.json(user[0])
             })
             .catch(err =>res.status(400).json('unable to get user'))
       } else{
        res.status(400).json('wrong credentials')
       }
   })
   applicationCache(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res)=>{
    const { email, name, password } = req.body;
    const has = bycrpt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        into('login')
        .returning('email')
        .ehrn(loginemail =>{
            return trx('users')
            .returning('*')
            .insert({
            email: email,
            name: name,
            joined: new Date()
        })
            .then(user => {
                res.json(user[0]);
            })
        })    
    })
     .then(trx.commit)
     .catch(trx.rollbacck)  
})

app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({id})
    .then(user => {
        console.log(user)
        if (user.length){
            console.log(user[0])
        }
    })
    .catch(err => res.status(400).json('Not Found'))
    if(!found){
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .ccatch(err => res.status(400).json('unable to get entries'))
})


/**/



app.listen(3000, ()=>{
    console.log('app is running on port 3000');
})
/*
 
*/