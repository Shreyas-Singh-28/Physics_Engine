const canvas = document.getElementById('gravityCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let rectangles = [];
const gravity = 0.7;

// Predefined rectangles stacked at the bottom
function addPredefinedRectangles() {
    const baseY = canvas.height;
    const breadth = 40;
    const rects = [
        { length: 160, breadth: breadth, color: '#e67e22' },
        { length: 100, breadth: breadth, color: '#27ae60' }
    ];
    let y = baseY;
    for (let i = 0; i < rects.length; i++) {
        y -= rects[i].breadth;
        rectangles.push({
            x: (canvas.width - rects[i].length) / 2,
            y: y,
            length: rects[i].length,
            breadth: rects[i].breadth,
            vy: 0,
            color: rects[i].color,
            isStatic: true
        });
    }
}
addPredefinedRectangles();

function addFallingRectangle(length, breadth) {
    // Drop in a central range (center 50% of canvas)
    const minX = canvas.width * 0.25;
    const maxX = canvas.width * 0.75 - length;
    const x = Math.random() * (maxX - minX) + minX;
    rectangles.push({
        x: x,
        y: 0,
        length,
        breadth,
        vy: 0,
        color: '#f39c12',
        isStatic: false
    });
}

document.getElementById('addRect').addEventListener('click', () => {
    const length = parseInt(document.getElementById('rectLength').value);
    const breadth = parseInt(document.getElementById('rectBreadth').value);
    addFallingRectangle(length, breadth);
});

function updateRectangles() {
    for (let i = 0; i < rectangles.length; i++) {
        const rect = rectangles[i];
        if (!rect.isStatic) {
            rect.vy += gravity;
            rect.y += rect.vy;
            // Floor collision
            if (rect.y + rect.breadth > canvas.height) {
                rect.y = canvas.height - rect.breadth;
                rect.vy = 0;
                rect.isStatic = true;
            }
            // Collision with static rectangles
            for (let j = 0; j < rectangles.length; j++) {
                if (i !== j && rectangles[j].isStatic) {
                    const other = rectangles[j];
                    if (
                        rect.x < other.x + other.length &&
                        rect.x + rect.length > other.x &&
                        rect.y + rect.breadth > other.y &&
                        rect.y < other.y + other.breadth &&
                        rect.vy > 0
                    ) {
                        rect.y = other.y - rect.breadth;
                        rect.vy = 0;
                        rect.isStatic = true;
                        break;
                    }
                }
            }
        }
    }
}

function drawRectangles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(rect => {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.length, rect.breadth);
    });
}

function animate() {
    updateRectangles();
    drawRectangles();
    requestAnimationFrame(animate);
}

// On page load, clear rectangles and add only the two predefined blocks
rectangles = [];
addPredefinedRectangles();

animate();
