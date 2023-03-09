// Get the objects we need to modify
let addCheckoutForm = document.getElementById('new-checkout-form-ajax');

// Modify the objects we need
addCheckoutForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBook = document.getElementById("selectBook");
    let inputPhone = document.getElementById("input-contactNumber");
    
    
    // Get the values from the form fields
    let bookValue = inputBook.value;
    let phoneValue = inputPhone.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        bookCopyID: bookValue,
        contactNumber: phoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-checkout-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBook.value = 'test';
            inputPhone.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    
    xhttp.send(JSON.stringify(data));

    let success_message = alert(`Successfully checked out book`);
    if (success_message) {
        }
    returnToCheckouts();

});
function returnToCheckouts() {
    window.location.href="./checkouts";
}

