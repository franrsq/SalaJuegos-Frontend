import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Space } from 'src/app/game/space';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  observeGame(gamePath, gameId) {
    return this.firestore.collection(gamePath).doc(gameId).valueChanges();
  }

  injectTable(board: Space[][]) {
    let data = {};
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
    this.firestore.collection('checkers').doc('123').set(data);
  }
}
