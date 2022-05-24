document.body.onload = init;


function init() {
    let ldbStorage = JSON.parse(localStorage.getItem("leaderBoard"));
    for (let i = 0; i < ldbStorage.leaderBoard.length; i++) {
        let boardArray = ldbStorage.leaderBoard;
       if (boardArray[i].score > 0) {
           const p = document.createElement("p");
           const content = document.createTextNode((i+1) + ". " + boardArray[i].userName + " : " + boardArray[i].score)
            p.appendChild(content);
           let mainDiv = document.getElementById("leaderBoard_div");
           mainDiv.appendChild(p);
       }
    }
}
