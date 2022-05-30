function saveUserName() {
    let userName = document.getElementById("userName").value;
    if (userName == "") {
        alert('Choose your username before playing.')
        return;
    }
    userName = userName.replace(/\s/g, ''); //get rid of spaces
    localStorage.setItem("userName", userName);
    location.replace("choix_map.html")
}

function howToPlay() {
    location.replace("how_to_play.html")
}