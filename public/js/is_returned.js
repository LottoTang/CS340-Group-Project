
function isReturned(bool){
    if (bool == 0) {
        document.getElementById("return").innerHTML = produceMessage("No");
    }
    else {
        document.getElementById("return").innerHTML = produceMessage("Yes")
    }

}