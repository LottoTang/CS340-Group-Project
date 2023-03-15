function showUpdateMember(memberID) {
    let edit_form = document.getElementById('edit-member');
    let currentlyEditing = document.getElementById('mySelect');
    let currentlyEditingPhone = document.getElementById('input-contactNumber-update');
    let currentlyEditingAddress = document.getElementById('input-currentAddress-update');
    let currentlyEditingEmail = document.getElementById('input-email-update');
    let table = document.getElementById("members-table");

        for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == memberID) {

                // Get the location of the row where we found the matching person ID
                let updateRowIndex = table.getElementsByTagName("tr")[i];

                // Get td of all values
                let newContactNumber = updateRowIndex.getElementsByTagName("td")[3];
                let newCurrentAddress = updateRowIndex.getElementsByTagName("td")[4];
                let newEmail = updateRowIndex.getElementsByTagName("td")[5];

                let currentlyEditingValue = currentlyEditing.value;

                if (edit_form.style.display === 'none') {
                    edit_form.style.display = 'block';
                    currentlyEditing.value = memberID;
                    currentlyEditingPhone.value = newContactNumber.innerText;
                    currentlyEditingAddress.value = newCurrentAddress.innerText;
                    currentlyEditingEmail.value = newEmail.innerText;
                } else if (currentlyEditingValue != memberID) {
                    currentlyEditing.value = memberID;
                    currentlyEditingPhone.value = newContactNumber.innerText;
                    currentlyEditingAddress.value = newCurrentAddress.innerText;
                    currentlyEditingEmail.value = newEmail.innerText;
                } else {
                    edit_form.style.display = 'none';
                }
                    }}; 
};


// Get the objects we need to modify
let updateMemberForm = document.getElementById('update-member-form-ajax');

// Modify the objects we need
updateMemberForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputContactNumber = document.getElementById("input-contactNumber-update");
    let inputCurrentAddress = document.getElementById("input-currentAddress-update");
    let inputEmail = document.getElementById("input-email-update");


    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let contactNumberValue = inputContactNumber.value;
    let currentAddressValue = inputCurrentAddress.value;
    let emailValue = inputEmail.value;

    if (contactNumberValue == '') {
        alert("please enter values for all fields")
        return;
    }
    if (currentAddressValue == '') {
        alert("please enter values for all fields")
        return;
    }
    if (emailValue == '') {
        alert("please enter values for all fields")
        return;
    }

    const goEdit = confirm(`Are you sure you want to update information for member with Member ID #` + fullNameValue + `?`)
    // currently the database table for does not allow updating values to NULL
    // so we must abort if being passed NULL for homeworld
    
    if (goEdit){


    // Put our data we want to send in a javascript object
    let data = {
        memberID: fullNameValue,
        contactNumber: contactNumberValue,
        currentAddress: currentAddressValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-member-ajax/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    function updateRow(data, memberID){

        let parsedData = JSON.parse(data);
        
        let table = document.getElementById("members-table");

        for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == memberID) {

                // Get the location of the row where we found the matching person ID
                let updateRowIndex = table.getElementsByTagName("tr")[i];

                // Get td of all values
                let newContactNumber = updateRowIndex.getElementsByTagName("td")[3];
                let newCurrentAddress = updateRowIndex.getElementsByTagName("td")[4];
                let newEmail = updateRowIndex.getElementsByTagName("td")[5];


                // Reassign homeworld to our value we updated to
                newContactNumber.innerHTML = parsedData[0].contactNumber; 
                newCurrentAddress.innerHTML = parsedData[0].currentAddress;
                newEmail.innerHTML = parsedData[0].email;

        }
        }
    }
}
});