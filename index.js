require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
morgan.token('data', function (req) { return req.method === 'POST' ? JSON.stringify(req.body) : ' '})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('dist'))

// Error
const createError = (name) => {
  const error = Error()
  error.name = name
  return error
}

// Routes
app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

app.get('/info', (request, response) => {
  Person.countDocuments().then(number => {
    response.send(`<p>Phonebook has info for ${number} people</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {response.json(persons)})
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id.toString())
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  Person.find({ name: body.name }).then(person => {
    if (person.length > 0) {
      next(createError('UniqueNameError'))
    } else {
      const person = new Person ({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000)
      })

      person.save()
        .then(savedPerson => {response.json(savedPerson)})
        .catch(error => next(error))
    }
  })

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query'  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response, next) => {
  next(createError('UnknownEndpointError'))
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'UniqueNameError') {
    return response.status(400).json({ error: 'name must be unique' })
  }
  else if (error.name === 'UnknownEndpointError') {
    return response.status(404).json({ error: 'unknown endpoint' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})