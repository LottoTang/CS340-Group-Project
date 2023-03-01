// App.js

/*
    SETUP
*/
var express = require('express');                               // We are using the express library for the web server
var app     = express();                                        // We need to instantiate an express object to interact with the server in our code
PORT        = 9124;                                             // Set a port number at the top so it's easy to change in the future

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');                     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));                  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    DATABASE
*/

var db = require('./database/db-connector')


/*
    ROUTES
*/

app.get('/', function(req, res)
    {                                                           // Render the index.hbs file, and also send the renderer
        res.render('index');                                    // an object where 'data' is equal to the 'rows' we                                                 
    });                                                         // received back from the query                                            

app.get('/books', function(req, res)
{  
    let query1 = "SELECT * FROM Books ORDER BY Books.bookID;";                    

    db.pool.query(query1, function(error, rows, fields){    

        res.render('books', {data: rows});                  
    })                                                      
}); 

app.get('/bookCopies', function(req, res)
{  
    let query1 = "SELECT * FROM BookCopies ORDER BY BookCopies.bookID;"                   

    db.pool.query(query1, function(error, rows, fields){    

        res.render('bookCopies', {data: rows});                  
    })                                                      
}); 

app.get('/authors', function(req, res)
{  
    let query1 = "SELECT * FROM Authors ORDER BY Authors.authorID;";                    

    db.pool.query(query1, function(error, rows, fields){    

        res.render('authors', {data: rows});                  
    })                                                      
}); 

/*
    ADD BOOKS
*/

app.post('/add-book-ajax', function(req, res)
{
    let data = req.body;

    query1 = `INSERT INTO Books (title) VALUES ('${data.title}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Books ORDER BY Books.bookID;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    ADD AUTHORS
*/

app.post('/add-author-ajax', function(req, res, next)
{
    let data = req.body;

    query1 = `INSERT INTO Authors (firstName, lastName) VALUES ('${data.firstName}', '${data.lastName}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Authors ORDER BY Authors.authorID;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    UPDATE AUTHORS
*/

app.put('/put-author-ajax/', function(req, res){
    const data = req.body;
  
    const authodID = parseInt(data.authorID);
    const authorFirstName = data.firstName;
    const authorLastName = data.lastName;
  
    const queryUpdateAuthor = `UPDATE Authors SET firstName = ?, lastName = ? WHERE authorID = ?`;
  
        // Run the 1st query
        db.pool.query(queryUpdateAuthor, [authorFirstName, authorLastName, authodID], function(error, rows, fields){
        if (error) {
  
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        } })
});


/*
    DELETE AUTHORS
*/

app.delete('/delete-author-ajax/', function(req, res){
    let data = req.body;
    let authorID = parseInt(data.authorID);
    let delete_Author = `DELETE FROM Authors WHERE authorID = ?`;

        // Run the 1st query
        db.pool.query(delete_Author, [authorID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }})
});


/*
    ADD BOOK COPY
*/

app.post('/add-bookCopies-ajax', function(req, res)
{
    let data = req.body;

    query1 = `INSERT INTO BookCopies (bookID) VALUES ((SELECT Books.bookID FROM Books WHERE Books.title = '${data.title}'))`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM BookCopies ORDER BY BookCopies.bookID;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});