function deleteMember(memberID) {
    let data = {
        id: memberID
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-member-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(memberID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    window.alert('Delete Successful');  
    xhttp.send(JSON.stringify(data));
    window.location.reload();

}

  
function deleteRow(memberID){
    let table = document.getElementById("members-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == memberID) {
            table.deleteRow(i);
            break;
        }
    }
}
