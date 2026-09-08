/* =========================================================
THUNDERQUIZ
GAME CATALOGUE
Loads games from /data/games.json

## FEATURES

• Quick Play
• Challenge
• Puzzle Room
• More Games
• Search
• Category filtering
• Sorting
• Random games
• Load More
• 1,000+ game support
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   CONFIGURATION
===================================================== */

const sections = {

    quick: {
        container: "quick-games",
        count: "quick-count"
    },

    challenge: {
        container: "challenge-games",
        count: "challenge-count"
    },

    puzzle: {
        container: "puzzle-games",
        count: "puzzle-count"
    }

};


/*
 * Number of games displayed in the normal homepage rows.
 *
 * This prevents hundreds of games from appearing in
 * Quick Play / Challenge / Puzzle Room.
 */

const SECTION_LIMIT = 4;


/*
 * Number of games displayed at a time inside
 * the More Games catalogue.
 *
 * Increase this later if required.
 */

const GAMES_PER_PAGE = 24;


/* =====================================================
   MORE GAMES ELEMENTS
===================================================== */

const allGamesGrid =
    document.getElementById("all-games-grid");

const allGamesCount =
    document.getElementById("all-games-count");

const searchInput =
    document.getElementById("game-search-input");

const clearSearch =
    document.getElementById("clear-game-search");

const filtersContainer =
    document.getElementById("game-filters");

const sortSelect =
    document.getElementById("game-sort-select");

const resultsLabel =
    document.getElementById("game-results-label");

const noResults =
    document.getElementById("no-game-results");

const resetSearch =
    document.getElementById("reset-game-search");

const loadMoreButton =
    document.getElementById("load-more-games");


/* =====================================================
   APPLICATION STATE
===================================================== */

let allGames = [];

let filteredGames = [];

let visibleGames = GAMES_PER_PAGE;

let activeCategory = "all";

let activeSearch = "";

let activeSort = "featured";


/* =====================================================
   START
===================================================== */

loadGames();


/* =====================================================
   LOAD GAMES.JSON
===================================================== */

