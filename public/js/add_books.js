function extraAuthor() {
    const extraDropDown = document.getElementsByClassName('dropdown-list');
    const requiredElement = extraDropDown[0].cloneNode(true);;
    document.getElementById('dropdown-list-container').appendChild(requiredElement);
}

function registerAuthor() {
    const registerAuthorContainer = document.getElementById('extra-author-container');

    const newPara = document.createElement('p')
    const newFirstNameLabel = document.createElement('label');
    newFirstNameLabel.textContent = 'New Author First Name: ';
    const newFirstNameInput = document.createElement('input');
    newFirstNameInput.type = "text";
    newFirstNameInput.setAttribute('class', 'input-author-firstName');

    newPara.appendChild(newFirstNameLabel);
    newPara.appendChild(newFirstNameInput);

    const newLastNameLabel = document.createElement('label');
    newLastNameLabel.textContent = 'New Author Last Name: ';
    const newLastNameInput = document.createElement('input');
    newLastNameInput.type = "text";
    newLastNameInput.setAttribute('class', 'input-author-lastName');

    newPara.appendChild(newLastNameLabel);
    newPara.appendChild(newLastNameInput);

    registerAuthorContainer.appendChild(newPara);
}

// action after clicking the "Submit"

const addBookSubmit = document.getElementById('add-book-form-ajax-submit');

// Modify the objects we need
addBookSubmit.addEventListener("click", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputBookTitle = document.getElementById('input-book-title');
    const inputAuthor = document.getElementsByClassName('dropdown-authors-ajax');

    // Get the values from the form fields
    const bookTitleValue = inputBookTitle.value;

    // Input from dropdown list (for bookCopies)
    const inputAuthorValue = [];
    if (inputAuthor.length > 1) { 
        for (var i = 0; i < inputAuthor.length; i++) {
            inputAuthorValue[i] = inputAuthor[i].value;
        }
    } else {
        inputAuthorValue[0] = inputAuthor[0].value;
    }

    // Get input from new author registration
    const newAuthorFirstName = document.getElementsByClassName('input-author-firstName');
    const newAuthorLastName = document.getElementsByClassName('input-author-lastName');

    var authorNotFound = false;
    var addBookDone = false;
    var addAuthorDone = false;
    var addBookCopyDone = false;
    const inputAuthorFirstName = [];
    const inputAuthorLastName = []; 

    if (newAuthorFirstName.length > 0 && newAuthorLastName.length > 0) {
        authorNotFound = true;
        for (var i = 0; i < newAuthorFirstName.length; i++) {
            inputAuthorFirstName[i] = newAuthorFirstName[i].value;
            inputAuthorLastName[i] = newAuthorLastName[i].value;
        }
    }

    const goInsert = confirm(`Are you sure you want to add the data into the database?`);

    if (goInsert) {

        // Put our data we want to send in a javascript object
        const data = {
            title: bookTitleValue,
        }

        const authors = {
            firstName: inputAuthorFirstName,
            lastName: inputAuthorLastName
        }

        const bookCopy = {
            title: bookTitleValue,
        }

        const bookAuthors = {
            title: bookTitleValue,
            firstName:inputAuthorFirstName,
            lastName: inputAuthorLastName,
            authorID: inputAuthorValue
        }
            
        // Setup our AJAX request

        const xhttpBook = new XMLHttpRequest();
        xhttpBook.open("POST", "/add-book-ajax", true);
        xhttpBook.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttpBook.onreadystatechange = () => {
            if (xhttpBook.readyState == 4 && xhttpBook.status == 200) {

                // Add the new data to the table
                // addRowToTableBook(xhttpBook.response);

                // Clear the input fields for another transaction
                inputBookTitle.value = '';
            }
            else if (xhttpBook.readyState == 4 && xhttpBook.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttpBook.send(JSON.stringify(data)); 
        addBookDone = true;

        if(authorNotFound) {

            // Setup our AJAX request (add Authors)
            const xhttpAuthor = new XMLHttpRequest();
            xhttpAuthor.open("POST", "/add-author-multiple-ajax", true);
            xhttpAuthor.setRequestHeader("Content-type", "application/json");

            // Tell our AJAX request how to resolve
            xhttpAuthor.onreadystatechange = () => {
                if (xhttpAuthor.readyState == 4 && xhttpAuthor.status == 204) {

                    // Add the new data to the table
                    // addRowToTableAuthor(xhttpAuthor.response);

                    // Clear the input fields for another transaction
                    inputAuthorFirstName.value = '';
                    inputAuthorLastName.value = '';
                }
                else if (xhttpAuthor.readyState == 4 && xhttpAuthor.status != 204) {
                    console.log("There was an error with the input.")
                }
            }

            // Send the request and wait for the response
            xhttpAuthor.send(JSON.stringify(authors));
        }
        
        // BOOKCOPIES
        // Setup our AJAX request
        if (addBookDone) {
            const xhttpBookCopies = new XMLHttpRequest();
            xhttpBookCopies.open("POST", "/add-book-copy-using-title", true);
            xhttpBookCopies.setRequestHeader("Content-type", "application/json");

            // Tell our AJAX request how to resolve
            xhttpBookCopies.onreadystatechange = () => {
                if (xhttpBookCopies.readyState == 4 && xhttpBookCopies.status == 204) {

                    // Add the new data to the table
                    console.log("Send book copy successful.")
                    
                }
                else if (xhttpBookCopies.readyState == 4 && xhttpBookCopies.status != 204) {
                    console.log("There was an error with the input.")
                }
            }
            // Send the request and wait for the response
            xhttpBookCopies.send(JSON.stringify(bookCopy));
            addBookCopyDone = true;

            //BOOKAUTHORS
            // Setup our AJAX request
            if (addBookDone && addBookCopyDone) {
                const xhttpBookAuthors = new XMLHttpRequest();
                xhttpBookAuthors.open("POST", "/add-book-authors", true);
                xhttpBookAuthors.setRequestHeader("Content-type", "application/json");

                // Tell our AJAX request how to resolve
                xhttpBookAuthors.onreadystatechange = () => {
                    if (xhttpBookAuthors.readyState == 4 && xhttpBookAuthors.status == 204) {

                        // Add the new data to the table
                        console.log("Send book author successful.")
                    }
                    else if (xhttpBookAuthors.readyState == 4 && xhttpBookAuthors.status != 204) {
                        console.log("There was an error with the input.")
                    }
                }
                // Send the request and wait for the response
                xhttpBookAuthors.send(JSON.stringify(bookAuthors));
            }
        }

        window.location.reload();  
        window.alert('Insert Successful');
    }
})

