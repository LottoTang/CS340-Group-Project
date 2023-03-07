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
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Clear the input fields for another transaction
                inputAuthorFirstName.value = '';
                inputAuthorLastName.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        window.alert('Insert Successful');  
        xhttp.send(JSON.stringify(data));
    }
})