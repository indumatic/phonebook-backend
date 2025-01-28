require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

//custom token for body
morgan.token('body', (req, res) => JSON.stringify(req.body))
morgan.format('myFormat',(tokens, req, res) => [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.method(req, res) === 'POST' ? tokens.body(req,res) : null //show body just if POST request
    ].join(' ')
)

app.use(express.json())
app.use(morgan('myFormat'))
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(result => 
            response.json(result)
        )    
})

app.get('/info', (request, response) => {
    Person
        .find({})
        .then(result => 
            response.send(`
                <p>Phonebook has info for ${result.length} ${result.length>1?'people':'person'}</p>
                <p>${Date()}</p>
                `)
        )    
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(result => {
            if(result) {
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .deleteOne({_id: request.params.id})
        .then(() => 
            response.status(204).end()
        )
})

app.post('/api/persons', (request, response) => {

    if(!request.body.name) {
        return response.status(404).json({
            error: 'name missing'
        })
    }

    if(!request.body.number) {
        return response.status(404).json({
            error: 'number missing'
        })
    }

    Person.find({}).then((persons) => {
        if(persons.some(person => person.name === request.body.name)) {
            return response.status(404).json({
                error: 'name must be unique'
            })
        }
    
        new Person({
            name: request.body.name,
            number: request.body.number 
        })
            .save()
            .then(result =>
                response.json(result)
            )
    })
})

app.put('/api/persons/:id', (request, response) => {
    Person
        .findOneAndUpdate({_id: request.params.id},{number: request.body.number})
        .then(result => response.json({number: request.body.number, ...result}))
})

const PORT = process.env.PORT
app.listen(PORT, () => {

})
