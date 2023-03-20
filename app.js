// App.js

/*
    SETUP
*/
var express = require('express');                               // We are using the express library for the web server
var app     = express();                                        // We need to instantiate an express object to interact with the server in our code
PORT        = 5194;                                             // Set a port number at the top so it's easy to change in the future

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


/*
    RETRIEVE MEMBERS
*/
app.get('/members', function(req, res)
{  
    const query1 = "SELECT * FROM Members ORDER BY memberID;"                   

    db.pool.query(query1, function(error, rows, fields){    

        res.render('members', {data: rows});                  
    })                                                      
});

/*
    RETRIEVE BOOKS
*/
app.get('/books', function(req, res) {     
    const query1 = "SELECT Books.bookID, Books.title, COUNT(BookCopies.bookID) AS Total FROM Books INNER JOIN BookCopies ON Books.bookID = BookCopies.bookID GROUP BY Books.title ORDER BY Books.title;"; 
    const query2 = "SELECT * FROM Authors ORDER BY Authors.firstName, Authors.lastName;";
    const query3 = `SELECT Books.title, Authors.firstName, Authors.lastName FROM Books
    INNER JOIN BookAuthors ON Books.BookID = BookAuthors.bookID 
    INNER JOIN Authors ON BookAuthors.authorID = Authors.authorID
    ORDER BY Authors.lastName`
    db.pool.query(query1, function(error, rows, fields) {    

        // save the books
        const books = rows;

        // run the 2nd query
        db.pool.query(query2, (error, rows, fields) => {

            // save the authors
            const authors = rows;

            db.pool.query(query3, (error, rows, fields) => {

                // save the BookAuthors
                const bookAuthors = rows;
            res.render('books', {data: books, authors: authors, data2: bookAuthors});
        })                                                      
    })
})
});

/*
    ADD BOOKS
*/
app.post('/add-book-ajax', function(req, res)
{
    const data = req.body;

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
    const allBooks = `SELECT * FROM Books WHERE bookID = ?;`
  
        // Run the 1st query
        db.pool.query(queryUpdateBook, [title, bookID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(allBooks, [bookID], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } 
            else {
                res.send(rows);
            }})
        }})
});

/*
    DELETE BOOKS
*/
app.delete('/delete-book-ajax/', function(req, res){
    const data = req.body;
    const bookID = parseInt(data.bookID);
    const delete_Book = `DELETE FROM Books WHERE bookID = ?`;

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
    const query = "SELECT * FROM Authors ORDER BY Authors.firstName, Authors.lastName;";                    

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
    const data = req.body;


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
    // deleting a member must return all their books
    let updateBookStatusQuery = `UPDATE BookCopies SET bookStatus = "AVAILABLE" 
        WHERE bookCopyID IN 
        (SELECT bookCopyID FROM Checkouts 
            INNER JOIN Members ON Checkouts.memberID = Members.memberID 
            WHERE Members.memberID = ${memberID});`
  
          // Run the query
          db.pool.query(updateBookStatusQuery, function(error, rows, fields){
                if (error) {
  
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                } else {db.pool.query(deleteMemberQuery, [memberID], function(error, rows, fields){
                    if (error) {
      
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                    res.sendStatus(204);
                }
            })
        }
    }  
)});

/*
    UPDATE MEMBER 
*/
app.put('/put-member-ajax/', function(req,res,next){
    let data = req.body;

    let contactNumber = data.contactNumber;
    let currentAddress = data.currentAddress;
    let email = data.email;
    let memberID = parseInt(data.memberID);

    let queryUpdateMember = `UPDATE Members SET contactNumber = ?, currentAddress = ?, email = ? WHERE Members.memberID = ?;`;
    let allMembers = `SELECT contactNumber, currentAddress, email FROM Members WHERE Members.memberID = ?;`;

        db.pool.query(queryUpdateMember, [contactNumber, currentAddress, email, memberID], function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else{
                db.pool.query(allMembers, [memberID], function(error, rows, fields){
                    if(error){
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else {
                        res.send(rows);
                    }
                })
            }
        })
});


