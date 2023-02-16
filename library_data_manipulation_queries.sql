-- All Database Manipulationn Queries that we will use in our project website.
-- The queries are separated by page

-- BOOKS page

-- MEMBERS page
-- display all Members of the library
SELECT memberID AS ID, CONCAT(firstName, ' ', lastName) AS "Name", contactNumber as "Contact Number", currentAddress AS "Current Address", email AS "Email" FROM Members

-- edit a Member
UPDATE Members SET firstName = :firstNameInput, lastName = :lastNameInput, contactNumber = :contactNumberInput, currentAddress = :currentAddressInput, email = :emailInput WHERE memberID = :update_Member_Member_ID

-- delete a Member
DELETE FROM Members WHERE memberID = :delete_member_memberID

-- add a new Member
INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email)
VALUES (:firstNameInput, :lastNameInput, :contactNumberInput, :currentAddressInput, :emailInput)

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

-- BOOK COPIES page