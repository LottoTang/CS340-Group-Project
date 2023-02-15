// Get the objects we need to modify
let addAuthorForm = document.getElementById('add-author-form-ajax');

// Modify the objects we need
addAuthorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAuthorFirstName = document.getElementById("input-author-firstName");
    let inputAuthorLastName = document.getElementById('input-author-lastName')

    // Get the values from the form fields
    let authorFirstNameValue = inputAuthorFirstName.value;
    let authorLastNameValue = inputAuthorLastName.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: authorFirstNameValue,
        lastName: authorLastNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 2 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAuthorFirstName.value = '';
            inputAuthorLastName.value = '';
        }
        else if (xhttp.readyState == 2 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Books
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("author-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let authorID = document.createElement("TD");
    let authorFirstNameCell = document.createElement("TD");
    let authorLastNameCell = document.createElement("TD");

    // Fill the cells with correct data
    authorID.innerText = newRow.id;
    authorFirstNameCell.innerText = newRow.firstName;
    authorLastNameCell.innerText = newRow.lastName;

    // Add the cells to the row 
    row.appendChild(authorID);
    row.appendChild(authorFirstNameCell);
    row.appendChild(authorLastNameCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}