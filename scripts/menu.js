function saveUserName() {
    let userName = document.getElementById("userName").value;
    userName = userName.replace(/\s/g, ''); //get rid of spaces
    localStorage.setItem("userName", userName);
    location.replace("choix_map.html")
}

function howToPlay() {
    location.replace("how_to_play.html")
}