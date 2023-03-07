function showEditBook(bookID) {
    const edit_form = document.getElementById('edit-book');
    if (edit_form.style.display === 'none') {
        edit_form.style.display = 'block';
    } else {
        edit_form.style.display = 'none';
    }
    const edit_dropdown = document.getElementById('dropdown-books-ajax');
    edit_dropdown.value = bookID;
}

// Get the objects we need to modify
let updateBookForm = document.getElementById('edit-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputBookID = document.getElementById("dropdown-books-ajax")
    const inputBookTitle = document.getElementById("edit-book-title");

    // Get the values from the form fields
    const bookIDValue = inputBookID.value;
    const inputBookTitleValue = inputBookTitle.value;

    const goEdit = confirm(`Are you sure you want to change to ${inputBookTitleValue}?`)

    if (goEdit) {

        // Put our data we want to send in a javascript object
        const data = {
            bookID: bookIDValue,
            title: inputBookTitleValue,
        }
        
        // Setup our AJAX request
        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/put-book-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                updateRow(xhttp.response, bookIDValue);
                window.alert('Update Successful');

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

        function updateRow(data, bookID) {

            const parsedData = JSON.parse(data);
            
            const table = document.getElementById("book-table");

            for (var i = 0, row; row = table.rows[i]; i++) {
                //iterate through rows
                //rows would be accessed using the "row" variable assigned in the for loop
                if (table.rows[i].getAttribute("data-value") == bookID) {

                    // Get the location of the row where we found the matching authorID
                    const updateRowIndex = table.getElementsByTagName("tr")[i];

                    // Get td of title
                    const td1 = updateRowIndex.getElementsByTagName("td")[1];

                    const updateAnchor = document.createElement("a");
                    updateAnchor.setAttribute("href", "#");
                    updateAnchor.onclick = function(){
                        showBookAuthors(parsedData[0].bookID);
                    };
                    updateAnchor.innerHTML = parsedData[0].title; 
                    td1.innerHTML = '';
                    td1.appendChild(updateAnchor);
                }
            }
        }
    }
})