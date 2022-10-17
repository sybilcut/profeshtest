var state = {};
var game;
var sceneFile = "scene.json"; // can change this to be the name of your scene

// This function loads on window load, uses async functions to load the scene then try to render it
window.onload = async () => {
    try {
        //await parseSceneFile(`./statefiles/${sceneFile}`, state);
        //await parseSoundsFromSceneFile(`./statefiles/${sceneFile}`, state);
        main();
    } catch (err) {
        console.error(err);
        alert(err);
    }
}



/**
 * Main function that gets called when the DOM loads
 */
async function main() {
    //document.body.appendChild( stats.dom );
    const canvas = document.querySelector("#gameBoard");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /**
     * Initialize state with new values (some of these you can replace/change)
     */
    state = {
        ...state, // this just takes what was already in state and applies it here again
        gameBoard: canvas,
    };


    game = new Game(state);
    await game.onStart();
    let now = new Date();
    startUpdate();
}

function startUpdate(){
    let then = 0.0;
    function update(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;
    
        state.deltaTime = deltaTime;
        game.onUpdate(deltaTime); //constantly call our game loop
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