async function loadGames() {

    try {

        const response =
            await fetch(
                "/data/games.json",
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * Validate catalogue.
         */

        if (
            !data ||
            !Array.isArray(data.games)
        ) {

            throw new Error(
                "games.json does not contain a games array."
            );

        }


        /*
         * Only active games are used.
         */

        allGames =
            data.games
                .filter(
                    game =>
                        game &&
                        game.active !== false
                )
                .filter(isValidGame);


        /*
         * Update homepage section counts.
         */

        updateCounts(allGames);


        /*
         * Render normal homepage rows.
         */

        renderHomepageSections(allGames);


        /*
         * Start More Games catalogue.
         */

        initializeMoreGames();


        console.log(
            `ThunderQuiz: ${allGames.length} games loaded.`
        );


    } catch (error) {

        console.error(
            "ThunderQuiz: Could not load games.json",
            error
        );


        showLoadError();

    }

}


/* =====================================================
   VALIDATE GAME
===================================================== */

function isValidGame(game) {

    if (
        !game.id ||
        !game.title ||
        !game.folder ||
        !game.image ||
        !game.category ||
        !game.section
    ) {

        console.warn(
            "ThunderQuiz: Invalid game entry",
            game
        );

        return false;

    }

    return true;

}


/* =====================================================
   HOMEPAGE SECTIONS
===================================================== */

function renderHomepageSections(games) {

    /*
     * Clear existing rows.
     */

    Object.values(sections).forEach(section => {

        const container =
            document.getElementById(
                section.container
            );

        if (container) {

            container.innerHTML = "";

        }

    });


    /*
     * Render only the first few games in each section.
     *
     * This keeps the homepage clean even when the
     * catalogue grows to thousands of games.
     */

    Object.entries(sections).forEach(
        ([sectionName, section]) => {

            const container =
                document.getElementById(
                    section.container
                );


            if (!container) return;


            const sectionGames =
                games
                    .filter(
                        game =>
                            game.section ===
                            sectionName
                    )
                    .slice(0, SECTION_LIMIT);


            sectionGames.forEach(game => {

                container.appendChild(
                    createGameCard(game)
                );

            });

        }
    );

}


/* =====================================================
   CREATE GAME CARD
===================================================== */

function createGameCard(game) {

    const card =
        document.createElement("a");


    card.className =
        "game-card";


    /*
     * Game URL.
     */

    card.href =
        buildGameUrl(game.folder);


    /*
     * Accessibility.
     */

    card.setAttribute(
        "aria-label",
        `Play ${game.title}`
    );


    /*
     * Optional category.
     */

    const category =
        game.category || "Game";


    card.innerHTML = `

        <div class="game-image">

            <img
                src="${escapeAttribute(game.image)}"
                alt="${escapeAttribute(game.title)}"
                loading="lazy"
                decoding="async"
            >

        </div>


        <div class="game-info">

            <h3>
                ${escapeHTML(game.title)}
            </h3>

            <span>
                ${escapeHTML(category)}
            </span>

        </div>

    `;


    return card;

}


/* =====================================================
   BUILD GAME URL
===================================================== */

function buildGameUrl(folder) {

    const cleanFolder =
        String(folder)
            .replace(/^\/+/, "")
            .replace(/\/+$/, "");


    return `/${cleanFolder}/index.html`;

}


/* =====================================================
   UPDATE SECTION COUNTS
===================================================== */

function updateCounts(games) {

    Object.entries(sections).forEach(
        ([sectionName, section]) => {

            const count =
                games.filter(
                    game =>
                        game.section ===
                        sectionName
                ).length;


            const element =
                document.getElementById(
                    section.count
                );


            if (!element) return;


            element.textContent =
                `${String(count).padStart(2, "0")} GAMES`;

        }
    );

}


/* =====================================================
   MORE GAMES INITIALIZATION
===================================================== */

function initializeMoreGames() {

    /*
     * If the More Games section is not present,
     * do nothing.
     */

    if (!allGamesGrid) return;


    /*
     * Show total catalogue size.
     */

    updateAllGamesCount();


    /*
     * Initial catalogue render.
     */

    applyFilters();


    /*
     * Search.
     */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            handleSearch
        );

    }


    /*
     * Clear search.
     */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            clearGameSearch
        );

    }


    /*
     * Category filters.
     */

    if (filtersContainer) {

        filtersContainer.addEventListener(
            "click",
            handleCategoryClick
        );

    }


    /*
     * Sorting.
     */

    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            handleSort
        );

    }


    /*
     * Reset button.
     */

    if (resetSearch) {

        resetSearch.addEventListener(
            "click",
            resetGameBrowser
        );

    }


    /*
     * Load More.
     */

    if (loadMoreButton) {

        loadMoreButton.addEventListener(
            "click",
            loadMoreGames
        );

    }

}


/* =====================================================
   SEARCH
===================================================== */

function handleSearch(event) {

    activeSearch =
        event.target.value
            .trim()
            .toLowerCase();


    visibleGames =
        GAMES_PER_PAGE;


    updateClearButton();

    applyFilters();

}


/* =====================================================
   CLEAR SEARCH
===================================================== */

function clearGameSearch() {

    if (!searchInput) return;


    searchInput.value = "";

    activeSearch = "";

    visibleGames =
        GAMES_PER_PAGE;


    updateClearButton();

    applyFilters();


    searchInput.focus();

}


/* =====================================================
   CLEAR BUTTON VISIBILITY
===================================================== */

