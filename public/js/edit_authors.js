function showEditAuthor(authorID) {
    const edit_form = document.getElementById('edit-author');
    if (edit_form.style.display === 'none') {
        edit_form.style.display = 'block';
    } else {
        edit_form.style.display = 'none';
    }
    const edit_dropdown = document.getElementById('dropdown-authors-ajax');
    edit_dropdown.value = authorID;
}

// Get the objects we need to modify
let updateAuthorForm = document.getElementById('edit-author-form-ajax');

// Modify the objects we need
updateAuthorForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputAuthorID = document.getElementById("dropdown-authors-ajax")
    const inputAuthorFirstName = document.getElementById("edit-author-firstName");
    const inputAuthorLastName = document.getElementById("edit-author-lastName");


    // Get the values from the form fields
    const authorIDValue = inputAuthorID.value;
    const authorFirstNameValue = inputAuthorFirstName.value;
    const authorLastNameValue = inputAuthorLastName.value;

    const goEdit = confirm(`Are you sure you want to change to ${authorFirstNameValue} ${authorLastNameValue}?`)

    if (goEdit) {

        // Put our data we want to send in a javascript object
        const data = {
            authorID: authorIDValue,
            firstName: authorFirstNameValue,
            lastName: authorLastNameValue
        }
        
        // Setup our AJAX request
        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/put-author-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 2 && xhttp.status == 200) {

                // Add the new data to the table
                updateRow(xhttp.response, authorIDValue);

            }
            else if (xhttp.readyState == 2 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

        function updateRow(data, authorID) {

            const parsedData = JSON.parse(data);
            
            const table = document.getElementById("author-table");

            for (var i = 0, row; row = table.rows[i]; i++) {
                //iterate through rows
                //rows would be accessed using the "row" variable assigned in the for loop
                if (table.rows[i].getAttribute("data-value") == authorID) {

                    // Get the location of the row where we found the matching authorID
                    const updateRowIndex = table.getElementsByTagName("tr")[i];

                    // Get td of firstName
                    const td1 = updateRowIndex.getElementsByTagName("td")[1];

                    // Reassign firstName to our value we updated to
                    td1.innerHTML = parsedData[0].firstName; 

                    // Get td of firstName
                    const td2 = updateRowIndex.getElementsByTagName("td")[2];

                    // Reassign firstName to our value we updated to
                    td2.innerHTML = parsedData[0].lastName; 
                }
            }
        }
        window.location.reload();
    }
})