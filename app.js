const express = require('express')
const hbs = require('hbs')
const path = require('path')
require("./db");
const errorHandler = require('./middlewares/error')
const app = express()

const PORT = process.env.PORT || 4500

const static_path = path.join("/workspaces/movie-rental-app/public")
const template_path = "/workspaces/movie-rental-app/templates/views"
const partial_path = "/workspaces/movie-rental-app/templates/partials"

const registers = require('./routes/registerRoute');
const login = require('./routes/loginRoute');
const genres = require('./routes/genreRoute')
const movies = require('./routes/movieRoute')
const rentals = require('./routes/rentalRoute')

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.use(errorHandler)

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


app.use('/register', registers)
app.use('/login', login)
app.use('/genre', genres)
app.use('/movie', movies)
app.use('/rental', rentals)


app.listen(PORT, () => {
    console.log('LIstening on port ', `http://localhost:${PORT}`)
})