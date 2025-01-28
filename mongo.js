require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

let people = [
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

if(process.argv.length === 2) {
    Person
        .find({})
        .then(result => {            
            console.log('phonebook:')
            result.forEach(person => 
                console.log(`${person.name} ${person.number}`))
        })
        .then(() => mongoose.connection.close())
} else if (process.argv.length === 3) {
    switch (process.argv[2]) {
        case 'reset':
            Person
                .deleteMany({})
                .then(() => console.log('collection removed'))
                .then(() => mongoose.connection.close())
            break
        case 'init':
            Promise.all(
                people
                    .map(({id, ...person}) =>
                        person
                    )
                    .map(person =>
                        new Person(person)
                    )
                    .map((person,index) =>
                        person
                            .save()
                            .then(() => console.log(`person ${index} saved!`))
                    )
            )
            .then(() => {
                mongoose.connection.close()
            })
            .then(() => console.log('connection closed'))
            break

    }
} else if (process.argv.length === 4) {
    new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
        .save()
        .then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)            
        })
        .then(() => mongoose.connection.close())
}