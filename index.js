const db = require('mongojs')('readinglistdb')
const ObjectId = require('mongojs').ObjectId
const { prompt } = require('inquirer')
const cTable = require('console.table')

const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'main',
      choices: ["View Books", "Add Book", "Update", "Delete Books", "Exit"],
      message: "What would you like to do?"
    }
  ])
    .then( res => {
      switch(res.name) {
        case "View Books": 
          viewBooks()
          break
        case "Add Book":
          addBook()
          break
        case "Update":
          updatebook()
          break
        case "Delete Books":
          deletebooks()
          break
        case "Exit":
          process.exit()
          break
      }
    })
    .catch( err => console.log(err))
}

const viewBooks = () => {
  db.books.find((err, books) => {
    if (err) { console.log(err) }
    console.table(books)
    mainMenu()
  })
}

const addBook = () => {
  prompt([
    {
      type: "input",
      name: 'title',
      message: "Enter book title"
    },
    {
      type: 'input',
      name: 'date',
      message: "When did you start reading this book? (MM/DD/YY)"
    },
    {
      type: 'number',
      name: 'page',
      message: "What page are you on currently?"
    }
  ])
    .then(({title, date, page}) => {
      db.books.insert({ title: `${title}`, dateStarted: `${date}`, page: `${page}`}, (err, book) => {
        if (err) { console.log(err) }
        console.table(book)
        mainMenu()
      })
    })
    .catch( err => console.log(err))
}

const updatebook = () => {
  prompt ([
    {
      type: "input",
      name: "title",
      message: "Which book would you like to update?"
    },
    {
      type: "list",
      name: "update",
      choices: ["Title", "Date Started", "Page Number"],
      message: "What would you like to update?"
    },
    {
      type: "input",
      name: "new",
      message: "What is the new info?"
    }
  ])
    .then(res => {
      switch(res.update) {
        case "Title":
          db.books.update({ title: `${res.title}`}, {$set: { title: `${res.new}`} }, (err, book) => {
            if(err) { console.log(err) }
            console.log("Changes made successfully!")
            mainMenu()
          })
          break
        case "Date Started":
          db.books.update({ title: `${res.title}` }, { $set: { dateStarted: `${res.new}` } }, (err, book) => {
            if (err) { console.log(err) }
            console.log("Changes made successfully!")
            mainMenu()
          })
          break
        case "Page Number":
          db.books.update({ title: `${res.title}` }, { $set: { page: `${res.new}` } }, (err, book) => {
            if (err) { console.log(err) }
            console.log("Changes made successfully!")
            mainMenu()
          })
          break
      }
    })
    .catch(err => console.log(err))
}

const deletebooks = () => {
  prompt([
    {
      type: "input",
      name: "title",
      choices: "What is the title of the book you want to remove?"
    }
  ])
    .then(({title}) => {
      db.books.remove({ title: `${title}`}, (err, fields) => {
        if (err) { console.log(err) }
        console.log("Removed successfully.")
        mainMenu()
      })
    })
    .catch(err => console.log(err))
}

mainMenu()