/*
    ADD AUTHORS (For Books Page)
*/
app.post('/add-author-multiple-ajax', function(req, res, next)
{
    const data = req.body;
    var string = '';

    if (data.firstName.length > 1) {
        for (var i = 0; i < data.firstName.length; i++) {
            string += "( '" + `${data.firstName[i]}` + "', '" + `${data.lastName[i]}` + "' )";
            if (i < data.firstName.length - 1) {
                string += ', '
            }
            if (i == data.firstName.length - 1) {
                string += ';'
            }
        }
    } else {
        string += "( '" + `${data.firstName}` + "', '" + `${data.lastName}` + "' );"
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
    ADD AUTHORS (For Author Page)
*/
app.post('/add-author-ajax', function(req, res, next)
{
    const data = req.body;

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
app.put('/put-author-ajax/', function(req, res) {
    const data = req.body;
  
    const authorID = parseInt(data.authorID);
    const authorFirstName = data.firstName;
    const authorLastName = data.lastName;
  
    const queryUpdateAuthor = `UPDATE Authors SET firstName = ?, lastName = ? WHERE authorID = ?`;
    const allAuthors = `SELECT * FROM Authors WHERE authorID = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateAuthor, [authorFirstName, authorLastName, authorID], function(error, rows, fields) {
    if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
    }
    else {
        db.pool.query(allAuthors, [authorID], function(error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }})
    }})
});

/*
    DELETE AUTHORS
*/
app.delete('/delete-author-ajax/', function(req, res){
    const data = req.body;
    const authorID = parseInt(data.authorID);
    const delete_Author = `DELETE FROM Authors WHERE authorID = ?`;

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
    RETRIEVE BOOKCOPIES
*/
app.get('/bookCopies', function(req, res)
{  
    const query1 = "SELECT BookCopies.bookCopyID, BookCopies.bookStatus, BookCopies.bookID, Books.title FROM BookCopies INNER JOIN Books ON BookCopies.bookID = Books.bookID ORDER BY Books.title, BookCopies.bookCopyID;";                 
    const query2 = "SELECT BookCopies.bookCopyID, BookCopies.bookStatus, BookCopies.bookID, Books.title FROM BookCopies INNER JOIN Books ON BookCopies.bookID = Books.bookID GROUP BY Books.title;";           

    db.pool.query(query1, function(error, rows, fields){
        
        const allBooks = rows;
        db.pool.query(query2, (error, rows, fields) => {
            const groupBooks = rows;
            res.render('bookCopies', {data: allBooks, dropdown: groupBooks});   
        })               
    })                                                      
}); 


/*
    ADD BOOK COPIES (BOOK COPIES PAGE)
*/
app.post('/add-book-copy-ajax', function(req, res)
{
    const data = req.body;
    const bookID = parseInt(data.bookID);

    query1 = `INSERT INTO BookCopies (bookID) VALUES ( ${bookID} )`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT BookCopies.bookCopyID, BookCopies.bookStatus, Books.title, Books.bookID FROM BookCopies INNER JOIN Books ON BookCopies.bookID = Books.bookID ORDER BY Books.title, BookCopies.bookCopyID;";
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
    ADD BOOK COPIES (BOOK Page)
*/
app.post('/add-book-copy-using-title', function(req, res)
{
    const data = req.body;
    const bookTitle = data.title;

    query1 = `INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = ?) );`;

    db.pool.query(query1, [bookTitle], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT BookCopies.bookCopyID, BookCopies.bookStatus, Books.title FROM BookCopies INNER JOIN Books ON BookCopies.bookID = Books.bookID ORDER BY Books.title, BookCopies.bookCopyID;";
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
    DELETE BOOK COPIES
*/
app.delete('/delete-book-copy-ajax', function(req, res){
    const data = req.body;
    const bookCopyID = parseInt(data.bookCopyID);
    const delete_Author = `DELETE FROM BookCopies WHERE bookCopyID = ?`;

        // Run the 1st query
        db.pool.query(delete_Author, [bookCopyID], function(error, rows, fields){
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
    RETRIEVE BOOKAUTHORS (FOR BOOKS Page)
*/
app.put('/book-authors', function(req, res)
{
    const data = req.body;
    const bookID = parseInt(data.bookID);
    const query1 = "SELECT Books.title AS Title, CONCAT(Authors.firstName, ' ', Authors.lastName) AS FullName FROM Books INNER JOIN BookAuthors ON Books.bookID = BookAuthors.bookID INNER JOIN Authors ON BookAuthors.authorID = Authors.authorID WHERE Books.bookID = ? ORDER BY Authors.firstName, Authors.lastName;"
    db.pool.query(query1, [bookID], function(error, rows, fields) {    
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.send(rows)
        }                
    })                                                      
});


/*
    ADD BOOKAUTHORS
*/
app.post('/add-book-authors', function(req, res){
    const data = req.body;
    const title = data.title;
    const firstName = data.firstName;
    const lastName = data.lastName;
    const authorIDTotal = data.authorID;

    var nameString = []
    var query = "INSERT INTO BookAuthors (authorID, bookID) VALUES ";

    for (var i = 0; i < firstName.length; i++) {
        nameString[i] = "( (SELECT Authors.authorID FROM Authors WHERE Authors.firstName = '";
        nameString[i] += firstName[i] + "' AND Authors.lastName = '" + lastName[i] + "' ), " + `( SELECT Books.bookID FROM Books WHERE Books.title = '${title}' ))`;
        if (i < firstName.length - 1) {
            nameString[i] += ", ";
        }
        query += nameString[i];
    }

    if (firstName.length >= 1) {
        query += ", ";
    }

    var dropDownString = []
    for (var j = 0; j < authorIDTotal.length; j++) {
        dropDownString[j] = "(" + authorIDTotal[j] + `, ( SELECT Books.bookID FROM Books WHERE Books.title = '${title}'))`;
        if (j < authorIDTotal.length - 1) {
            dropDownString[j] += ", ";
        }
        query += dropDownString[j];
    }  
    query += ";";

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(200);
        }
    })
});

/*
    GET CHECKOUTS
*/
app.get('/checkouts', function(req, res)
{
    let query1 = `SELECT checkoutID, startTime, CASE WHEN isReturned=1 THEN 'Yes' WHEN isReturned=0 THEN 'No' END AS isReturned, BookCopies.bookCopyID, Books.title, Members.memberID, Members.firstName, Members.lastName 
        FROM Checkouts 
        INNER JOIN BookCopies ON Checkouts.bookCopyID = BookCopies.bookCopyID 
        INNER JOIN Books ON BookCopies.bookID = Books.bookID 
        LEFT JOIN Members ON Checkouts.memberID = Members.memberID
        WHERE isReturned = 0
        ORDER BY startTime DESC;`
    let query2 = `SELECT checkoutID, startTime, CASE WHEN isReturned=1 THEN 'Yes' WHEN isReturned=0 THEN 'No' END AS isReturned, BookCopies.bookCopyID, Books.title, Members.memberID, Members.firstName, Members.lastName 
        FROM Checkouts 
        INNER JOIN BookCopies ON Checkouts.bookCopyID = BookCopies.bookCopyID 
        INNER JOIN Books ON BookCopies.bookID = Books.bookID 
        LEFT JOIN Members ON Checkouts.memberID = Members.memberID
        WHERE isReturned = 1
        ORDER BY startTime DESC;`
    let query3 = `SELECT checkoutID, startTime, CASE WHEN isReturned=1 THEN 'Yes' WHEN isReturned=0 THEN 'No' END AS isReturned, BookCopies.bookCopyID, Books.title, Members.memberID, Members.firstName, Members.lastName 
        FROM Checkouts 
        INNER JOIN BookCopies ON Checkouts.bookCopyID = BookCopies.bookCopyID 
        INNER JOIN Books ON BookCopies.bookID = Books.bookID 
        LEFT JOIN Members ON Checkouts.memberID = Members.memberID
        ORDER BY checkoutID ASC;`
    let query4 = "SELECT * FROM Members ORDER BY memberID;"                   


    db.pool.query(query1, function(error, rows, fields){
        const outBooks = rows;
        db.pool.query(query2, function(error, rows, fields){
            const returnedBooks = rows;
            db.pool.query(query3, function(error, rows, fields){
                const allCheckouts = rows;
                db.pool.query(query4, function(error, rows, fields){
                    const allMembers = rows
            res.render('checkouts', {data: outBooks, data2: returnedBooks, data3: allCheckouts, data4: allMembers});
            })
    
        })
    })
})
});


/*
    GET NEW CHECKOUT OPTIONS
*/

app.get('/newCheckout', function(req, res){
    
    let query1 = "SELECT bookCopyID, Books.title FROM BookCopies INNER JOIN Books ON BookCopies.bookID = Books.bookID WHERE BookCopies.bookStatus = 'AVAILABLE' ORDER BY bookCopyID;"
    let query2 = "SELECT memberID, firstName, lastName FROM Members ORDER BY lastName;"


    db.pool.query(query1, function(error, rows, fields){
        const books = rows;
        db.pool.query(query2, function(error, rows, fields){
            const members = rows

        res.render('newCheckout', {data: books, data2: members});
        })
    })
});


/*
    ADD NEW CHECKOUT (CHECK OUT BOOK)
*/

app.post('/add-checkout-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let bookCopyID = parseInt(data.bookCopyID);
    let memberID = data.memberID;
    console.log(data)

    const query1 = `INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) 
        VALUES ( (NOW()), 0, ${bookCopyID}, ${memberID})`
    


    // Create the query and run it on the database
    //query1 = `INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email) 
      //  VALUES ('${data.firstName}', '${data.lastName}', '${data.contactNumber}', '${data.currentAddress}', '${data.email}')`;
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
            const query2 = `UPDATE BookCopies
	            SET bookStatus = "CHECKED-OUT"
	            WHERE bookCopyID = ${bookCopyID};`
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well:
                else
                {
                    res.status(200);
                }
            })
        }
    })
});

