window.addEventListener('DOMContentLoaded', function () {
    // Set up canvas
    const canvas = document.getElementById('slingshotCanvas');
    canvas.width = 1100;
    canvas.height = 600;
    
    // Create Matter.js engine and renderer
    const Engine = window.Matter.Engine,
        Render = window.Matter.Render,
        Runner = window.Matter.Runner,
        Bodies = window.Matter.Bodies,
        Composite = window.Matter.Composite,
        Composites = window.Matter.Composites,
        Constraint = window.Matter.Constraint,
        Mouse = window.Matter.Mouse,
        MouseConstraint = window.Matter.MouseConstraint,
        Events = window.Matter.Events;

    const engine = Engine.create();
    const world = engine.world;

    // Use the existing canvas for rendering
    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: canvas.width,
            height: canvas.height,
            wireframes: false,
            background: '#f0f0f0',
        }
    });

    // Ground
    const ground = Bodies.rectangle(700, 550, 400, 20, { isStatic: true, render: { fillStyle: '#888' } });

    // Slingshot ball
    let ball = Bodies.circle(200, 400, 20, {
        density: 0.004,
        restitution: 0.8,
        render: { fillStyle: '#ff45ff' }
    });

    // Slingshot constraint
    const sling = Constraint.create({
        pointA: { x: 200, y: 400 },
        bodyB: ball,
        stiffness: 0.05,
        render: {
            strokeStyle: '#ff45ff',
            lineWidth: 4
        }
    });

    // Stack of shapes to knock down
    const stack = Composites.stack(600, 100, 5, 6, 0, 0, function (x, y) {
        return Bodies.polygon(x, y, 8, 18, {
            restitution: 0.4,
            render: { fillStyle: '#8ecae6' }
        });
    });

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.02,
            render: { visible: false }
        }
    });
    render.mouse = mouse;

    // Add all bodies and constraints to the world
    Composite.add(world, [ground, ball, sling, stack, mouseConstraint]);

    // Ball reset logic
    let firing = false;
    Events.on(mouseConstraint, 'enddrag', function (e) {
        if (e.body === ball) firing = true;
    });
    Events.on(engine, 'afterUpdate', function () {
        if (firing && Math.abs(ball.position.x - 200) < 20 && Math.abs(ball.position.y - 400) < 20) {
            ball = Bodies.circle(200, 400, 20, {
                density: 0.004,
                restitution: 0.8,
                render: { fillStyle: '#ff45ff' }
            });
            Composite.add(world, ball);
            sling.bodyB = ball;
            firing = false;
        }
    });

    // Run engine and renderer
    Engine.run(engine);
    Render.run(render);
});