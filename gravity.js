const canvas = document.getElementById('gravityCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1100;
canvas.height = 500;

let objects = [];
let gravity = 10;

function getSettings() {
    return {
        shape: document.getElementById('shapeType').value,
        gravity: parseFloat(document.getElementById('gravityValue').value),
        size: parseInt(document.getElementById('objectSize').value)
    };
}

document.getElementById('gravityValue').addEventListener('input', function() {
    gravity = parseFloat(this.value);
});

canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { shape, size } = getSettings();
    if (shape === 'ball') {
        objects.push({
            type: 'ball',
            x: x,
            y: y,
            r: size / 2,
            vx: 0,
            vy: 0,
            color: getRandomColor()
        });
    } else {
        objects.push({
            type: 'square',
            x: x - size / 2,
            y: y - size / 2,
            size: size,
            vx: 0,
            vy: 0,
            color: getRandomColor()
        });
    }
});

document.getElementById('resetBtn').addEventListener('click', function() {
    objects = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function getRandomColor() {
    const colors = [
        '#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500',
        '#e63946', '#f1faee', '#a8dadc', '#457b9d', '#ff006e',
        '#8338ec', '#3a86ff', '#ffbe0b', '#ff006e', '#fb5607', '#ffb4a2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateObjects() {
    for (let obj of objects) {
        obj.vy += gravity * 0.05;
        obj.y += obj.vy;
        obj.x += obj.vx;
        if (obj.type === 'ball') {
            if (obj.y + obj.r > canvas.height) {
                obj.y = canvas.height - obj.r;
                obj.vy *= -0.5;
                if (Math.abs(obj.vy) < 1) obj.vy = 0;
            }
        } else if (obj.type === 'square') {
            if (obj.y + obj.size > canvas.height) {
                obj.y = canvas.height - obj.size;
                obj.vy *= -0.5;
                if (Math.abs(obj.vy) < 1) obj.vy = 0;
            }
        }
    }
}

function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let obj of objects) {
        ctx.fillStyle = obj.color;
        if (obj.type === 'ball') {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
            ctx.fill();
        } else if (obj.type === 'square') {
            ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
        }
    }
}

function animate() {
    updateObjects();
    drawObjects();
    requestAnimationFrame(animate);
}
animate();