/*
    RETURN BOOK 
*/
app.put('/return-book-ajax', function(req,res,next){
    let data = req.body;

    let checkoutID = parseInt(data.checkoutID);

    let returnBookQuery = `UPDATE Checkouts SET isReturned = 1 WHERE Checkouts.checkoutID = ${checkoutID};`;
    let updateBookStatusQuery = `UPDATE BookCopies SET bookStatus = "AVAILABLE" WHERE bookCopyID = (
            SELECT bookCopyID FROM Checkouts WHERE checkoutID = ${checkoutID});`
    let allBooks = `SELECT checkoutID, startTime, isReturned, BookCopies.bookCopyID, Books.title, Members.memberID, Members.firstName, Members.lastName 
        FROM Checkouts 
        INNER JOIN BookCopies ON Checkouts.bookCopyID = BookCopies.bookCopyID 
        INNER JOIN Books ON BookCopies.bookID = Books.bookID 
        INNER JOIN Members ON Checkouts.memberID = Members.memberID
        WHERE Checkouts.checkoutID = ${checkoutID};`

        db.pool.query(returnBookQuery, function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else{
                db.pool.query(updateBookStatusQuery, function(error, rows, fields){
                    if(error){
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else {
                        db.pool.query(allBooks, function(error, rows, fields){
                            if(error){
                                console.log(error);
                                res.sendStatus(400);
                            }
                            else {
                            res.send(rows);
                            }
                    })
            }})
            }
        })
});

