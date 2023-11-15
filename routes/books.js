var express = require('express');
var router = express.Router();
const Book  = require('../models').Book;
var { sequelize } = require('../models');
var createError = require('http-errors');

/* Redirect home to /books route */
// router.get('/', function(req, res, next) {
//   res.redirect('/books');
// });

/* GET books listing. */
router.get('/', async function(req, res, next) {
  try {
    const books = await Book.findAll();
    // res.json(books);
    res.render('index', { books: books }); 
  } catch (error) {
    next(error);
  }
});

/* GET the form for creating a new book. */
router.get('/new', function(req, res, next) {
  res.render('new-book'); 
});

/* POST a new book to the database. */
router.post('/new', async function(req, res, next) {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      res.render('new-book', {
        book: Book.build(req.body),
        errors: error.errors
      });
    } else {
      next(error);
    }
  }
});

/* GET individual book details. */
router.get('/:id', async function(req, res, next) {
  try {
    console.log(req.params.id)
    const book = await Book.findByPk(req.params.id);
    console.log(book)
    if (book) {
      res.render('update-book', { book, title: book.title }); 
    } else {
      next(createError(404));
    }
  } catch (error) {
    next(error);
  }
});

/* POST update to a book. */
router.post('/:id', async function(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      next(createError(404));
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const book = await Book.build(req.body);
      book.id = req.params.id; 
      res.render('update-book', {
        book: book,
        errors: error.errors
      });
    } else {
      next(error);
    }
  }
});

/* POST delete a book. */
router.post('/:id/delete', async function(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      next(createError(404));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
