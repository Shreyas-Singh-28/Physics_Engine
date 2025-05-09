const canvas = document.getElementById('gravityCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let bodies = [];
const G = 0.1; // Gravitational constant

function Body(x, y, mass, radius, vx, vy) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
}

Body.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Body.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};

// Update gravity to act downwards
function calculateGravity() {
    bodies.forEach(body => {
        body.vy += G; // Gravity acts downwards
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    calculateGravity();
    bodies.forEach(body => {
        body.update();
        body.draw();
    });
    requestAnimationFrame(animate);
}

document.getElementById('addBody').addEventListener('click', () => {
    const mass = parseInt(document.getElementById('mass').value);
    const radius = parseInt(document.getElementById('radius').value);
    const velocity = parseInt(document.getElementById('velocity').value);

    bodies.push(new Body(canvas.width / 2, canvas.height / 2, mass, radius, velocity, velocity));
});

document.getElementById('resetCanvas').addEventListener('click', () => {
    bodies = [];
});

animate();
