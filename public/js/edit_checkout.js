function showUpdateCheckout(checkoutID) {
    let edit_form = document.getElementById('updateCheckoutForm');
    let currentlyEditing = document.getElementById('checkoutIDCheckoutRow');
    let currentlyEditingValue = currentlyEditing.value;
    if (edit_form.style.display === 'none') {
        edit_form.style.display = 'block';
        currentlyEditing.value = memberID;
    } else if (currentlyEditingValue != memberID) {
        currentlyEditing.value = memberID;
    } else {
        edit_form.style.display = 'none';
    }
}