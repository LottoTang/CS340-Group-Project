function toggleShowEditCheckout(checkoutID, memberID) {
    let edit_form = document.getElementById('updateCheckoutForm');
    let currentlyEditing = document.getElementById('selectCheckout');
    let currentMemberIDEditing = document.getElementById('input-updatedMember');
    let currentlyEditingValue = currentlyEditing.value;


                if (edit_form.style.display === 'none') {
                    edit_form.style.display = 'block';
                    currentlyEditing.value = checkoutID;
                    currentMemberIDEditing.value = memberID;

                } else if (currentlyEditingValue != checkoutID) {
                    currentlyEditing.value = checkoutID;
                    currentMemberIDEditing.value = memberID;
                } else {
                    edit_form.style.display = 'none';
                }
                
};

// Get the objects we need to modify
let updateCheckoutForm = document.getElementById('update-checkout-form-ajax');

// Modify the objects we need
updateCheckoutForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCheckout = document.getElementById("selectCheckout");
    let inputUpdatedMember = document.getElementById("input-updatedMember");


    // Get the values from the form fields
    let checkoutValue = inputCheckout.value;
    let updatedMemberValue = inputUpdatedMember.value;

    if (checkoutValue == 'noOption') {
        alert("Please choose a Checkout to edit")
        return;
    }
    if (updatedMemberValue == 'null') {
        alert("this hasn't been coded yet, but i'm glad it works this much")
    }

    const goEdit = confirm(`Are you sure you want to update information for checkout ID #` + checkoutValue + `?`)
    
    if (goEdit){

    // Put our data we want to send in a javascript object
    let data = {
        checkoutID: checkoutValue,
        memberID: updatedMemberValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-checkout-ajax/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, checkoutValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

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
                let newMemberID = updateRowIndex.getElementsByTagName("td")[2];
                let newMemberName = updateRowIndex.getElementsByTagName("td")[3];


                // Reassign homeworld to our value we updated to
                newMemberID.innerHTML = parsedData[0].memberID; 
                newMemberName.innerHTML = parsedData[0].firstName + " " + parsedData[0].lastName;

        } else {
            let table = document.getElementById("returned-checkouts-table");

            if (table.rows[i].getAttribute("data-value") == checkoutID) {

                // Get the location of the row where we found the matching person ID
                let updateRowIndex = table.getElementsByTagName("tr")[i];

                // Get td of all values
                let newMemberID = updateRowIndex.getElementsByTagName("td")[2];
                let newMemberName = updateRowIndex.getElementsByTagName("td")[3];


                // Reassign homeworld to our value we updated to
                newMemberID.innerHTML = parsedData[0].memberID; 
                newMemberName.innerHTML = parsedData[0].firstName + " " + parsedData[0].lastName;

        }
        }
        }
    }
}
});