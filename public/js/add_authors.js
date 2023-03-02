const addAuthorSubmit = document.getElementById('add-author-form-ajax-submit');

// Modify the objects we need
addAuthorSubmit.addEventListener("click", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputAuthorFirstName = document.getElementById("input-author-firstName");
    const inputAuthorLastName = document.getElementById('input-author-lastName')

    // Get the values from the form fields
    const authorFirstNameValue = inputAuthorFirstName.value;
    const authorLastNameValue = inputAuthorLastName.value;

    const goInsert = confirm(`Are you sure you want to add ${authorFirstNameValue} ${authorLastNameValue} into the database?`);

    if (goInsert) {

        // Put our data we want to send in a javascript object
        const data = {
            firstName: authorFirstNameValue,
            lastName: authorLastNameValue
        }
            
        // Setup our AJAX request
        const xhttp = new XMLHttpRequest();
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

        // Creates a single row from an Object representing a single record from Books
        addRowToTable = (data) => {

            // Get a reference to the current table on the page and clear it out.
            const currentTable = document.getElementById("author-table");

            // Get the location where we should insert the new row (end of table)
            const newRowIndex = currentTable.rows.length;

            // Get a reference to the new row from the database query (last object)
            const parsedData = JSON.parse(data);
            const newRow = parsedData[parsedData.length - 1]

            // Create a row and 2 cells
            const row = document.createElement("TR");
            const authorID = document.createElement("TD");
            const authorFirstNameCell = document.createElement("TD");
            const authorLastNameCell = document.createElement("TD");

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
        window.location.reload();
        window.alert('Insert Successful');  
    }
})