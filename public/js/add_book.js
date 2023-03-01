// Get the objects we need to modify
let addBookForm = document.getElementById('add-book-form-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputBookTitle = document.getElementById("input-bookTitle");

    // Get the values from the form fields
    const bookTitleValue = inputBookTitle.value;

    // Put our data we want to send in a javascript object
    const data = {
        title: bookTitleValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 1 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBookTitle.value = '';
        }
        else if (xhttp.readyState == 1 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Books
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("book-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let bookID = document.createElement("TD");
    let bookTitleCell = document.createElement("TD");

    // Fill the cells with correct data
    bookID.innerText = newRow.id;
    bookTitleCell.innerText = newRow.title;

    // Add the cells to the row 
    row.appendChild(bookID);
    row.appendChild(bookTitleCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}