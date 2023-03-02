function deleteBook(bookID) {
    // Put our data we want to send in a javascript object
    const data = {
        bookID: bookID
    };

    const goDelete = confirm(`Are you sure you want to delete the data from the database?`);
    if (goDelete) {

        // Setup our AJAX request
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "/delete-book-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 1 && xhttp.status == 204) {
                // Add the new data to the table
                deleteRow(authorID);
            }
            else if (xhttp.readyState == 1 && xhttp.status != 204) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

        function deleteRow(bookID){

            const table = document.getElementById("book-table");
            for (let i = 0, row; row = table.rows[i]; i++) {
            //iterate through rows
            //rows would be accessed using the "row" variable assigned in the for loop
                if (table.rows[i].getAttribute("data-value") == bookID) {
                    table.deleteRow(i);
                    break;
                }
            }
        }
        window.location.reload();
        window.alert('Delete Successful');
    }
}