import { Piece } from '../piece';

export class RedPiece extends Piece {
    getPieceImg(): string {
        return 'assets/game/red-piece.svg';
    }
}