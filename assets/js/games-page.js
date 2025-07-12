document.addEventListener('DOMContentLoaded', () => {
    const gameCardsContainer = document.getElementById('gameCardsContainer');

    // Define game data (matches the list and structure from plan)
    const gamesData = [
        { name: "Snake", slug: "snake", description: "Guide the growing snake to eat food, but don't hit the walls or yourself!", categories: ["Classic", "Arcade"], cardStyle: { backgroundColor: "#4CAF50", textColor: "#FFFFFF" } },
        { name: "BlockFall Challenge", slug: "blockfall-challenge", description: "Fit falling blocks together to clear lines in this iconic puzzle game.", categories: ["Puzzle", "Classic"], cardStyle: { backgroundColor: "#2196F3", textColor: "#FFFFFF" } },
        { name: "Pong Classic", slug: "pong-classic", description: "The original paddle and ball game. Simple, addictive, timeless.", categories: ["Classic", "Arcade", "2 Player"], cardStyle: { backgroundColor: "#343a40", textColor: "#FFFFFF" } },
        { name: "BrickBuster Retro", slug: "brickbuster-retro", description: "Control the paddle, break bricks, and catch power-ups.", categories: ["Arcade", "Classic"], cardStyle: { backgroundColor: "#fd7e14", textColor: "#FFFFFF" } },
        { name: "Minesweeper Classic", slug: "minesweeper-classic", description: "Use logic to find hidden mines and clear the board.", categories: ["Puzzle", "Logic", "Classic"], cardStyle: { backgroundColor: "#6c757d", textColor: "#FFFFFF" } },
        { name: "Dot Gobbler Maze", slug: "dot-gobbler-maze", description: "Navigate the maze, eat dots, and avoid the ghosts!", categories: ["Arcade", "Classic"], cardStyle: { backgroundColor: "#ffc107", textColor: "#212529" } },
        { name: "NumberMerge Challenge", slug: "numbermerge-challenge", description: "Slide tiles, combine numbers, and try to reach the 2048 tile.", categories: ["Puzzle", "Logic"], cardStyle: { backgroundColor: "#f2b179", textColor: "#FFFFFF" } },
        { name: "Tappy Plane Flyer", slug: "tappy-plane-flyer", description: "Tap to fly the plane through the tricky pipe obstacles.", categories: ["Arcade", "Skill"], cardStyle: { backgroundColor: "#87CEEB", textColor: "#212529" } },
        { name: "Memory Match Cards", slug: "memory-match-cards", description: "Flip cards to find matching pairs. Test your memory!", categories: ["Puzzle", "Memory"], cardStyle: { backgroundColor: "#6610f2", textColor: "#FFFFFF" } },
        { name: "WordGuesser Challenge", slug: "wordguesser-challenge", description: "Guess the hidden word, letter by letter. Classic Hangman fun.", categories: ["Puzzle", "Word"], cardStyle: { backgroundColor: "#0dcaf0", textColor: "#212529" } },
        { name: "Typing Ace Test", slug: "typing-ace-test", description: "Test and improve your typing speed and accuracy.", categories: ["Skill", "Educational"], cardStyle: { backgroundColor: "#d63384", textColor: "#FFFFFF" } },
        { name: "Tap-the-Target", slug: "tap-the-target-game", description: "Test your reflexes! Tap targets as they appear, but be quick!", categories: ["Arcade", "Skill"], cardStyle: { backgroundColor: "#20c997", textColor: "#FFFFFF" } },
        { name: "Pixel Jumper Adventure", slug: "pixel-jumper-adventure", description: "Jump across platforms, dodge dangers, and reach the finish line!", categories: ["Platformer", "Arcade"], cardStyle: { backgroundColor: "#198754", textColor: "#FFFFFF" } },
        { name: "Four-in-a-Row Connect", slug: "four-in-a-row-connect", description: "Drop discs and be the first to connect four in a line.", categories: ["Strategy", "Board", "2 Player"], cardStyle: { backgroundColor: "#0d6efd", textColor: "#FFFFFF" } },
        { name: "Coin Clicker Tycoon", slug: "coin-clicker-tycoon", description: "Click your way to riches! Buy upgrades and watch your empire grow.", categories: ["Idle", "Clicker", "Simulation"], cardStyle: { backgroundColor: "#ffda6a", textColor: "#495057" } }
    ];

    function displayGameCards() {
        if (!gameCardsContainer) {
            console.error("gameCardsContainer not found!");
            return;
        }
        gameCardsContainer.innerHTML = ''; // Clear any existing content

        gamesData.forEach(game => {
            const cardCol = document.createElement('div');
            // Responsive column classes
            cardCol.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch';

            const card = document.createElement('div');
            card.className = 'card game-card minimalist-card h-100 text-center shadow-sm'; // Added text-center and shadow
            // Apply custom styles from game data
            if (game.cardStyle) {
                card.style.backgroundColor = game.cardStyle.backgroundColor || '#f8f9fa';
                card.style.color = game.cardStyle.textColor || '#212529';
                // Ensure text is readable on custom backgrounds
                if (game.cardStyle.textColor === '#FFFFFF') {
                    card.classList.add('text-white');
                }
            }


            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column p-4'; // Added more padding

            const title = document.createElement('h3');
            title.className = 'card-title game-title mb-3'; // Larger margin bottom
            title.textContent = game.name;
            cardBody.appendChild(title);

            const description = document.createElement('p');
            description.className = 'card-text game-short-description flex-grow-1 small mb-3';
            description.textContent = game.description;
            cardBody.appendChild(description);

            if (game.categories && game.categories.length > 0) {
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'game-category-tags mt-2 mb-3';
                game.categories.forEach(cat => {
                    const tag = document.createElement('span');
                    tag.className = 'badge rounded-pill me-1';
                    // Basic styling for tags, can be enhanced in CSS
                    tag.style.backgroundColor = game.cardStyle.textColor || '#6c757d';
                    tag.style.color = game.cardStyle.backgroundColor || '#f8f9fa';
                    tag.textContent = cat;
                    tagsContainer.appendChild(tag);
                });
                cardBody.appendChild(tagsContainer);
            }

            const playButton = document.createElement('a');
            playButton.href = `games/${game.slug}`;
            playButton.className = 'btn btn-light mt-auto align-self-center stretched-link'; // Changed to btn-light for contrast on dark cards
             // Adjust button style based on card background for better contrast
            if (game.cardStyle && isDarkColor(game.cardStyle.backgroundColor)) {
                playButton.classList.remove('btn-dark');
                playButton.classList.add('btn-light');
            } else {
                playButton.classList.remove('btn-light');
                playButton.classList.add('btn-dark');
            }
            playButton.textContent = 'Play Now';
            cardBody.appendChild(playButton);

            card.appendChild(cardBody);
            cardCol.appendChild(card);
            gameCardsContainer.appendChild(cardCol);
        });
    }

    // Helper function to determine if a color is dark (for button contrast)
    function isDarkColor(hexcolor){
        if (!hexcolor || hexcolor.length < 4) return false; // Default to not dark if invalid
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return yiq < 128; // Return true if color is dark
    }


    // Initial display
    displayGameCards();

    // TODO: Add search/filter functionality here if it was part of the design plan
    // const searchInput = document.getElementById('gameSearchInput');
    // if (searchInput) { /* ... event listener ... */ }
});
