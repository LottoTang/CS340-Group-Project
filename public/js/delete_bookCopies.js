function deleteBookCopy(bookCopyID) {
    // Put our data we want to send in a javascript object
    const data = {
        bookCopyID: bookCopyID
    };

    const goDelete = confirm(`Are you sure you want to delete from the database?`);
    if (goDelete) {

        // Setup our AJAX request
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "/delete-book-copy-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Add the new data to the table
                deleteRow(bookCopyID);
                window.alert('Delete Successful');
            }
            else if (xhttp.readyState == 4 && xhttp.status != 204) {
                console.log("There was an error with the input.")
                window.alert('Cannot delete author: there are books related to this author.');
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

        function deleteRow(bookCopyID){

            const table = document.getElementById("book-copy-table");
            for (let i = 0, row; row = table.rows[i]; i++) {
            //iterate through rows
            //rows would be accessed using the "row" variable assigned in the for loop
                if (table.rows[i].getAttribute("data-value") == bookCopyID) {
                    table.deleteRow(i);
                    break;
                }
            }
        }
    }
}
