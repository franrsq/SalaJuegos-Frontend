import { Space } from './space';

export abstract class Engine {
    abstract initGame(board:[][]):Space[][];
}