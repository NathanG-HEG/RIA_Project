document.body.onload = init;


function init() {
    let ldbStorage = JSON.parse(localStorage.getItem("leaderBoard"));
    let i=0;
    for (let b of ldbStorage.leaderBoard) {
       if (b.score > 0) {
           const p = document.createElement("p");
           const content = document.createTextNode((i+1) + ". " + b.userName + " : " + b.score)
            p.appendChild(content);
           let mainDiv = document.getElementById("leaderBoard_div");
           mainDiv.appendChild(p);
           i++;
       }
    }
}
