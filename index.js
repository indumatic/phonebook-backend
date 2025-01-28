require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} ${persons.length>1?'people':'person'}</p>
        <p>${Date()}</p>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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

    if(persons.some(person => person.name === request.body.name)) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const person = {id: Math.floor(1000 * Math.random()), ...request.body}
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {

})
