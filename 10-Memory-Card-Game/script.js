const cards = document.querySelectorAll(".card");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let moves = 0;
let startTime;
let timerStarted = false;

function flipCard({ target: clickedCard }) {
    if (cardOne !== clickedCard && !disableDeck) {

        if (!timerStarted) {
            startTime = new Date();
            timerStarted = true;
        }

        clickedCard.classList.add("flip");

        if (!cardOne) {
            cardOne = clickedCard;
            return;
        }

        cardTwo = clickedCard;
        disableDeck = true;
        moves++;
        updateStats();

        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matched++;

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        disableDeck = false;

        if (matched === 8) {
            setTimeout(() => {
                const endTime = new Date();
                const timeTaken = Math.floor((endTime - startTime) / 1000);

                alert(`مبروك! أنهيت اللعبة بـ ${moves} حركة في ${timeTaken} ثانية.`);

                // حفظ بيانات اللاعب في localStorage
                const playerData = {
                    playerId: Math.floor(Math.random() * 1000),
                    moves: moves,
                    timeTaken: timeTaken,
                    success: 1,
                    sessionTime: new Date().toISOString(),
                };

                let storedData = JSON.parse(localStorage.getItem("playerStats")) || [];
                storedData.push(playerData);
                localStorage.setItem("playerStats", JSON.stringify(storedData));
                console.log("تم حفظ بيانات اللاعب:", playerData);

                shuffleCard();
                updateDashboard(); // تحديث لوحة التحكم بعد تخزين البيانات
            }, 1000);
        }

        return;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    moves = 0;
    timerStarted = false;
    updateStats();

    cardOne = cardTwo = "";
    disableDeck = false;

    let arr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

function updateStats() {
    const movesElement = document.getElementById("moves-count");
    if (movesElement) {
        movesElement.textContent = `عدد الحركات: ${moves}`;
    }
}

shuffleCard();
cards.forEach(card => card.addEventListener("click", flipCard));