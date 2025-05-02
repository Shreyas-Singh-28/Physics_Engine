// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies;
    
    // Create engine
    const engine = Engine.create();
    const world = engine.world;
    
    // Create renderer
    const canvas = document.getElementById('physicsCanvas');
    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false
        }
    });
    
    // Create objects
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    
    // Add all bodies to the world
    World.add(world, [boxA, boxB, ground]);
    
    // Run the engine
    Engine.run(engine);
    Render.run(render);
    
    // Add controls
    document.getElementById('gravityBtn').addEventListener('click', function() {
        engine.world.gravity.y = engine.world.gravity.y === 0 ? 1 : 0;
    });
    
    document.getElementById('collisionBtn').addEventListener('click', function() {
        const newBox = Bodies.rectangle(
            Math.random() * 400 + 200, 
            50, 
            80, 
            80
        );
        World.add(world, newBox);
    });
    
    document.getElementById('frictionSlider').addEventListener('input', function(e) {
        boxA.friction = parseFloat(e.target.value);
        boxB.friction = parseFloat(e.target.value);
    });
});
// Example of modifying physics parameters
function setElasticity(body, restitution) {
    body.restitution = restitution; // 0 = inelastic, 1 = perfectly elastic
}

// Example of custom force application
function applyForce(body, force) {
    Matter.Body.applyForce(body, body.position, force);
}