import { Piece } from '../piece';

export class BlackPiece extends Piece {
    getPieceImg(): string {
        return 'assets/game/black-piece.svg';
    }
}