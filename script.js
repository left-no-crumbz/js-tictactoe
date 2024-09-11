function GameBoardController() {
    const boardArr = ['', '', '',
                   '', '', '',
                   '', '', ''];
    
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

    const updateBoard = (board) => {

    }

    const placeSymbolInArr = (index, symbol) => {
        boardArr[index] = symbol;
    }

    return {createGameBoard, placeSymbolInArr, getBoard};
}

function createPlayer() {
    let playerSymbol;

    const setPlayerSymbol = (symbol) => {
        playerSymbol = symbol;
    }

    const getPlayerSymbol = () => playerSymbol;

    return {getPlayerSymbol, setPlayerSymbol};
}


function displayController() {
    const symbolsContainer = document.querySelector(".symbols-container");
    const selector = document.querySelector(".symbol-selector-container");
    const board = document.querySelector(".board");
    const playerOne = createPlayer();
    const playerTwo = createPlayer();
    const gameBoard = GameBoardController();

    function initPlayerSymbol(event) {
        playerOne.setPlayerSymbol(event.target.getAttribute("data-symbol"));
        playerTwo.setPlayerSymbol(playerOne.getPlayerSymbol() === "X" ? "O" : "X");

        gameBoard.createGameBoard(board);

        selector.classList.toggle("disabled");
        board.classList.toggle("disabled");
        alert(`Player One's Symbol is ${playerOne.getPlayerSymbol()}`);
        alert(`Player Two's Symbol is ${playerTwo.getPlayerSymbol()}`);
    }

    symbolsContainer.addEventListener("mousedown", initPlayerSymbol);

    function placeSymbol(event) {
        const target = event.target;
        console.log(target);
        const cell = target.closest(".cell");
        console.log(cell);
        const index = cell.getAttribute("data-index");

        const symbol = playerOne.getPlayerSymbol();
        cell.textContent = symbol;
        gameBoard.placeSymbolInArr(index, symbol);

        console.log(gameBoard.getBoard());
    }
    board.addEventListener("mousedown", placeSymbol);

}

displayController();