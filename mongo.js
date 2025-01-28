const mongoose = require('mongoose')

//get password from env
const password = process.env.PASSWORD 
const url = 
    `mongodb+srv://fullstack:${password}@cluster0.dsknzto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 2) {
    Person
        .find({})
        .then(result => {            
            console.log('phonebook:')
            result.forEach(person => 
                console.log(`${person.name} ${person.number}`))
        })
        .then(() => mongoose.connection.close())
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