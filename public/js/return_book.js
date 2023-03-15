function toggleShowHiddenBooks() {
    let returnedSection = document.getElementById('returnedBooksDiv');
    if (returnedSection.style.display === 'none') {
        returnedSection.style.display = 'block';
    } else {
        returnedSection.style.display = 'none';
    }
}


function return_book(checkoutID) {
    
    let data = {
        checkoutID: checkoutID,
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/return-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    
   // const goReturn = confirm(`Are you sure you want to return this book?`)

   // if (goReturn){

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                updateRow(xhttp.response, checkoutID);

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    };

function updateRow(data, checkoutID){

    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("checkouts-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == checkoutID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of all values
            let hiddenButton = updateRowIndex.getElementsByTagName("td")[0];

            let newIfReturned = updateRowIndex.getElementsByTagName("td")[7];
            
            hiddenButton.firstElementChild.setAttribute("disabled", "")
        //    hiddenButton.appendChild(document.createElement("button"))
            newIfReturned.innerHTML = "Yes"
            
    }
    }
};