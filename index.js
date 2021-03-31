const db = require('mongojs')('readinglistdb')
const ObjectId = require('mongojs').ObjectId
const { prompt } = require('inquirer')
const cTable = require('console.table')


const viewBooks = () => {
  db.books.find((err, books) => {
    if (err) { console.log(err) }
    books = books.map(({title, date, page}) => ({title, date, page}))
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
    .then(book => {
      db.books.insert((err, book) => {
        if (err) { console.log(err) }
        console.log('Book added successfully!')
        mainMenu()
      })
    })
    .catch( err => console.log(err))
}

const updatebook = () => {
  db.books.find({}, (err, books) => {
    if (err) { console.log(err) }

    prompt ([
      {
        type: "list",
        name: "_id",
        choices: books.map(({_id, title}) => ({
          name: title,
          value: _id
        })),
        message: "Select a book"
      },
      {
        type: "input",
        name: "page",
        message: "What page are you on?"
      }
    ])
      .then(({ _id, page}) => {
        db.books.update({ _id: ObjectId(_id)}, { $set: {page}}, err => {
          if (err) { console.log(err) }
          console.log("Book Successfully Updated!")
          mainMenu()
        })
      })
      .catch(err => console.log(err))
  })
}

const deletebooks = () => {
  db.books.find({}, (err, books) => {
    if (err) { console.log(err) }

    prompt([
      {
        type: "list",
        name: "_id",
        choices: books.map(({ _id, title }) => ({
          name: title,
          value: _id
        })),
        message: "Select a book"
      }
    ])
      .then(({ _id, page }) => {
        db.books.remove({ _id: ObjectId(_id) }, err => {
          if (err) { console.log(err) }
          console.log("Book Successfully Removed!")
          mainMenu()
        })
      })
      .catch(err => console.log(err))
  })
}

const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'main',
      choices: ["View Books", "Add Book", "Update", "Delete Books", "Exit"],
      message: "What would you like to do?"
    }
  ])
    .then( ({main}) => {
      switch(main) {
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
mainMenu()