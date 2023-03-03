// App.js

/*
    SETUP
*/
var express = require('express');                               // We are using the express library for the web server
var app     = express();                                        // We need to instantiate an express object to interact with the server in our code
PORT        = 9594;                                             // Set a port number at the top so it's easy to change in the future

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

var handlebars = require('handlebars');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');                     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));                  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/* 
    HANDLEBARS HELPER FUNCTIONS
*/

handlebars.registerHelper('counter', function(index){
    return index + 1;
});

/*
    DATABASE
*/

var db = require('./database/db-connector')

/*
    ROUTES
*/

app.get('/', function(req, res)
{                                                               // Render the index.hbs file, and also send the renderer
    res.render('index');                                        // an object where 'data' is equal to the 'rows' we                                                 
});                                                             // received back from the query                                            

app.get('/bookCopies', function(req, res)
{  
    let query1 = "SELECT * FROM BookCopies ORDER BY BookCopies.bookID;"                   

    db.pool.query(query1, function(error, rows, fields){    

        res.render('bookCopies', {data: rows});                  
    })                                                      
}); 

/*
    RETRIEVE MEMBERS
*/

app.get('/members', function(req, res)
{  
    let query1 = "SELECT * FROM Members ORDER BY memberID;"                   

    db.pool.query(query1, function(error, rows, fields){    

        res.render('members', {data: rows});                  
    })                                                      
});

/*
    RETRIEVE BOOKS
*/
app.get('/books', function(req, res)
{  
    const query1 = "SELECT * FROM Books ORDER BY Books.title"; 

    const query2 = "SELECT * FROM Authors ORDER BY Authors.firstName, Authors.lastName;";

    db.pool.query(query1, function(error, rows, fields) {    

        // save the books
        const books = rows;

        // run the 2nd query
        db.pool.query(query2, (error, rows, fields) => {

            // save the authors
            const authors = rows;
            return res.render('books', {data: books, authors: authors});
        })                
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
            query2 = `SELECT * FROM Books ORDER BY Books.title;`;
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
    UPDATE BOOKS
*/

app.put('/put-book-ajax/', function(req, res){
    const data = req.body;
  
    const bookID = parseInt(data.bookID);
    const title = data.title;
  
    const queryUpdateBook = `UPDATE Books SET title = ? WHERE bookID = ?`;
  
        // Run the 1st query
        db.pool.query(queryUpdateBook, [title, bookID], function(error, rows, fields){
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
    DELETE BOOKS
*/

app.delete('/delete-book-ajax/', function(req, res){
    let data = req.body;
    let bookID = parseInt(data.bookID);
    let delete_Book = `DELETE FROM Books WHERE bookID = ?`;

        // Run the 1st query
        db.pool.query(delete_Book, [bookID], function(error, rows, fields){
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
    RETRIEVE AUTHORS
*/
app.get('/authors', function(req, res)
{  
    let query = "SELECT * FROM Authors ORDER BY Authors.firstName, Authors.lastName;";                    

    db.pool.query(query, function(error, rows, fields){    

        res.render('authors', {data: rows});                  
    })                                                      
}); 

/*
    ADD MEMBERS
*/

app.post('/add-member-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email) 
        VALUES ('${data.firstName}', '${data.lastName}', '${data.contactNumber}', '${data.currentAddress}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Members
            query2 = `SELECT * FROM Members ORDER BY memberID;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    DELETE MEMBER
*/

app.delete('/delete-member-ajax/', function(req, res, next){
    let data = req.body;
    let memberID = parseInt(data.id);
    let deleteMemberQuery = `DELETE FROM Members WHERE memberID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteMemberQuery, [memberID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } 
              else
        {
            // If there was no error, perform a SELECT * on Members
            query2 = `SELECT * FROM Members ORDER BY memberID;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
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
    const data = req.body;
    var string = '';
    
    for (var i = 0; i < data.firstName.length; i++) {
        string += "( '" + `${data.firstName[i]}` + "', '" + `${data.lastName[i]}` + "' )";
        if (i < data.firstName.length - 1) {
            string += ', '
        }
        if (i == data.firstName.length - 1) {
            string += ';'
        }
    }

    query1 = `INSERT INTO Authors (firstName, lastName) VALUES ${string}`;

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