/* =========================================================
   THUNDERQUIZ
   GAME CATALOGUE
   Loads games from /data/games.json
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
     * Section configuration
     */

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
     * Load games.json
     */

    loadGames();


    async function loadGames() {

        try {

            const response =
                await fetch("/data/games.json", {
                    cache: "no-cache"
                });


            if (!response.ok) {

                throw new Error(
                    `HTTP error ${response.status}`
                );

            }


            const data =
                await response.json();


            /*
             * Make sure games exists
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
             * Only show active games
             */

            const games =
                data.games.filter(
                    game =>
                        game.active !== false
                );


            /*
             * Render games
             */

            renderGames(games);


            /*
             * Update section counts
             */

            updateCounts(games);


            console.log(
                `ThunderQuiz: ${games.length} games loaded.`
            );


        } catch (error) {

            console.error(
                "ThunderQuiz: Could not load games.json",
                error
            );

            showLoadError();

        }

    }


    /*
     * =====================================================
     * RENDER GAME CARDS
     * =====================================================
     */

    function renderGames(games) {

        /*
         * Clear existing cards
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
         * Create each game
         */

        games.forEach(game => {

            /*
             * Ignore malformed entries
             */

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

                return;

            }


            /*
             * Find section
             */

            const section =
                sections[game.section];


            if (!section) {

                console.warn(
                    `ThunderQuiz: Unknown section "${game.section}"`,
                    game
                );

                return;

            }


            const container =
                document.getElementById(
                    section.container
                );


            if (!container) {

                console.warn(
                    `ThunderQuiz: Missing container #${section.container}`
                );

                return;

            }


            /*
             * Create card
             */

            const card =
                document.createElement("a");


            card.className =
                "game-card";


            /*
             * Game URL
             */

            card.href =
                buildGameUrl(game.folder);


            /*
             * Accessibility

             */

            card.setAttribute(
                "aria-label",
                `Play ${game.title}`
            );


            /*
             * Card HTML
             */

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
                        ${escapeHTML(game.category)}
                    </span>

                </div>

            `;


            /*
             * Add card to section
             */

            container.appendChild(card);

        });

    }


    /*
     * =====================================================
     * BUILD GAME URL
     * =====================================================
     */

    function buildGameUrl(folder) {

        /*
         * Allows:
         *
         * "iq"
         *
         * to become:
         *
         * /iq/index.html
         */

        const cleanFolder =
            String(folder)
                .replace(/^\/+/, "")
                .replace(/\/+$/, "");


        return `/${cleanFolder}/index.html`;

    }


    /*
     * =====================================================
     * UPDATE GAME COUNTS
     * =====================================================
     */

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


    /*
     * =====================================================
     * ERROR MESSAGE
     * =====================================================
     */

    function showLoadError() {

        Object.values(sections).forEach(section => {

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

        });

    }


    /*
     * =====================================================
     * BASIC HTML ESCAPING
     * =====================================================
     *
     * Keeps text from games.json from being interpreted
     * as HTML.
     *
     */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /*
     * Escape values used inside HTML attributes.
     */

    function escapeAttribute(value) {

        return escapeHTML(value);

    }

});

