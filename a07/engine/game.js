/*
Add your code for Game here
 */
export default class Game {
    
    constructor(size) {
        this.size = size;
        this.tiles = 0;
        this.gameState = new Object();
        this.setupNewGame();
        this.moveCallbacks = [];
        this.winCallbacks = [];
        this.overCallbacks = [];
    }
    setupNewGame() {
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
        this.gameState.board = new Array(this.size**2).fill(0);
        this.tiles = 0;
        this.addNewTile();
        this.addNewTile();
    }
    loadGame(gameState) { 
        // if(Math.sqrt(gameState.board.length) != this.size)
        //     console.log("LOADED GAME WITH INCORRECT SIZE. Expected: " + this.size + " Input: " + Math.sqrt(gameState.board.length));
        this.size = Math.sqrt(gameState.board.length);
        this.gameState.score = gameState.score;
        this.gameState.won = gameState.won;
        this.gameState.over = gameState.over;
        this.gameState.board = gameState.board;
        this.tiles = this.gameState.board.filter((elem) => elem > 0).length
    }
    addNewTile() {
        // can double up at zero
        let randomTile = Math.floor(Math.random() * ((this.size**2) - this.tiles))
        let value = Math.random() < 0.9 ? 2 : 4;
        let position = 0;
        for(let zeroesToFind = randomTile + 1; zeroesToFind > 0;) {
            if(this.gameState.board[position] ==  0) {
                zeroesToFind -= 1;
                if(zeroesToFind == 0) 
                    break;
            }
            position += 1;
        }
        this.gameState.board[position] = value;
        this.tiles += 1;
    }
    move(direction) {
        if(this.gameState.over == true)
            return;
        /* we want to move all tiles up. start with second row:
            if !zero and zero above: then copy it up and set its position value to to zero
            next row: check until row equals zero 

            count the number of tiles that ACTUALLY change position or a diff in number of tiles
        */
        let doubled = new Array(this.size**2).fill(0);
        let moved = false;
        let scoreIncr = 0;
        if(direction == "up") {
            for(let row = 1; row < this.size; row++) {
                for(let col = 0; col < this.size; col++) {
                    let currVal = this.gameState.board[row*this.size + col]
                    if(currVal > 0) {
                        let limit = 0;
                        let next = -1;
                        let prev = 1;
                        let goToRow = row + next;
                        while(goToRow >= 0) {
                            let valAbove = this.gameState.board[goToRow*this.size + col]
                            if(valAbove == 0 && goToRow != limit) {
                                goToRow += next;
                                continue;
                            }
                            if(valAbove > 0) {
                                if(doubled[goToRow*this.size + col] == 1 || valAbove != currVal) {
                                    goToRow += prev;
                                    break;
                                }  
                                if(valAbove == currVal) {
                                    doubled[goToRow*this.size + col] = 1;
                                    this.tiles -= 1;
                                    break;
                                }
                            }
                            if(goToRow == limit)
                                break;
                        } 
                        // add the current value
                        this.gameState.board[row*this.size + col] = 0;
                        // if joining, add the joined value to the score
                        if(this.gameState.board[goToRow*this.size + col] != 0) {
                            scoreIncr += this.gameState.board[goToRow*this.size + col] * 2;
                        }
                        this.gameState.board[goToRow*this.size + col] += currVal;
                        if(goToRow != row) 
                            moved = true;
                    }
                }
            }
        }
        else if(direction == "down") {
            for(let row = this.size-2; row >= 0; row--) {
                for(let col = 0; col < this.size; col++) {
                    let currVal = this.gameState.board[row*this.size + col]
                    if(currVal > 0) {
                        let limit = this.size - 1;
                        let next = 1;
                        let prev = -1;
                        let goToRow = row + next;
                        while(goToRow <= limit) {
                            let valBelow = this.gameState.board[goToRow*this.size + col]
                            if(valBelow == 0 && goToRow != limit) {
                                goToRow += next;
                                continue;
                            }
                            if(valBelow > 0) {
                                if(doubled[goToRow*this.size + col] == 1 || valBelow != currVal) {
                                    goToRow += prev;
                                    break;
                                }  
                                if(valBelow == currVal) {
                                    doubled[goToRow*this.size + col] = 1;
                                    this.tiles -= 1;
                                    break;
                                }
                            }
                            if(goToRow == limit)
                                break;
                        } 
                        // add the current value
                        this.gameState.board[row*this.size + col] = 0;
                        // if joining, add the joined value to the score
                        if(this.gameState.board[goToRow*this.size + col] != 0) {
                            scoreIncr += this.gameState.board[goToRow*this.size + col] * 2;
                        }
                        this.gameState.board[goToRow*this.size + col] += currVal
                        if(goToRow != row)
                            moved = true;
                    }
                }
            }
        }
        else if(direction == "left") {
            for(let row = 0; row < this.size; row++) {
                for(let col = 1; col < this.size; col++) {
                    let currVal = this.gameState.board[row*this.size + col]
                    if(currVal > 0) {
                        let limit = 0;
                        let next = -1;
                        let prev = 1;
                        let goTo = col + next;
                        while(goTo >= 0) {
                            let preview = this.gameState.board[row*this.size + goTo]
                            if(preview == 0 && goTo != limit) {
                                goTo += next;
                                continue;
                            }
                            if(preview > 0) {
                                if(doubled[row*this.size + goTo] == 1 || preview != currVal) {
                                    goTo += prev;
                                    break;
                                }  
                                if(preview == currVal) {
                                    doubled[row*this.size + goTo] = 1;
                                    this.tiles -= 1;
                                    break;
                                }
                            }
                            if(goTo == limit)
                                break;
                        } 
                        // add the current value
                        this.gameState.board[row*this.size + col] = 0;
                        // if joining, add the joined value to the score
                        if(this.gameState.board[row*this.size + goTo] != 0) {
                            scoreIncr += this.gameState.board[row*this.size + goTo] * 2;
                        }
                        this.gameState.board[row*this.size + goTo] += currVal;
                        if(goTo != col)
                            moved = true;
                    }
                }
            }
        }
        else if(direction == "right") {
            for(let row = 0; row < this.size; row++) {
                for(let col = this.size - 2; col >= 0; col--) {
                    let currVal = this.gameState.board[row*this.size + col]
                    if(currVal > 0) {
                        let limit = this.size - 1;
                        let next = 1;
                        let prev = -1;
                        let goTo = col + next;
                        while(goTo <= limit) {
                            let preview = this.gameState.board[row*this.size + goTo]
                            if(preview == 0 && goTo != limit) {
                                goTo += next;
                                continue;
                            }
                            if(preview > 0) {
                                if(doubled[row*this.size + goTo] == 1 || preview != currVal) {
                                    goTo += prev;
                                    break;
                                }  
                                if(preview == currVal) {
                                    doubled[row*this.size + goTo] = 1;
                                    this.tiles -= 1;
                                    break;
                                }
                            }
                            if(goTo == limit)
                                break;
                        } 
                        // add the current value
                        this.gameState.board[row*this.size + col] = 0;
                        // if joining, add the joined value to the score
                        if(this.gameState.board[row*this.size + goTo] != 0) {
                            scoreIncr += this.gameState.board[row*this.size + goTo] * 2;
                        }
                        this.gameState.board[row*this.size + goTo] += currVal
                        if(goTo != col)
                            moved = true;
                    }
                }
            }   
        }
        // move check
        if(moved) {
            this.gameState.score += scoreIncr;
            this.addNewTile();
            this.moveCallbacks.forEach((cb) => cb(this.gameState));
        }
        //check if board filled => can move be done? => lose or not
        // ******* should be else if *******
        if(this.gameState.board.filter(el => el > 0).length == this.size**2) {
            let validMove = false;
            for(let row = 0; row < this.size; row++) {
                for(let col = 0; col < this.size; col++) {
                    let currentVal = this.gameState.board[row*this.size + col];
                    //handle edge cases
                    if(row != 0 ) 
                        validMove = validMove || (this.gameState.board[(row-1)*this.size + col] == currentVal )
                    if(row != this.size - 1)
                        validMove = validMove || (this.gameState.board[(row+1)*this.size + col] == currentVal )
                    if(col != 0 ) 
                        validMove = validMove || (this.gameState.board[row*this.size + (col-1)] == currentVal )
                    if(col != this.size - 1)
                        validMove = validMove || (this.gameState.board[row*this.size + (col+1)] == currentVal )
                }   
            }
            if(validMove == false) {
                // no moves left. game over
                this.gameState.over = true;
            }
        }
        // win check
        if(this.gameState.won == false) {
            let gte2048 = this.gameState.board.filter(x => x >= 2048).length;
            if(gte2048 > 0) {
                this.gameState.won = true;
                this.winCallbacks.forEach(cb => cb(this.gameState));
            }
        }
        
        if(this.gameState.over) {
            this.overCallbacks.forEach(cb => cb(this.gameState));
        }
    }
    toString() {
        // ascii string representation of the board
        let stringRep = "";
        for(let row = 0; row < this.size; row++) {
            let currRow = "";
            for(let col = 0; col < this.size; col++) {
                currRow = currRow + ('[ ' + this.gameState.board[row*this.size + col] + ' ]');
            }
            stringRep = stringRep + (currRow + (row < 3 ? "\n": "") );
        }
        return stringRep;
    }
    onMove(callback) {
        this.moveCallbacks.push(callback);
    }
    onWin(callback) {
        this.winCallbacks.push(callback);
    }
    onLose(callback) {
        this.overCallbacks.push(callback);
    }
    getGameState() {
        return this.gameState;
    }
}