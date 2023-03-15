function deleteAuthor(authorID) {
    // Put our data we want to send in a javascript object
    const data = {
        authorID: authorID
    };

    const goDelete = confirm(`Are you sure you want to delete from the database?`);
    if (goDelete) {

        // Setup our AJAX request
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "/delete-author-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Add the new data to the table
                deleteRow(authorID);
                window.alert('Delete Successful');
            }
            else if (xhttp.readyState == 4 && xhttp.status != 204) {
                alert("Delete Unsuccessful.\nThe Author is associated with Existing Book(s).");
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

        function deleteRow(authorID){

            const table = document.getElementById("author-table");
            for (let i = 0, row; row = table.rows[i]; i++) {
            //iterate through rows
            //rows would be accessed using the "row" variable assigned in the for loop
                if (table.rows[i].getAttribute("data-value") == authorID) {
                    table.deleteRow(i);
                    break;
                }
            }
        }
    }
}