function updateClearButton() {

    if (!clearSearch) return;


    clearSearch.hidden =
        activeSearch.length === 0;

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function handleCategoryClick(event) {

    const button =
        event.target.closest(
            "[data-category]"
        );


    if (!button) return;


    activeCategory =
        String(
            button.dataset.category || "all"
        )
            .trim()
            .toLowerCase();


    /*
     * Update active button.
     */

    document
        .querySelectorAll(
            ".game-filter"
        )
        .forEach(filter => {

            filter.classList.toggle(
                "active",
                filter === button
            );

        });


    visibleGames =
        GAMES_PER_PAGE;


    applyFilters();

}


/* =====================================================
   SORTING
===================================================== */

function handleSort(event) {

    activeSort =
        event.target.value || "featured";


    visibleGames =
        GAMES_PER_PAGE;


    applyFilters();

}


/* =====================================================
   APPLY SEARCH + CATEGORY + SORT
===================================================== */

function applyFilters() {

    let results =
        [...allGames];


    /*
     * SEARCH
     *
     * Search across:
     *
     * • title
     * • category
     * • description
     * • tags
     * • id
     */

    if (activeSearch) {

        results =
            results.filter(game => {

                const searchableText =
                    [

                        game.title,

                        game.category,

                        game.description,

                        game.id,

                        Array.isArray(game.tags)
                            ? game.tags.join(" ")
                            : game.tags

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                return searchableText
                    .includes(activeSearch);

            });

    }


    /*
     * CATEGORY
     */

    if (
        activeCategory &&
        activeCategory !== "all"
    ) {

        results =
            results.filter(game => {

                return normalizeCategory(
                    game.category
                ) === activeCategory;

            });

    }


    /*
     * SORT
     */

    results =
        sortGames(
            results,
            activeSort
        );


    /*
     * Save filtered catalogue.
     */

    filteredGames =
        results;


    /*
     * Render.
     */

    renderAllGames();


    /*
     * Update result information.
     */

    updateResultsLabel();


    /*
     * Update load button.
     */

    updateLoadMoreButton();


    /*
     * Show/hide empty state.
     */

    updateEmptyState();

}


/* =====================================================
   SORT GAMES
===================================================== */

function sortGames(games, sortType) {

    const sorted =
        [...games];


    switch (sortType) {


        case "az":

            sorted.sort(
                (a, b) =>
                    String(a.title)
                        .localeCompare(
                            String(b.title)
                        )
            );

            break;


        case "newest":

            sorted.sort(
                (a, b) => {

                    const dateA =
                        Date.parse(
                            a.dateAdded || ""
                        ) || 0;


                    const dateB =
                        Date.parse(
                            b.dateAdded || ""
                        ) || 0;


                    return dateB - dateA;

                }
            );

            break;


        case "random":

            shuffleArray(sorted);

            break;


        case "featured":

        default:

            sorted.sort(
                (a, b) => {

                    const featuredA =
                        a.featured === true
                            ? 1
                            : 0;


                    const featuredB =
                        b.featured === true
                            ? 1
                            : 0;


                    if (
                        featuredA !==
                        featuredB
                    ) {

                        return (
                            featuredB -
                            featuredA
                        );

                    }


                    return String(a.title)
                        .localeCompare(
                            String(b.title)
                        );

                }
            );

            break;

    }


    return sorted;

}


/* =====================================================
   SHUFFLE
===================================================== */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }

}


/* =====================================================
   RENDER ALL GAMES
===================================================== */

function renderAllGames() {

    if (!allGamesGrid) return;


    allGamesGrid.innerHTML = "";


    /*
     * Only create cards for games currently visible.
     *
     * This is important for 1,000+ games.
     */

    const gamesToRender =
        filteredGames.slice(
            0,
            visibleGames
        );


    gamesToRender.forEach(game => {

        allGamesGrid.appendChild(
            createGameCard(game)
        );

    });

}


/* =====================================================
   LOAD MORE
===================================================== */

function loadMoreGames() {

    if (
        visibleGames >=
        filteredGames.length
    ) {

        return;

    }


    visibleGames +=
        GAMES_PER_PAGE;


    renderAllGames();

    updateLoadMoreButton();

}


