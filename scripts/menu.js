function saveUserName() {
    let userName = document.getElementById("userName").value;
    localStorage.setItem("userName", userName);
}