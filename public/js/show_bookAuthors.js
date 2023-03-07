function showBookAuthors(bookID) {
    const bookAuthorTable = document.getElementById('show-book-authors');
    
    // reset the inner content for each click
    const bookAuthorInside = document.getElementById('book-authors-table');
    bookAuthorInside.innerHTML = '';

    var goHTTPRequest = true;

    if (bookAuthorTable.style.display === 'none') {
        bookAuthorTable.style.display = 'block';
    } else {
        bookAuthorTable.style.display = 'none';
        goHTTPRequest = false;
    }

    if (goHTTPRequest) {
        const data = {
            bookID: bookID
        };

        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/book-authors", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                addBookAuthor(xhttp.response);
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.");
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

        addBookAuthor = (data) => {

            // Get a reference to the current table on the page and clear it out.
            const currentTable = document.getElementById("book-authors-table");
        
            // Get the location where we should insert the new row (end of table)
            const newRowIndex = currentTable.rows.length;
        
            // Get a reference to the new row from the database query (last object)
            const parsedData = JSON.parse(data);

            const parseDataLength = Object.keys(parsedData).length;

            for (var i = 0; i < parseDataLength; i++) {
                const newRow = parsedData[i];
                const row = document.createElement("TR");
                const authorIDCell = document.createElement("TD");
                const bookTitleCell = document.createElement("TD");

                bookTitleCell.innerText = newRow.Title;
                authorIDCell.innerText = newRow.FullName;

                row.appendChild(bookTitleCell);
                row.appendChild(authorIDCell);
                
                currentTable.appendChild(row);
            }
        }
    }
}