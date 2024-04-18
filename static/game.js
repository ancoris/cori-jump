// Define constants
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 400;
const GRAVITY = 0.7;
const SCROLL_SPEED = 3;
const SCORE_INCREMENT = 8;
const COLUMN_WIDTH = 60; // Width of the columns
const COLUMN_TEXTURE_WIDTH = 30; // Width of the column texture
const COLUMN_TEXTURE_HEIGHT = 30; // Height of the column texture

// Define player properties
let player = {
    x: 50,
    y: CANVAS_HEIGHT - 600,
    width: 50,
    height: 50,
    velocityY: 0,
    score: 0,
    isAlive: true
};

// Define obstacles
let obstacles = [];
let collectibles = [];

// Initialize canvas
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Load images
let playerImg = new Image();
playerImg.src = 'static/cori.png';

let pinkSquareImg = new Image();
pinkSquareImg.src = 'static/m2K9A0A0Z5G6H7H7.png';

let columnImg = new Image();
columnImg.src = 'static/sauce3.png';

let backgroundImage = new Image();
backgroundImage.src = 'static/background2.jpg'; // Path to your background image

// Gap width between columns
const GAP_WIDTH = 150; // Adjust this value for the desired gap width

// Handle player jump
function jump() {
    if (player.isAlive && (player.y + player.height >= CANVAS_HEIGHT || player.velocityY !== 0)) {
        player.velocityY = -9; // Adjust this value for jump height
    }
}

// Check for collision between two rectangles
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Main game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background image
    ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update player position
    player.y += player.velocityY;
    player.velocityY += GRAVITY;

    // Ensure player stays above or at the floor level
    if (player.y + player.height > CANVAS_HEIGHT) {
        player.y = CANVAS_HEIGHT - player.height;
        player.velocityY = 0;
    }

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Draw floor
    ctx.fillStyle = "gray";
    ctx.fillRect(0, CANVAS_HEIGHT - 10, CANVAS_WIDTH, 10);

    // Scroll the screen
    if (player.x > CANVAS_WIDTH / 2) {
        player.x -= SCROLL_SPEED;
    }

    // Generate obstacles and collectibles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < CANVAS_WIDTH - COLUMN_WIDTH * 4 - GAP_WIDTH) {
        // Calculate the x-coordinate of the new column
        let xCoordinate = obstacles.length > 0 ? obstacles[obstacles.length - 1].x + COLUMN_WIDTH * 3 + GAP_WIDTH : CANVAS_WIDTH;

        // Height of the top column
        let topColumnHeight = (0.4 + Math.random()) * (CANVAS_HEIGHT - GAP_WIDTH);

        // Top column
        let topObstacle = {
            x: xCoordinate,
            y: 0,
            width: COLUMN_WIDTH,
            height: topColumnHeight,
            gapEndY: topColumnHeight // Y-coordinate of the end of the gap
        };

        // Bottom column
        let bottomObstacle = {
            x: xCoordinate,
            y: topColumnHeight + GAP_WIDTH, // Place the bottom column below the gap
            width: COLUMN_WIDTH,
            height: CANVAS_HEIGHT - topColumnHeight - GAP_WIDTH
        };

        obstacles.push(topObstacle, bottomObstacle);

        // Generate collectibles (pink blocks) in the gap
        let collectibleX = xCoordinate + (COLUMN_WIDTH - 20) / 2; // X-coordinate of the collectible, horizontally centered in the gap
        let collectibleY = topColumnHeight + (GAP_WIDTH - 20) / 2; // Y-coordinate of the collectible, vertically centered in the gap
        let collectible = {
            x: collectibleX,
            y: collectibleY,
            width: 20,
            height: 20
        };
        collectibles.push(collectible);
    }

    // Update and draw obstacles
    obstacles.forEach(function (obstacle) {
        obstacle.x -= SCROLL_SPEED;
        // Draw the column image stretched to the height of the column
        ctx.drawImage(columnImg, obstacle.x, obstacle.y, COLUMN_WIDTH, obstacle.height);

        // Check for collision with player
        if (checkCollision(player, obstacle)) {
            player.isAlive = false;
            gameOver();
        }
    });

    // Update and draw collectibles
    collectibles.forEach(function (collectible, index) {
        collectible.x -= SCROLL_SPEED;
        ctx.drawImage(pinkSquareImg, collectible.x, collectible.y, collectible.width, collectible.height);

        // Check for collision with player
        if (checkCollision(player, collectible)) {
            player.score += 10; // Increase score by 10
            collectibles.splice(index, 1); // Remove collected collectible
        }
    });

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + player.score, 10, 30);

    // Request next frame
    if (player.isAlive) {
        requestAnimationFrame(gameLoop);
    }
}

// Game over
function gameOver() {
    alert("Game over! Final score: " + player.score);
    location.reload(); // Reload the page to restart the game
}

// Event listeners
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        jump();
    }
});

// Start the game loop
gameLoop();
