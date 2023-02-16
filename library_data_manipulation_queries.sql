-- All Database Manipulationn Queries that we will use in our project website.
-- The queries are separated by page

-- BOOKS page
-- display all Books of the library
SELECT Books.bookID AS ID, Books.bookTitle AS Title FROM Books;

-- add a book
INSERT INTO Books (Books.bookTitle) VALUES (:bookTitleInput);

-- edit a book
-- for better user experience -> show all the book id and the title for choosing as topdown list
SELECT Books.bookID, Books.title FROM Books ORDER BY Books.bookID

-- after choosing from the topdown list, the value bookID is passed to here for update
UPDATE Books SET Books.bookTitle = :bookTitleInput WHERE Books.bookID = :update_Books.bookID;

-- delete a book
DELETE FROM Books WHERE Books.bookID = :delete_Books_bookID;

-- AUTHOR page
-- display all Authors (those books that are in stock in the library)
SELECT Authors.authorID AS ID, Authors.firstName AS "First Name", Authors.lastName AS "Last Name" FROM Authors
ORDER BY Authors.authorID;

-- add an author
INSERT INTO Authors (Authors.firstName, lAuthors.astName) VALUES (:firstNameInput, :lastNameInput);

-- edit an author
UPDATE Authors SET Authors.firstName = :firstNameInput, Authors.lastName = :lastNameInput WHERE authorID =: update_Authors_authorID;

-- delete an author
DELETE FROM Authors WHERE Authors.authorID = :delete_Authors_authorID;

-- MEMBERS page
-- display all Members of the library
SELECT memberID AS ID, CONCAT(firstName, ' ', lastName) AS "Name", contactNumber AS "Contact Number", currentAddress AS "Current Address", email AS "Email" FROM Members

-- add a Member
INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email)
VALUES (:firstNameInput, :lastNameInput, :contactNumberInput, :currentAddressInput, :emailInput)

-- edit a Member
UPDATE Members SET firstName = :firstNameInput, lastName = :lastNameInput, contactNumber = :contactNumberInput, currentAddress = :currentAddressInput, email = :emailInput WHERE memberID = :update_Member_Member_ID

-- delete a Member
DELETE FROM Members WHERE memberID = :delete_member_memberID

-- BOOK COPIES page
-- display all book copies
SELECT BookCopies.bookCopyID AS "Book Copy ID", BookCopies.bookID AS "Book ID", Books.title AS "Book Title", BookCopies.bookStatus AS "Book Status" FROM BookCopies
INNER JOIN Books ON BookCopies.bookID = Books.bookID
ORDER BY BookCopies.bookID

-- add a book copy
-- for better user experience -> show all the book id and the title for choosing as topdown list
SELECT Books.bookID, Books.title FROM Books ORDER BY Books.bookID

-- after choosing from the topdown list, the value bookID is passed to here for insert
INSERT INTO BookCopies (BookCopies.bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = :bookTitleInput) );

-- delete a book copy
DELETE FROM BookCopies WHERE BookCopies.bookCopyID = :delete_BookCopies_bookCopyID;

-- search function for finding book copies
SELECT BookCopies.BookCopyID AS "Book Copy ID", BookCopies.bookID AS "Book ID", Books.title AS "Book Title", BookCopies.bookStatus AS "Book Status" FROM BookCopies
INNER JOIN Books ON BookCopies.bookID = Books.bookID
AND Books.title like '%:inputKeyWord%';

-- CHECKOUTS page
-- display all checkouts
-- note: we aren't displaying the Author, as there could be multiple authors for any one book, which would show up as more than one checkout
SELECT checkoutID AS "Checkout Reference Number", startTime AS "Checkout Time", isReturned AS "Returned?", BookCopies.bookCopyID AS "Book Copy ID", Books.title AS "Title", Members.memberID AS "Member ID", CONCAT(Members.firstName, ' ', Members.lastName) AS "Member Name" FROM Checkouts INNER JOIN
BookCopies ON Checkouts.bookCopyID = BookCopies.bookCopyID INNER JOIN
Books ON BookCopies.bookID = Books.bookID INNER JOIN
Members ON Checkouts.memberID = Members.memberID

-- display all checkouts from individual member
-- note: we aren't displaying the Author, as there could be multiple authors for any one book, which would show up as more than one checkout
SELECT checkoutID AS "Checkout Reference Number", startTime AS "Checkout Time", isReturned AS "Returned?", BookCopies.bookCopyID AS "Book Copy ID", Books.title AS "Title", Members.memberID AS "Member ID", CONCAT(Members.firstName, ' ', Members.lastName) AS "Member Name" FROM Checkouts INNER JOIN
BookCopies ON Checkouts.bookCopyID = BookCopies.bookCopyID INNER JOIN
Books ON BookCopies.bookID = Books.bookID INNER JOIN
Members ON Checkouts.memberID = Members.memberID
WHERE Members.contactNumber = :input_contact_number

-- get all book copy data to populate a dropdown for new checkouts
SELECT bookCopyID, Books.title FROM BookCopies INNER JOIN
Books ON BookCopies.bookID = Books.bookID
WHERE BookCopies.bookStatus = "AVAILABLE"
ORDER BY BookCopies.bookID

-- create new checkout, step 1: create checkout
INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) VALUES (NOW(), 0, :bookCopyID_input, (SELECT memberID FROM Members WHERE contactNumber = :memberID_input)

-- create new checkout, step 2: update BookCopies.bookStatus to CHECKED-OUT
UPDATE BookCopies SET bookStatus = "CHECKED-OUT" WHERE bookCopyID = :bookCopyID_input

-- update a checkout (for return book functionality)
UPDATE BookCopies SET bookStatus = "AVAILABLE" WHERE bookCopyID = :bookCopyID_input
UPDATE Checkouts SET isReturned = 1 WHERE checkoutID = :checkoutID_input

