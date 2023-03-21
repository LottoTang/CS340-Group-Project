// Get the objects we need to modify
let addMemberForm = document.getElementById('add-member-form-ajax');

// Modify the objects we need
addMemberForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-firstName");
    let inputLastName = document.getElementById("input-lastName");
    let inputContactNumber = document.getElementById("input-contactNumber");
    let inputAddress = document.getElementById("input-currentAddress");
    let inputEmail = document.getElementById("input-email");
    
    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let contactNumberValue = inputContactNumber.value;
    let addressValue = inputAddress.value;
    let emailValue = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        contactNumber: contactNumberValue,
        currentAddress: addressValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-member-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputContactNumber.value = '';
            inputAddress.value = '';
            inputEmail.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Members
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("members-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let memberIDCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let contactNumberCell = document.createElement("TD");
    let currentAddressCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let editAndDeleteCell = document.createElement("TD");

    // Fill the cells with correct data
    memberIDCell.innerText = newRow.memberID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    contactNumberCell.innerText = newRow.contactNumber;
    currentAddressCell.innerText = newRow.currentAddress;
    emailCell.innerText = newRow.email; 

    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit"
    editButton.onclick = function() {
        showUpdateMember(newRow.memberID);
    };
    editButton.classList.add("btn");

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete"
    deleteButton.onclick = function() {
        deleteMember(newRow.memberID);
    };
    deleteButton.classList.add("btn");

    editAndDeleteCell.appendChild(editButton);
    editAndDeleteCell.appendChild(deleteButton);


    // Add the cells to the row 
    row.appendChild(memberIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(contactNumberCell);
    row.appendChild(currentAddressCell);
    row.appendChild(emailCell);
    row.appendChild(editAndDeleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.memberID);
    

    // Add the row to the table
    currentTable.appendChild(row);

    // start of new area after adding update functionality

    // find drop-down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax
    // will be found in it without needing a refresh

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.firstName + ' ' + newRow.lastName;
    option.value = newRow.memberID;
    selectMenu.add(option);
}
