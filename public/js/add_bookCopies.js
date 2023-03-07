// Get the objects we need to modify
let addBookCopyForm = document.getElementById('add-book-copy-form-ajax');

// Modify the objects we need
addBookCopyForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputBookID = document.getElementById("dropdown-book-title-ajax");

    // Get the values from the form fields
    const inputBookIDValue = inputBookID.value;

    console.log(inputBookIDValue);

    const goInsert = confirm(`Are you sure you want to add the data into the database?`);

    if (goInsert) {

        // Put our data we want to send in a javascript object
        let data = {
            bookID: inputBookIDValue
        }
        
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-book-copy-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

    }
    window.alert('Insert Successful'); 
    window.location.reload();  
});