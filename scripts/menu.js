function saveUserName() {
    let userName = document.getElementById("userName").value;
    userName = userName.replace(/\s/g, ''); //get rid of spaces
    localStorage.setItem("userName", userName);
}