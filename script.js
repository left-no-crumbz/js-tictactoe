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
    }

    isValidMove(index) {
        return this.state.board[index] === "" && !this.state.isGameOver;
    }

    makeMove(index, symbol) {
        if (!this.isValidMove(index)) return false;
        this.state.board[index] = symbol;
        return true;
    }

    checkWin(symbol) {
        // check the left diagonal
        const leftDiagonal = board[0] === symbol && board[4] === symbol && board[8] === symbol;
        
        if (leftDiagonal) {
            return true;
        }

        // check the right diagonal
        const rightDiagonal = board[2] === symbol && board[4] === symbol && board[6] === symbol;
        
        if (rightDiagonal) {
            return true;
        }

        let horizontal;
        let vertical;
        
        for (let index = 0; index < 3; index++) {
            const idx = index * 3;
            // check the horizontal
            horizontal = board[idx] === symbol && board[idx + 1] === symbol && board[idx + 2] === symbol;
            
            // check the vertical
            vertical = board[index] === symbol && board[index + 3] === symbol && board[index + 6] === symbol;
            
            // break out of the loop if a winning pattern is matched
            if (horizontal || vertical) {
                return true;                
            }
        }

        return leftDiagonal || rightDiagonal || horizontal || vertical;
    }

    checkDraw() {
        return this.state.board.every(cell => cell !== "");
    }

    updateGameStatus(lastMoveSymbol){
        if (this.checkWin(lastMoveSymbol)){
            this.state.isGameOver = true;
            this.state.winner = lastMoveSymbol;
            return;
        }
        if (this.checkDraw()) {
            this.state.isGameOver = true;
            this.state.isDraw = true;
        }
    }
}

