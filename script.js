const gameCards = document.querySelectorAll(".game-card");

gameCards.forEach((card) => {

    card.addEventListener("click", () => {

        card.classList.add("selected");

        setTimeout(() => {
            card.classList.remove("selected");
        }, 300);

    });

});
