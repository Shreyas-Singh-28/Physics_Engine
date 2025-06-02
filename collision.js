const canvas = document.getElementById('collisionCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let balls = [
    new Ball(150, 200, 30, 20),
    new Ball(400, 400, 40, 30),
    new Ball(600, 100, 20, 10)
];

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

    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.vx *= -1;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.vy *= -1;
    }
};

Ball.prototype.checkCollision = function(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + other.radius) {
        const nx = dx / distance;
        const ny = dy / distance;
        const tx = -ny;
        const ty = nx;
        const v1n = this.vx * nx + this.vy * ny;
        const v1t = this.vx * tx + this.vy * ty;
        const v2n = other.vx * nx + other.vy * ny;
        const v2t = other.vx * tx + other.vy * ty;
        const m1 = this.mass;
        const m2 = other.mass;
        const v1nAfter = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        const v2nAfter = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);
        this.vx = v1nAfter * nx + v1t * tx;
        this.vy = v1nAfter * ny + v1t * ty;
        other.vx = v2nAfter * nx + v2t * tx;
        other.vy = v2nAfter * ny + v2t * ty;
        const overlap = 0.5 * (this.radius + other.radius - distance + 1);
        this.x -= overlap * nx;
        this.y -= overlap * ny;
        other.x += overlap * nx;
        other.y += overlap * ny;
    }
};

let selectedBall = null;
let controlledBall = null;

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    selectedBall = balls.find(ball => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
    });
    if (selectedBall) {
        showEditDeleteMenu(selectedBall, mouseX, mouseY);
    } else {
        hideEditDeleteMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (controlledBall) {
        const speed = 5;
        if (e.key === 'ArrowUp') {
            controlledBall.vx = 0;
            controlledBall.vy = -speed;
        }
        if (e.key === 'ArrowDown') {
            controlledBall.vx = 0;
            controlledBall.vy = speed;
        }
        if (e.key === 'ArrowLeft') {
            controlledBall.vx = -speed;
            controlledBall.vy = 0;
        }
        if (e.key === 'ArrowRight') {
            controlledBall.vx = speed;
            controlledBall.vy = 0;
        }
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
    const newBall = new Ball(x, y, radius, mass);
    // Set initial constant velocity (to the right)
    newBall.vx = 5;
    newBall.vy = 0;
    balls.push(newBall);
    controlledBall = newBall;
});

document.getElementById('resetCanvas').addEventListener('click', () => {
    balls = [
        new Ball(150, 200, 30, 20),
        new Ball(400, 300, 40, 30),
        new Ball(600, 100, 20, 10)
    ];
    controlledBall = null;
    hideEditDeleteMenu();
});

// Edit/Delete menu logic
function showEditDeleteMenu(ball, x, y) {
    let menu = document.getElementById('editDeleteMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'editDeleteMenu';
        menu.style.position = 'absolute';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #333';
        menu.style.padding = '0.5rem';
        menu.style.zIndex = 1000;
        menu.innerHTML = `
            <button id="editBallBtn">Edit</button>
            <button id="deleteBallBtn">Delete</button>
            <button id="controlBallBtn">Control</button>
        `;
        document.body.appendChild(menu);
    }
    menu.style.left = (canvas.offsetLeft + x + 10) + 'px';
    menu.style.top = (canvas.offsetTop + y + 10) + 'px';
    menu.style.display = 'block';

    document.getElementById('editBallBtn').onclick = function() {
        const newRadius = parseInt(prompt('New radius:', ball.radius));
        const newMass = parseInt(prompt('New mass:', ball.mass));
        if (!isNaN(newRadius)) ball.radius = newRadius;
        if (!isNaN(newMass)) ball.mass = newMass;
        hideEditDeleteMenu();
    };
    document.getElementById('deleteBallBtn').onclick = function() {
        balls = balls.filter(b => b !== ball);
        hideEditDeleteMenu();
    };
    document.getElementById('controlBallBtn').onclick = function() {
        controlledBall = ball;
        hideEditDeleteMenu();
    };
}

function hideEditDeleteMenu() {
    const menu = document.getElementById('editDeleteMenu');
    if (menu) menu.style.display = 'none';
}

animate();
