import { Piece } from "./piece";

export class Space {
    piece: Piece = null;
    highlight: boolean = false;
    row: number;
    column: number;
    styleImage: string;
    highlightStyle: string;

    constructor(row: number, column: number, styleImage: string, highlightStyle: string = null) {
        this.row = row;
        this.column = column;
        this.styleImage = styleImage;
        this.highlightStyle = highlightStyle;
    }
}