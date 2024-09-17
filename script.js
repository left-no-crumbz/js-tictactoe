// TODO: MINI MAX ALGO FOR ENEMY AI
// TODO: Fix first attacker
//       - Right now, the player attacks first regardless of their symbol.
//       - Ideally, the X symbol player should attack first.
function GameBoardController() {
    const boardArr = ['', '', '', '', '', '', '', '', ''];
    
    const getBoard = () => boardArr;

    const createGameBoard = (board) => {
        const boardLength = boardArr.length;
        for (let index = 0; index < boardLength; index++) {
            const cell = document.createElement("button");
            cell.setAttribute("data-index", index);
            cell.classList.toggle("cell");
            board.appendChild(cell);
        }
    }

    // check cell collision
    const checkIfOccupied = (index) => {
        // this indicates that no symbol was placed in the cell
        return boardArr[index] !== ''
    }

    const placeSymbolInArr = (index, symbol) => {
        if (checkIfOccupied(index)) {
            console.log("Cell is already occupied!")
        } else {
            boardArr[index] = symbol;
        }
    }

    const checkWinConditions = (symbol) => {
        const leftDiagonal = boardArr[0] === symbol && boardArr[4] === symbol && boardArr[8] === symbol ;
        const rightDiagonal = boardArr[2] === symbol && boardArr[4] === symbol && boardArr[6] === symbol;
        let horizontal;
        let vertical;
        for (let index = 0; index < 3; index++) {
            const idx = index * 3;
            horizontal = boardArr[idx] === symbol && boardArr[idx + 1] === symbol && boardArr[idx + 2] === symbol;
            vertical = boardArr[index] === symbol && boardArr[index + 3] === symbol && boardArr[index + 6] === symbol;
            if (horizontal || vertical) {
                break;
            }
        }
        return leftDiagonal || rightDiagonal || horizontal || vertical;
    }

    const clearBoard = () => {
        for (let index = 0; index < boardArr.length; index++) {
            boardArr[index] = ''; 
        }
    }
    return {createGameBoard, placeSymbolInArr, getBoard, checkIfOccupied, checkWinConditions, clearBoard};
}

function createPlayer() {
    let playerSymbol;
    const setPlayerSymbol = (symbol) => {
        playerSymbol = symbol;
    }
    const getPlayerSymbol = () => playerSymbol;
    return {getPlayerSymbol, setPlayerSymbol};
}


function displayController(debug = false) {
    const symbolsContainer = document.querySelector(".symbols-container");
    const selector = document.querySelector(".symbol-selector-container");
    const board = document.querySelector(".board");
    const playerOne = createPlayer();
    const playerTwo = createPlayer();
    const gameBoard = GameBoardController();
    let turns = 0

    function initPlayerSymbol(event) {
        // prevents symbol to be null
        if (event.target.classList.contains("symbols-container")) {
            return
        }
        playerOne.setPlayerSymbol(event.target.getAttribute("data-symbol"));
        playerTwo.setPlayerSymbol(playerOne.getPlayerSymbol() === "X" ? "O" : "X");
        gameBoard.createGameBoard(board);

        //  remove the toggle selector
        selector.classList.toggle("disabled");

        //  display the board
        board.classList.toggle("disabled");

        if (debug) {
            console.log(`Player One's Symbol is ${playerOne.getPlayerSymbol()}`);
            console.log(`Player Two's Symbol is ${playerTwo.getPlayerSymbol()}`);
        }
    }

    function placeSymbolOpponent(symbol) {
        let index = 0;
        
        // generate index if it is already occupied
        do {
            index = Math.floor(Math.random() * 9);
        } while (gameBoard.checkIfOccupied(index));

        gameBoard.placeSymbolInArr(index, symbol);
    }
    symbolsContainer.addEventListener("mousedown", initPlayerSymbol);

    function placeSymbol(event) {
        const cell = event.target.closest(".cell");
        const index = cell.getAttribute("data-index");
        const humanSymbol = playerOne.getPlayerSymbol();
        const computerSymbol = playerTwo.getPlayerSymbol();

        if (gameBoard.checkIfOccupied(index)) {
            console.log("placeSymbol: Cell is occupied")
        } else {
            turns++;
            console.log(turns);
            gameBoard.placeSymbolInArr(index, humanSymbol);
            console.log(gameBoard.getBoard());
            
            placeSymbolOpponent(computerSymbol);
            

            const humanWin = gameBoard.checkWinConditions(humanSymbol);
            const computerWin = gameBoard.checkWinConditions(computerSymbol);


            console.log(`Human win ${humanWin}`);
            console.log(`Computer win ${computerWin}`);

            if (turns >= 3){
                if (humanWin) {
                    console.log("human win");
                    sleep
                    gameBoard.clearBoard();
                } else if (computerWin) {
                    console.log("computer win");
                    setTimeout(3000);
                    gameBoard.clearBoard();
                } else {
                    console.log("draw!");
                }
            } 
            

        }

        updateScreen();
    }

    function updateScreen() {
        const board = gameBoard.getBoard();
        const cells = Array.from(document.querySelectorAll(".cell"));
        for (let index = 0; index < board.length; index++) {
            cells[index].textContent = board[index];
        }
    }

    board.addEventListener("mousedown", placeSymbol);

}

displayController();