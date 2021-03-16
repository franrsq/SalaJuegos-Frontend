export abstract class Piece {
    // Is used to know what kind of piece is this, for instance
    // 1 could be used to represent a crown in a checkers game
    pieceType;
    playerNumber;

    constructor(pieceType) {
        this.pieceType = pieceType;
    }

    abstract getPieceImg(): string;
}