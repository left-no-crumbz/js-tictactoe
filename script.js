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

