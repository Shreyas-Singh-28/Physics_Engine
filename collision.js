const canvas = document.getElementById('collisionCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let balls = [];

function Ball(x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.vx = 0;
    this.vy = 0;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Ball.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    // Wall collision
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.vx *= -1;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.vy *= -1;
    }
};

// Add collision simulation logic
Ball.prototype.checkCollision = function(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius + other.radius) {
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const v1 = { x: this.vx * cos + this.vy * sin, y: this.vy * cos - this.vx * sin };
        const v2 = { x: other.vx * cos + other.vy * sin, y: other.vy * cos - other.vx * sin };

        const temp = v1.x;
        v1.x = v2.x;
        v2.x = temp;

        this.vx = v1.x * cos - v1.y * sin;
        this.vy = v1.y * cos + v1.x * sin;
        other.vx = v2.x * cos - v2.y * sin;
        other.vy = v2.y * cos + v2.x * sin;
    }
};

// Allow user to control a ball
let selectedBall = null;

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    selectedBall = balls.find(ball => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
    });
});

document.addEventListener('keydown', (e) => {
    if (selectedBall) {
        const speed = 5;
        if (e.key === 'ArrowUp') selectedBall.vy -= speed;
        if (e.key === 'ArrowDown') selectedBall.vy += speed;
        if (e.key === 'ArrowLeft') selectedBall.vx -= speed;
        if (e.key === 'ArrowRight') selectedBall.vx += speed;
    }
});

// Update detectCollisions to use the new method
function detectCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            balls[i].checkCollision(balls[j]);
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
    detectCollisions();
    requestAnimationFrame(animate);
}

document.getElementById('addBall').addEventListener('click', () => {
    const radius = parseInt(document.getElementById('radius').value);
    const x = parseInt(document.getElementById('xCoord').value);
    const y = parseInt(document.getElementById('yCoord').value);
    const mass = parseInt(document.getElementById('mass').value);

    balls.push(new Ball(x, y, radius, mass));
});

document.getElementById('resetCanvas').addEventListener('click', () => {
    balls = [];
});

animate();