/*
    UPDATE CHECKOUT 
*/
app.put('/put-checkout-ajax/', function(req,res,next){
    let data = req.body;
    let checkoutID = parseInt(data.checkoutID);

    if (data.memberID == 'null') {
        let nullifyQuery = `UPDATE Checkouts SET Checkouts.memberID = NULL WHERE Checkouts.checkoutID = ${checkoutID};`;
        let allCheckouts = `SELECT Checkouts.memberID, Members.firstName, Members.lastName FROM Checkouts INNER JOIN Members ON Checkouts.memberID = Members.memberID WHERE Checkouts.checkoutID = ${checkoutID};`;

        db.pool.query(nullifyQuery, function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else{
                db.pool.query(allCheckouts, function(error, rows, fields){
                    if(error){
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else {
                        res.send(rows);
                    }
                })
    }})}
    else {
        let memberID = parseInt(data.memberID);

        let queryUpdateCheckout = `UPDATE Checkouts SET memberID = ${memberID} WHERE Checkouts.checkoutID = ${checkoutID};`;
        let allCheckouts = `SELECT Checkouts.memberID, Members.firstName, Members.lastName FROM Checkouts INNER JOIN Members ON Checkouts.memberID = Members.memberID WHERE Checkouts.checkoutID = ${checkoutID};`;

            db.pool.query(queryUpdateCheckout, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    db.pool.query(allCheckouts, function(error, rows, fields){
                        if(error){
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            res.send(rows);
                        }
                    })
                }
            })
        }
});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});