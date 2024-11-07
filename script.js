class GameState {
    constructor() {
        this.board = ["", "", "", "", "", "", "", "", "",];
        this.currentPlayer = null;
        this.isGameOver = false;
        this.winner = null;
        this.isDraw = false;
    }

    reset() {
        this.board = ["", "", "", "", "", "", "", "", "",];
        this.isGameOver = false;
        this.winner = null;
        this.isDraw = false;
    }
}

class GameLogic {
    constructor(gameState) {
        this.state = gameState;
        this.winningPattern = null;
    }

    isValidMove(index) {
        return this.state.board[index] === "" && !this.state.isGameOver;
    }

    makeMove(index, symbol) {
        if (!this.isValidMove(index)) return false;
        this.state.board[index] = symbol;
        return true;
    }

    checkWin(symbol, state = null) {

        if (state != null) {
            // check the left diagonal
            const leftDiagonal = state[0] === symbol && state[4] === symbol && state[8] === symbol;
            
            if (leftDiagonal) {
                this.winningPattern = [0, 4, 8];
                return true;
            }

            // check the right diagonal
            const rightDiagonal = state[2] === symbol && state[4] === symbol && state[6] === symbol;
            
            if (rightDiagonal) {
                this.winningPattern = [2, 4, 6];
                return true;
            }

            let horizontal;
            let vertical;
            
            for (let index = 0; index < 3; index++) {
                const idx = index * 3;
                // check the horizontal
                horizontal = state[idx] === symbol && state[idx + 1] === symbol && state[idx + 2] === symbol;
                
                if (horizontal) {
                    this.winningPattern = [idx, idx + 1, idx + 2];
                    return true;
                }

                // check the vertical
                vertical = state[index] === symbol && state[index + 3] === symbol && state[index + 6] === symbol;
                
                if (vertical) {
                    this.winningPattern = [index, index + 3, index + 6];
                    return true;                
                }
            }

            return false;
        }

        // check the left diagonal
        const leftDiagonal = this.state.board[0] === symbol && this.state.board[4] === symbol && this.state.board[8] === symbol;
        
        if (leftDiagonal) {
            this.winningPattern = [0, 4, 8];
            return true;
        }

        // check the right diagonal
        const rightDiagonal = this.state.board[2] === symbol && this.state.board[4] === symbol && this.state.board[6] === symbol;
        
        if (rightDiagonal) {
            this.winningPattern = [2, 4, 6];
            return true;
        }

        let horizontal;
        let vertical;
        
        for (let index = 0; index < 3; index++) {
            const idx = index * 3;
            // check the horizontal
            horizontal = this.state.board[idx] === symbol && this.state.board[idx + 1] === symbol && this.state.board[idx + 2] === symbol;
            
            if (horizontal) {
                this.winningPattern = [idx, idx + 1, idx + 2];
                return true;
            }

            // check the vertical
            vertical = this.state.board[index] === symbol && this.state.board[index + 3] === symbol && this.state.board[index + 6] === symbol;
            
            if (vertical) {
                this.winningPattern = [index, index + 3, index + 6];
                return true;                
            }
        }

        return false;
    }

    checkDraw(state = null) {

        if (state != null) {
            return state.every(cell => cell !== "");
        }

        return this.state.board.every(cell => cell !== "");
    }

    updateGameStatus(lastMoveSymbol) {
        if (this.checkWin(lastMoveSymbol, this.state.board)) {
            this.state.isGameOver = true;
            this.state.winner = lastMoveSymbol;
            return;
        }

        if (this.checkDraw(this.state.board)) {
            this.state.isGameOver = true;
            this.state.isDraw = true;
        }
    }
}

class AIPlayer {
    constructor(gameLogic, symbol) {
        this.gameLogic = gameLogic;
        this.symbol = symbol;
    }

    aiMakeMove() {
        const board = this.gameLogic.state.board;
        const availableMoves = board.reduce((moves, cell, index) => {
            if (cell === "") moves.push(index);
            return moves;
        }, []);
        
        if (availableMoves.length === 0) return null;

        const moveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        return moveIndex;
    }
}

