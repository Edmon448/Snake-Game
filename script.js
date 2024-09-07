$(document).ready(function() {
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    const eatSound = $("#eatSound")[0];
    const gameOverSound = $("#gameOverSound")[0];
    const backgroundMusic = $("#backgroundMusic")[0];

    const tileSize = 20;
    const canvasWidth = gameCanvas.width = 400;
    const canvasHeight = gameCanvas.height = 400;

    let snake = [{x: 100, y: 100}];
    let direction = {x: 0, y: 0};
    let food = {x: 200, y: 200};
    let score = 0;
    let elapsedTime = 0;
    let gameInterval;
    let timerInterval;
    let gameStarted = false;
    let difficulty = 'easy';

    const highestFoodEatenKey = "highestFoodEaten";
    const longestTimeKey = "longestTime";

    let highestFoodEaten = localStorage.getItem(highestFoodEatenKey) || 0;
    let longestTime = localStorage.getItem(longestTimeKey) || 0;

    $("#highestFoodEaten").text(highestFoodEaten);
    $("#longestTime").text(longestTime);

    $("#easyBtn").on("click", function() {
        difficulty = 'easy';
        $("#startButton").prop('disabled', false);
    });

    $("#mediumBtn").on("click", function() {
        difficulty = 'medium';
        $("#startButton").prop('disabled', false);
    });

    $("#hardBtn").on("click", function() {
        difficulty = 'hard';
        $("#startButton").prop('disabled', false);
    });

    $("#startButton").on("click", function() {
        if (!gameStarted) {
            resetGame();
            backgroundMusic.play();
            gameInterval = setInterval(updateGame, difficulty === 'easy' ? 150 : (difficulty === 'medium' ? 100 : 70));
            timerInterval = setInterval(updateElapsedTime, 1000);
            direction = {x: 1, y: 0};
            gameStarted = true;
        }
    });

    function resetGame() {
        snake = [{x: 100, y: 100}];
        direction = {x: 0, y: 0};
        placeFood();
        score = 0;
        elapsedTime = 0;
        $("#currentScore").text(score);
        $("#elapsedTime").text(elapsedTime);
    }

    function updateGame() {
        const head = {x: snake[0].x + direction.x * tileSize, y: snake[0].y + direction.y * tileSize};
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            eatSound.play();
            score++;
            $("#currentScore").text(score);
            placeFood();
        } else {
            snake.pop();
        }

        if (isGameOver(head)) {
            endGame();
        }

        drawGame();
    }

    function updateElapsedTime() {
        elapsedTime++;
        $("#elapsedTime").text(elapsedTime);
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * (canvasWidth / tileSize)) * tileSize,
            y: Math.floor(Math.random() * (canvasHeight / tileSize)) * tileSize
        };
    }

    function drawGame() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? "green" : "limegreen";
            ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
        });

        ctx.font = "20px Arial";
        ctx.fillText("🍎", food.x, food.y + tileSize);
    }

    function isGameOver(head) {
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) return true;
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) return true;
        }
        return false;
    }

    function endGame() {
        backgroundMusic.pause();
        gameOverSound.play();
        clearInterval(gameInterval);
        clearInterval(timerInterval);

        if (score > highestFoodEaten) {
            localStorage.setItem(highestFoodEatenKey, score);
            $("#highestFoodEaten").text(score);
        }

        if (elapsedTime > longestTime) {
            localStorage.setItem(longestTimeKey, elapsedTime);
            $("#longestTime").text(elapsedTime);
        }

        // Update score popup values
        $("#popupCurrentScore").text(score);
        $("#popupHighestFoodEaten").text(highestFoodEaten);
        $("#popupLongestTime").text(longestTime);

        gameStarted = false;
    }

    $(document).on("keydown", function(event) {
        switch(event.which) {
            case 37: // left
                if (direction.x === 0) direction = {x: -1, y: 0};
                break;
            case 38: // up
                if (direction.y === 0) direction = {x: 0, y: -1};
                break;
            case 39: // right
                if (direction.x === 0) direction = {x: 1, y: 0};
                break;
            case 40: // down
                if (direction.y === 0) direction = {x: 0, y: 1};
                break;
        }
    });

    // Leaderboard modal functionality
    const leaderboardModal = document.getElementById("leaderboardModal");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const closeBtn = document.getElementsByClassName("close")[0];

    leaderboardBtn.onclick = function() {
        leaderboardModal.style.display = "block";
        loadLeaderboard();
    }

    closeBtn.onclick = function() {
        leaderboardModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === leaderboardModal) {
            leaderboardModal.style.display = "none";
        }
    }

    function loadLeaderboard() {
        // Mock leaderboard data
        const leaderboardData = [
            {name: "Player 1", score: 100},
            {name: "Player 2", score: 90},
            {name: "Player 3", score: 80}
        ];

        const leaderboardList = $("#leaderboardList");
        leaderboardList.empty();
        leaderboardData.forEach(player => {
            leaderboardList.append(`<li>${player.name}: ${player.score}</li>`);
        });
    }

    // Score popup functionality
    const scoreModal = document.getElementById("scoreModal");
    const scorePopupBtn = document.getElementById("scorePopupBtn");
    const scoreCloseBtn = document.getElementsByClassName("close")[1];

    scorePopupBtn.onclick = function() {
        scoreModal.style.display = "block";
        $("#popupCurrentScore").text(score);
        $("#popupHighestFoodEaten").text(highestFoodEaten);
        $("#popupLongestTime").text(longestTime);
    }

    scoreCloseBtn.onclick = function() {
        scoreModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === scoreModal) {
            scoreModal.style.display = "none";
        }
    }
});