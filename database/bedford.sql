SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Books
DROP TABLES IF EXISTS Books;
CREATE TABLE Books (
	bookID INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(100) UNIQUE NOT NULL,
    PRIMARY KEY (bookID)
);
DESCRIBE Books;

-- Authors
DROP TABLES IF EXISTS Authors;
CREATE TABLE Authors (
	authorID INT AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    PRIMARY KEY (authorID)
);
DESCRIBE Authors;

-- BooksAuthors
DROP TABLES IF EXISTS BookAuthors;
CREATE TABLE BookAuthors (
    authorID INT NOT NULL,
    bookID INT NOT NULL,
    PRIMARY KEY (authorID, bookID),
    FOREIGN KEY (authorID) REFERENCES Authors (authorID),
    FOREIGN KEY (bookID) REFERENCES Books (bookID)
);
DESCRIBE BookAuthors;

-- Members
DROP TABLES IF EXISTS Members;
CREATE TABLE Members (
	memberID INT AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    contactNumber CHAR(12) NOT NULL CHECK (contactNumber RLIKE '[0-9]{3}-[0-9]{3}-[0-9]{4}'),
    currentAddress VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL CHECK (email RLIKE '^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    PRIMARY KEY (memberID)
);
DESCRIBE Members;

-- BookCopies
DROP TABLES IF EXISTS BookCopies;
CREATE TABLE BookCopies (
	bookCopyID INT AUTO_INCREMENT NOT NULL,
    bookID INT NOT NULL,
    bookStatus VARCHAR(45) NOT NULL DEFAULT "AVAILABLE",
    PRIMARY KEY (bookCopyID, bookID),
    FOREIGN KEY (bookID) REFERENCES Books (bookID) ON DELETE CASCADE
);
DESCRIBE BookCopies;

-- Checkouts
DROP TABLES IF EXISTS Checkouts;
CREATE TABLE Checkouts (
	checkoutID INT AUTO_INCREMENT NOT NULL,
    startTime DATETIME NOT NULL,
    isReturned TINYINT NOT NULL DEFAULT 1,
    bookCopyID INT NOT NULL,
    memberID INT NOT NULL,
    PRIMARY KEY (checkoutID),
    FOREIGN KEY (bookCopyID) REFERENCES BookCopies (bookCopyID) ON DELETE CASCADE,
    FOREIGN KEY (memberID) REFERENCES Members (memberID) ON DELETE CASCADE
);
DESCRIBE Checkouts;

-- INSERT MEMBER DATA
INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email) VALUES ("Dorothy", "Andrews", "949-227-2436", "4823 Harley Brook Lane, Bedford, PA", "gloria2013@fake.com");
INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email) VALUES ("James", "Pressman", "641-583-0777", "3152 Custer Street, Bedford, PA", "iliana2013@fake.com");
INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email) VALUES ("Amanda", "Johnson", "510-840-3869", "3691 Stutler Lane La, Bedford, PA", "amandajohnson2013@fake.com");
INSERT INTO Members (firstName, lastName, contactNumber, currentAddress, email) VALUES ("Margaret", "Waugh", "814-977-9583", "2349 Custer Street, Bedford, PA", "bettiehalvors@fake.com");

-- INSERT BOOK DATA
INSERT INTO Books (title) VALUES ("B.F.F.: A Memoir of Friendship Lost and Found");
INSERT INTO Books (title) VALUES ("Victory City: A Novel");
INSERT INTO Books (title) VALUES ("River Sing Me Home");
INSERT INTO Books (title) VALUES ("Big Swiss: A Novel");
INSERT INTO Books (title) VALUES ("Pretend I'm Dead: A Novel");
INSERT INTO Books (title) VALUES ("Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch");

-- INSERT Author DATA
INSERT INTO Authors (firstName, lastName) VALUES ("Christie", "Tae");
INSERT INTO Authors (firstName, lastName) VALUES ("Salman", "Rushdie");
INSERT INTO Authors (firstName, lastName) VALUES ("Eleanor", "Shearer");
INSERT INTO Authors (firstName, lastName) VALUES ("Jen", "Beagin");
INSERT INTO Authors (firstName, lastName) VALUES ("Terry", "Pratchett");
INSERT INTO Authors (firstName, lastName) VALUES ("Neil", "Gaiman");

-- INSERT BookCopies DATA
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "B.F.F.: A Memoir of Friendship Lost and Found" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "B.F.F.: A Memoir of Friendship Lost and Found" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "Victory City: A Novel" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "River Sing Me Home" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "River Sing Me Home" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "Big Swiss: A Novel" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "Pretend I'm Dead: A Novel" ) );
INSERT INTO BookCopies (bookID) VALUES ( (SELECT Books.bookID FROM Books WHERE Books.title = "Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch" ) );

-- INSERT BookAuthors DATA
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Christie" AND Authors.lastName = "Tae"), (SELECT Books.bookID FROM Books WHERE Books.title = "B.F.F.: A Memoir of Friendship Lost and Found" ));
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Salman" AND Authors.lastName = "Rushdie"), (SELECT Books.bookID FROM Books WHERE Books.title = "Victory City: A Novel" ));
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Eleanor" AND Authors.lastName = "Shearer"), (SELECT Books.bookID FROM Books WHERE Books.title = "River Sing Me Home" ));
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Jen" AND Authors.lastName = "Beagin"), (SELECT Books.bookID FROM Books WHERE Books.title = "Big Swiss: A Novel" ));
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Jen" AND Authors.lastName = "Beagin"), (SELECT Books.bookID FROM Books WHERE Books.title = "Pretend I'm Dead: A Novel" ));
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Terry" AND Authors.lastName = "Pratchett"), (SELECT Books.bookID FROM Books WHERE Books.title = "Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch" ));
INSERT INTO BookAuthors (authorID, bookID) VALUES (( SELECT Authors.authorID FROM Authors WHERE Authors.firstName = "Neil" AND Authors.lastName = "Gaiman"), (SELECT Books.bookID FROM Books WHERE Books.title = "Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch" ));

-- SET UP TRIGGER
-- TRIGGER 1 : Update BookStatus after Checkout
DELIMITER //
CREATE TRIGGER bookStatus_update AFTER INSERT ON Checkouts
FOR EACH ROW
BEGIN
	UPDATE BookCopies
	SET bookStatus = "CHECKED-OUT"
	WHERE bookCopyID = NEW.bookCopyID;
END; //
DELIMITER ;

-- INSERT Checkouts DATA 
INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) VALUES ( (NOW()), 0, 4, 1);
INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) VALUES ( (NOW()), 0, 5, 2);
INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) VALUES ( (NOW()), 0, 3, 2);
INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) VALUES ( (NOW()), 0, 1, 4);
INSERT INTO Checkouts (startTime, isReturned, bookCopyID, memberID) VALUES ( (NOW()), 0, 8, 3);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

