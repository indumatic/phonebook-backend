const express = require('express')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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

app.use(express.json())
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

const PORT = 3001
app.listen(PORT, () => {

})
