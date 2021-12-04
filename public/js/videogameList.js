function getAllCards() {
    let cards = document.getElementsByClassName("card");
    let videogames = [];
    for (let card of cards) {
        let videogame = {};

        videogame.name = card.children[0].children[1].innerHTML;
        videogame.genre = card.children[1].children[1].innerHTML;
        videogame.score = card.children[2].children[1].innerHTML;
        videogame.img = card.children[3].children[0].getAttribute("src");

        videogames.push(videogame);
    }
    return videogames;
}

let myForm = document.getElementById('myForm');
let searchTerm = document.getElementById('searchTerm');
let searchResult = document.getElementById('search-result');
let errorDiv = document.getElementById('error');
let noResult = document.getElementById("no-result");


let videoGames = getAllCards();
if (myForm) {
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (searchTerm.value && searchTerm.value.trim().length != 0) {
            errorDiv.hidden = true;
            noResult.hidden = true;
            try {
                let videoGames = getAllCards();
                let arr = []
                for (let i of videoGames) {
                    if (i.name.toUpperCase() == searchTerm.value.toUpperCase()) {
                        arr.push(i);
                    };
                };
                if (arr.length > 0) {
                    for (let i of arr) {
                        const div = document.createElement('div');
                        div.className = "result-card";
                        div.innerHTML = `<div>
                        <p> Name:</p>
                        <p>${i.name}</p>
                        </div>
                        <div>
                        <p>Genre:</p>
                        <p>${i.genre}</p>
                        </div>
                        <div>
                        <p>Score:</p>
                        <p> ${i.averageUserRating}</p>
                        </div>
                        <div class="videogame-img">
                        <img src="${i.img}">
                        </div>`
                        searchResult.append(div);
                    }
                    myForm.reset();
                    searchTerm.focus()
                } else {
                    noResult.hidden = false;
                    myForm.reset();
                    searchTerm.focus();
                }
            } catch (e) {
                errorDiv.hidden = false;
                errorDiv.innerHTML = "Input must be alphanumeric characters!!!";
                myForm.reset();
                searchTerm.focus();
            }
        } else {
            errorDiv.hidden = false;
            errorDiv.innerHTML = "Input can not be empty!!!";
            myForm.reset();
            searchTerm.focus();
        }
    })
};

function ascendingSort() {
    let videoGames = getAllCards();
    let sortedVideoGames = sortAscending(videoGames)
    console.log(sortedVideoGames)
    let videogameList = document.getElementById("videogame-list");
    while (videogameList.hasChildNodes()) {
        videogameList.removeChild(videogameList.firstChild)
    }
    for (let vd of sortedVideoGames) {
        const div = document.createElement('div');
        div.className = "card";
        div.innerHTML = `<div>
        <p> Name:</p>
        <p>${vd.name}</p>
    </div>
    <div>
        <p>Genre:</p>
        <p>${vd.genre}</p>
    </div>
    <div>
        <p>Score:</p>
        <p> ${vd.score}</p>
    </div>
    <div class="videogame-img">
        <img src="${vd.img}">
    </div>`
        videogameList.append(div);
    }
}

function descendingSort() {
    let videoGames = getAllCards();
    let sortedVideoGames = sortDescending(videoGames);
    console.log(sortedVideoGames);
    let videogameList = document.getElementById("videogame-list");
    while (videogameList.hasChildNodes()) {
        videogameList.removeChild(videogameList.firstChild)
    }
    for (let vd of sortedVideoGames) {
        const div = document.createElement('div');
        div.className = "card";
        div.innerHTML = `<div>
                <p> Name:</p>
                <p>${vd.name}</p>
            </div>
            <div>
                <p>Genre:</p>
                <p>${vd.genre}</p>
            </div>
            <div>
                <p>Score:</p>
                <p> ${vd.score}</p>
            </div>
            <div class="videogame-img">
                <img src="${vd.img}">
            </div>`
        videogameList.append(div);
    }
}

function sortDescending(arr) {

    for (let i of arr) {
        i.score = parseFloat(i.score);
    }
    arr.sort((a, b) => -1 * (a.score - b.score));
    return arr;
}

function sortAscending(arr) {

    for (let i of arr) {
        i.score = parseFloat(i.score);
    }
    arr.sort((a, b) => a.score - b.score);
    return arr;
}