import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message}) => {
  const notificationStyle = {
      color: message.success ? 'green' : "red",
      background: 'lightgrey',
      fontSize: 16,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
  }

  if (message.text === null) {
    return <div></div>
  }

  return (
    <div style={notificationStyle}>
      {message.text}
    </div>
  )
}

const Filter = ({text, value, handleChange}) => (
  <div>{text} <input value={value} onChange={handleChange} /></div>
)

const PersonForm = (props) => (
    <form onSubmit={props.addClick}>
      <div>name: <input value={props.nameValue} onChange={props.handleNameChange} /></div>
      <div>number: <input value={props.numberValue} onChange={props.handleNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
)
const Persons = ({persons, handleDelete}) => {
  return (
    persons.map(person => {
      return <Person key={person.name} person={person} handleClick={handleDelete} />
    })
  )
}

const Person = ({person, handleClick}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => handleClick(person)}>delete</button>
    </div>
  )
}


const App = () => {
  
  // States
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState({text: null, success: null})

  // Init
  useEffect(() => {       
    personService
      .getAll()        
      .then(initialPersons => setPersons(initialPersons))  
  }, [])  

  // Notification
  const notify = (message, success) => {
    setInfoMessage({text: message, success: success})        
    setTimeout(() => {          
      setInfoMessage({text: null, success: null})        
    }, 3000)
  }

  // Add
  const addName = (event) => {
    event.preventDefault()
    const found = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
    found === undefined ? notExists() : exists(found)
  }
  // Update or addition
  const notExists = () => {
    const personObject = {name : newName, number: newNumber}
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        clearForm()
      })
      .then(notify(`Added ${newName}`, true))
      .catch(error => notify(error.response.data.error, false))
  }
  
  const exists = (person) => {
    const personObject = {...person, number: newNumber}
    confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) &&
    personService
      .update(personObject)
      .then(updatedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
        clearForm()
      })
      .then(notify(`Updated ${newName}`, true))
      .catch(error => notify(error.response.data.error, false))
  }
  
  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  // Delete
  const deleteName = (person) => {
    confirm(`Poistetaanko ${person.name}?`) &&
    personService
      .remove(person.id)
      .then(() => {setPersons(persons.filter(p => p.id !== person.id ))})
      .then(notify(`Deleted ${person.name}`, true))
      .catch(error => notify(`Information of ${person.name} has already been removed from server`, false))
  }

  // Event handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewFilter(event.target.value)
  
  // Filter
  const personsToShow = () => persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage}/>
      <Filter text="filter shown with" value={newFilter} handleChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm addClick={addName} nameValue={newName} numberValue={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow()} handleDelete={deleteName} />
    </div>
  )

}

export default App