class UIController {
    constructor(gameLogic, aiPlayer) {
        this.gameLogic = gameLogic;
        this.aiPlayer = aiPlayer;
        this.board = document.querySelector(".board");
        this.symbolSelector = document.querySelector(".symbol-selector-container");
        this.results = document.querySelector(".results");
        this.cells = null;
        this.playerSymbol = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector(".symbols-container").addEventListener("mousedown", (event) => this.handleSymbolSelection(event));

        this.board.addEventListener("mousedown", (event) => this.handleCellClick(event));

        document.querySelector(".results button")?.addEventListener("mousedown", () => this.handleGameReset());
        
    }

    handleSymbolSelection(event) {
        if (!event.target.hasAttribute("data-symbol")) return;

        this.playerSymbol = event.target.getAttribute("data-symbol");

        this.aiPlayer.symbol = this.playerSymbol === "X" ? "O" : "X";

        this.symbolSelector.classList.add("disabled");

        this.board.classList.remove("disabled");

        this.createGameBoard();

        this.cells = Array.from(document.querySelectorAll(".cell"))
        if (this.playerSymbol === "O") {
            this.handleAITurn();
        }
    }

    createGameBoard() {
        this.board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            const symbolText = document.createElement("p");

            cell.setAttribute("data-index", i);
            symbolText.setAttribute("data-index", i);

            cell.classList.add("cell");
            symbolText.classList.add("symbol-text");

            symbolText.style.display = "none";

            cell.appendChild(symbolText);
            this.board.appendChild(cell);
        }
    }

    
    highlightWinningPattern() {
        const winningPattern = this.gameLogic.winningPattern;

        if (winningPattern) {
            for (const index of winningPattern) {
                this.cells[index].classList.add("winner");
            }
        }
    }

    async handleCellClick(event) {
        const cell = event.target.closest(".cell");

        if (!cell) return;

        const index = Number.parseInt(cell.getAttribute("data-index"));

        if (this.gameLogic.makeMove(index, this.playerSymbol)) {
            this.updateBoard();
            this.gameLogic.updateGameStatus(this.playerSymbol);

            if (!this.gameLogic.state.isGameOver) {
                await this.handleAITurn();
            }

            this.checkGameEnd();
        }

    }

    async handleAITurn() {
        await new Promise(resolve => setTimeout(resolve, 500));

        const aiMove = this.aiPlayer.aiMakeMove();

        if (aiMove !== null) {
            this.gameLogic.makeMove(aiMove, this.aiPlayer.symbol);
            this.updateBoard();
            this.gameLogic.updateGameStatus(this.aiPlayer.symbol);
        }
    }

    updateBoard() {
        const symbolTexts = document.querySelectorAll(".symbol-text");
        
        this.gameLogic.state.board.forEach((symbol, index) => {
            const symbolText = symbolTexts[index];
            symbolText.textContent = symbol;
            symbolText.style.display = symbol ? "block" : "none";
        });
    }


    checkGameEnd() {
        console.log("Check game end");

        if (!this.gameLogic.state.isGameOver) return;

        const resultText = document.querySelector(".results p");

        if (this.gameLogic.state.winner) {
            const winnerText = this.gameLogic.state.winner === this.playerSymbol ? "You Won!" : "Computer Won!";
            
            setTimeout(() => this.results.classList.remove("disabled"), 2000);
            
            this.highlightWinningPattern();

            resultText.textContent = winnerText;

        } else if (this.gameLogic.state.isDraw) {
            setTimeout(() => this.results.classList.remove("disabled"), 2000);

            resultText.textContent = "Draw!";
        }
    }

    handleGameReset() {
        this.gameLogic.state.reset();

        const winningPattern = this.gameLogic.winningPattern;

        console.log(winningPattern);


        for (const index of winningPattern) {
            this.cells[index].classList.remove("winner");
        }

        this.results.classList.add("disabled");
        this.updateBoard();

        if (this.playerSymbol === "O") {
            this.handleAITurn();
        }
    }
}

const initGame = (() => {
    const gameState = new GameState();
    const gameLogic = new GameLogic(gameState);
    const aiPlayer = new AIPlayer(gameLogic, null);
    new UIController(gameLogic, aiPlayer);
})();