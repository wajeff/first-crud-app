const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient



MongoClient.connect('mongodb+srv://wajeff:2rWrKkyFjpqCiRpl@cluster0.bzh5no8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useUnifiedTopology: true })
  .then(client => {
    
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote
            }
          },
          {
            upsert: true
          }
        )
          .then(result => res.json('Success'))
          .catch(error => console.error(error))
      })
  
    app.listen(3000, function(){
        console.log('listening on 3000')
    })

    app.get('/', (req, res) => {
        db.collection('quotes')
            .find()
            .toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results })
            })
            .catch(/* ... */)
      })
    app.post('/quotes', (req,res)=>{
        quotesCollection
        .insertOne(req.body)
        .then(result=>{
            res.redirect('/')
        })
        .catch(error=>console.error(error))
            console.log('req.body')
        })
    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })
  })
  .catch(error => console.error(error))