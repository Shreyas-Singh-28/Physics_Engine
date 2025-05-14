// 2D physics for rectangles: allow tilting, falling, and stacking realistically
const canvas = document.getElementById('gravityCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let rectangles = [];
const gravity = 0.7;
const restitution = 0.2; // little bounce

function addPredefinedRectangles() {
    const baseY = canvas.height;
    const breadth = 40;
    const rects = [
        { length: 160, breadth: breadth, color: '#e67e22' }, // orange
        { length: 100, breadth: breadth, color: '#27ae60' }  // green
    ];
    let y = baseY;
    for (let i = 0; i < rects.length; i++) {
        y -= rects[i].breadth;
        rectangles.push({
            x: (canvas.width - rects[i].length) / 2,
            y: y,
            length: rects[i].length,
            breadth: rects[i].breadth,
            angle: 0,
            vx: 0,
            vy: 0,
            omega: 0,
            color: rects[i].color,
            isStatic: false
        });
    }
}

function addFallingRectangle(length, breadth) {
    const minX = canvas.width * 0.25;
    const maxX = canvas.width * 0.75 - length;
    const x = Math.random() * (maxX - minX) + minX;
    rectangles.push({
        x: x,
        y: 0,
        length,
        breadth,
        angle: 0,
        vx: 0,
        vy: 0,
        omega: 0,
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
            rect.x += rect.vx;
            rect.y += rect.vy;
            rect.angle += rect.omega;
            // Floor collision
            if (rect.y + rect.breadth > canvas.height) {
                rect.y = canvas.height - rect.breadth;
                rect.vy *= -restitution;
                rect.vx *= 0.8;
                rect.omega *= 0.7;
                if (Math.abs(rect.vy) < 1) rect.vy = 0;
                if (Math.abs(rect.vy) === 0) rect.isStatic = true;
            }
            // Rectangle-rectangle collision (AABB, with tilt)
            for (let j = 0; j < rectangles.length; j++) {
                if (i !== j) {
                    const other = rectangles[j];
                    // Use axis-aligned bounding box for simplicity
                    if (
                        rect.x < other.x + other.length &&
                        rect.x + rect.length > other.x &&
                        rect.y + rect.breadth > other.y &&
                        rect.y < other.y + other.breadth &&
                        rect.vy > 0
                    ) {
                        // Only stack if center of mass is supported
                        const centerX = rect.x + rect.length / 2;
                        if (centerX > other.x && centerX < other.x + other.length) {
                            rect.y = other.y - rect.breadth;
                            rect.vy *= -restitution;
                            rect.vx *= 0.8;
                            rect.omega += (Math.random() - 0.5) * 0.1;
                            if (Math.abs(rect.vy) < 1) rect.vy = 0;
                            if (Math.abs(rect.vy) === 0) rect.isStatic = true;
                        } else {
                            // If not supported, let it rotate and fall off
                            rect.omega += (centerX < other.x ? -0.05 : 0.05);
                            rect.vx += (centerX < other.x ? -0.5 : 0.5);
                        }
                    }
                }
            }
        }
    }
}

function drawRectangles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(rect => {
        ctx.save();
        ctx.translate(rect.x + rect.length / 2, rect.y + rect.breadth / 2);
        ctx.rotate(rect.angle);
        ctx.fillStyle = rect.color;
        ctx.fillRect(-rect.length / 2, -rect.breadth / 2, rect.length, rect.breadth);
        ctx.restore();
    });
}

function animate() {
    updateRectangles();
    drawRectangles();
    requestAnimationFrame(animate);
}

rectangles = [];
addPredefinedRectangles();
animate();
