function createGameBoard(board) {
    const boardArr = ['', '', '',
                   '', '', '',
                   '', '', ''];

    const boardLength = boardArr.length;
        for (let index = 0; index < boardLength; index++) {
            const cell = document.createElement("button");
            cell.setAttribute("data-index", index);
            cell.classList.toggle("cell");
            board.appendChild(cell);
        }
}

function createPlayer(symbol) {
    const playerSymbol = symbol;
    const getPlayerSymbol = () => playerSymbol;

    return {getPlayerSymbol};
}

function displayController() {
    const symbolsContainer = document.querySelector(".symbols-container");
    const selector = document.querySelector(".symbol-selector-container");
    const board = document.querySelector(".board");

    

    function getPlayerSymbol(event) {
        const player = createPlayer(event.target.getAttribute("data-symbol"));
        selector.classList.toggle("disabled");
        createGameBoard(board);
        board.classList.toggle("disabled");
    }

    symbolsContainer.addEventListener("mousedown", getPlayerSymbol);

}

displayController();