/* =====================================================
   LOAD MORE BUTTON
===================================================== */

function updateLoadMoreButton() {

    if (!loadMoreButton) return;


    const remaining =
        filteredGames.length -
        visibleGames;


    if (remaining <= 0) {

        loadMoreButton.disabled =
            true;

        loadMoreButton.textContent =
            "ALL GAMES LOADED";

        return;

    }


    loadMoreButton.disabled =
        false;


    loadMoreButton.textContent =
        `LOAD MORE GAMES (${remaining} LEFT)`;

}


/* =====================================================
   RESULTS LABEL
===================================================== */

function updateResultsLabel() {

    if (!resultsLabel) return;


    const total =
        filteredGames.length;


    if (activeSearch) {

        resultsLabel.textContent =
            `${total} ${
                total === 1
                    ? "GAME"
                    : "GAMES"
            } FOUND FOR "${activeSearch.toUpperCase()}"`;

        return;

    }


    if (
        activeCategory &&
        activeCategory !== "all"
    ) {

        resultsLabel.textContent =
            `${total} ${
                total === 1
                    ? "GAME"
                    : "GAMES"
            } IN ${activeCategory.toUpperCase()}`;

        return;

    }


    resultsLabel.textContent =
        `SHOWING ${Math.min(
            visibleGames,
            total
        )} OF ${total} GAMES`;

}


/* =====================================================
   TOTAL GAME COUNT
===================================================== */

function updateAllGamesCount() {

    if (!allGamesCount) return;


    const count =
        allGames.length;


    allGamesCount.textContent =
        `${String(count).padStart(2, "0")} GAMES`;

}


/* =====================================================
   EMPTY RESULTS
===================================================== */

function updateEmptyState() {

    if (!noResults) return;


    const hasResults =
        filteredGames.length > 0;


    noResults.hidden =
        hasResults;


    if (allGamesGrid) {

        allGamesGrid.hidden =
            !hasResults;

    }


    if (
        loadMoreButton &&
        !hasResults
    ) {

        loadMoreButton.style.display =
            "none";

    } else if (loadMoreButton) {

        loadMoreButton.style.display =
            "";

    }

}


/* =====================================================
   RESET ENTIRE GAME BROWSER
===================================================== */

function resetGameBrowser() {

    activeSearch = "";

    activeCategory = "all";

    activeSort = "featured";

    visibleGames =
        GAMES_PER_PAGE;


    if (searchInput) {

        searchInput.value = "";

    }


    if (sortSelect) {

        sortSelect.value =
            "featured";

    }


    document
        .querySelectorAll(
            ".game-filter"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                String(
                    button.dataset.category
                ).toLowerCase() === "all"
            );

        });


    updateClearButton();

    applyFilters();

}


/* =====================================================
   NORMALIZE CATEGORY
===================================================== */

function normalizeCategory(category) {

    return String(
        category || ""
    )
        .trim()
        .toLowerCase();

}


/* =====================================================
   ERROR MESSAGE
===================================================== */

function showLoadError() {

    /*
     * Existing homepage sections.
     */

    Object.values(sections).forEach(
        section => {

            const container =
                document.getElementById(
                    section.container
                );


            if (!container) return;


            container.innerHTML = `

                <p style="
                    color: #858b98;
                    font-size: 13px;
                    padding: 20px 0;
                ">
                    Games could not be loaded.
                    Please refresh the page.
                </p>

            `;

        }
    );


    /*
     * More Games section.
     */

    if (allGamesGrid) {

        allGamesGrid.innerHTML = `

            <p style="
                grid-column: 1 / -1;
                color: #858b98;
                font-size: 13px;
                padding: 20px 0;
            ">
                Games could not be loaded.
                Please refresh the page.
            </p>

        `;

    }

}


/* =====================================================
   BASIC HTML ESCAPING
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   ATTRIBUTE ESCAPING
===================================================== */

function escapeAttribute(value) {

    return escapeHTML(value);

}

});

