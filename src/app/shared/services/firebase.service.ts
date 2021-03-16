import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Space } from 'src/app/game/space';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private database: AngularFireDatabase) { }

  observeGame(gamePath, gameId) {
    return this.database.object(`games/${gamePath}/${gameId}`).valueChanges();
  }

  injectTable(board: Space[][]) {
    let data = [];
    for (let i = 0; i < board.length; i++) {
      let array = [];
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].piece) {
          array.push(board[i][j].piece.pieceType);
        } else {
          array.push(-1);
        }
      }
      data[i] = array;
    }
    this.database.object('games/checkers/123').set(data);
  }
}
