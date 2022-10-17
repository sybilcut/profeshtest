class Game {
    constructor(state) {
        this.state = state;
        this.snakeCoords = [];
        this.playing = false;
        this.nextBody = [0,0];
        this.timePassed = 0.0;

        //powerup variables and parameters    
        this.powerupCoords = [0,0];    

        //control parameters
        this.gameSpeed = 0.5;                         

        // Controller 
        this.controller = {
            "KeyW": {pressed: false},
            "KeyA": {pressed: false},
            "KeyS": {pressed: false},
            "KeyD": {pressed: false},  
            "Space": {pressed: false},  
        };
    }
    
    // runs once on startup after the scene loads the objects
    async onStart() {
        console.log("Snake - WASD Controls")
        // this just prevents the context menu from popping up when you right click
        document.addEventListener("contextmenu", (e) => {
            //e.preventDefault();
        }, false);
        //event listener for keys are pressed
        document.addEventListener("keydown", (e) => {
            //e.preventDefault();
            if (this.controller[e.code]){
                this.controller[e.code].pressed = true;
            }
        });
        //event listener for if keys are released
        document.addEventListener("keyup", (e) => {
            //e.preventDefault();
            if (this.controller[e.code]){
                this.controller[e.code].pressed = false;
            }
        });
        
        this.startGame();
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {
        // Allow a couple of controls outside of game loop
        //space: start game
        //LShift: change camera
        //not a sustainable block of code but we shouldnt need to expand it -B
        if (!this.playing){
            if (this.controller['Space'].pressed){
                this.startGame();
			}
        }
        else{
            //loop through values in the controller and apply movement if the keys are being held down
            Object.keys(this.controller).forEach(key=> {
                if(this.controller[key].pressed){
                    switch(key){
                        case 'KeyW':
                            if(this.lastDirection != "down"){
                                this.direction = "up";
                            }
                            break;
                        case 'KeyA':
                            if(this.lastDirection != "right"){
                                this.direction = "left";
                            }
                            break;
                        case 'KeyS':
                            if(this.lastDirection != "up"){
                                this.direction = "down";
                            }
                            break;
                        case 'KeyD':
                            if(this.lastDirection != "left"){
                                this.direction = "right";
                            }
                            break;
                        default:
                            break;     
                    }
                }
                //update cameratoggle variable on keyup
                //allows for another camera key press upon release
                if(!this.controller[key].pressed){
                    switch(key){
                        case 'KeyW':
                            break;
                        case 'KeyA':
                            break;
                        case 'KeyS':
                            break;
                        case 'KeyD':
                            break;
                        default:
                            break;        
                    }
                }
            });

            this.timePassed += deltaTime;
            if (this.timePassed > this.gameSpeed){
                this.timePassed = 0;
                this.moveSnake();
                this.interact();
            }
        
        }
    }

    adjustSnake(){
        this.nextBody = this.snakeCoords[this.snakeCoords.length-1];
        for (let i=this.snakeCoords.length-1; i>0; i--){
            this.snakeCoords[i] = this.snakeCoords[i-1];
        }
    }

    moveSnake(){
        this.adjustSnake();
        switch (this.direction){
            
            case "up":
                if (this.snakeCoords[0][1]-1 > 0 ){
                    this.snakeCoords[0] = [this.snakeCoords[0][0],this.snakeCoords[0][1]-1];
                }else{this.gameOver();}
                break;

            case "down":
                if (this.snakeCoords[0][1]+1 < 8){
                    this.snakeCoords[0] = [this.snakeCoords[0][0],this.snakeCoords[0][1]+1];
                }else{this.gameOver();}
                break;

            case "left":
                if (this.snakeCoords[0][0]-1 > 0){
                    this.snakeCoords[0] = [this.snakeCoords[0][0]-1,this.snakeCoords[0][1]];
                }else{this.gameOver();}
                break;

            case "right":
                if (this.snakeCoords[0][0]+1 < 8){
                    this.snakeCoords[0] = [this.snakeCoords[0][0]+1,this.snakeCoords[0][1]];
                }else{this.gameOver();}
                break;
            case "default":
                break;
        }
        this.lastDirection=this.direction;
        this.setObjectPositions();
    }

    interact(){
        console.log(this.snakeCoords[0]);
        for (let i=1; i<this.snakeCoords.length; i++){
            if (this.snakeCoords[i][0] == this.snakeCoords[0][0] && this.snakeCoords[i][1] == this.snakeCoords[0][1]){
                this.gameOver();
            }else if(this.snakeCoords[0][0] == this.powerupCoords[0] && this.snakeCoords[0][1] == this.powerupCoords[1]){
                this.makeSnakePiece();
                this.movePowerup();
            }
        }
    }

    setObjectPositions(){
        for (let i=0;i<this.snake.length; i++){
            this.snake[i].style.gridRow = this.snakeCoords[i][1];
            this.snake[i].style.gridColumn = this.snakeCoords[i][0];
        }
    }

    //start game, it's exactly what it sounds like
    //called upon space bar press when game is not running
    startGame(){
        if (this.snake != null){
            for (let i=3; i<this.snake.length; i++){
                this.snake[i].remove();
            }
        }
        
        this.spaces = [];
        for (let x=1;x<7;x++){
            for (let y=1;y<7;y++){
                this.spaces.push([x,y]);
            }
        }
        this.lastDirection = "up";
        this.direction = "up";
        this.snake = [document.getElementById("snakeHead"),
                        document.getElementById("snakeBody0"),
                        document.getElementById("snakeBody1")];
        this.powerup = document.getElementById("powerup");
        this.snakeCoords = [[4,4],[4,5],[4,6]];
        this.movePowerup();
        this.nextBody = [4,4];
        this.setObjectPositions();
        this.playing = true;
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    movePowerup(){
        let choices = [...this.spaces];
        choices = choices.filter(coord => {
            for (let j=0; j<this.snakeCoords.length; j++){
                if (coord[0] == this.snakeCoords[j][1] && 
                    coord[1] == this.snakeCoords[j][0]){
                        console.log(coord + " " + this.snakeCoords[j]);
                        return false;
                }
            }
            return true;
        })
        console.log(choices)
        //this.powerupCoords = choices[this.getRandomIntInclusive(0,choices.length)];
        console.log(this.powerupCoords + " powerup before");
        this.powerupCoords = choices[this.getRandomIntInclusive(0,choices.length-1)];
        console.log(this.powerupCoords + " powerup after");
        this.powerup.style.gridRow = this.powerupCoords[1];
        this.powerup.style.gridColumn = this.powerupCoords[0];

    }

    makeSnakePiece(){
        this.snakeCoords.push(this.nextBody);
        let snakePiece = document.createElement("div");
        snakePiece.id = '$snakeBody{this.snake.length+2}'
        snakePiece.style.gridColumn = this.nextBody[0];
        snakePiece.style.gridRow = this.nextBody[1];
        snakePiece.style.border = "2px solid black"
        snakePiece.style.backgroundColor = "#14911e"
        snakePiece.style.setProperty("filter", "drop-shadow(4px 3px 0px #000000)");
        this.snake.push(snakePiece);
        this.state.gameBoard.append(snakePiece);
    }

    //halt game loop and display score
    //called upon collision of the player obj -B
    gameOver(){
        this.playing = false;
        console.log("Press space to restart");
	}
}
