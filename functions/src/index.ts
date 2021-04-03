import { moveAI } from "./ai/checkersAi";
import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
admin.initializeApp()

export const checkersCommands = functions.database.ref('/commands/checkers/{uid}/{cmd_id}')
    .onCreate((snap, context) => {
        const command = snap.val();
        const commandName = command.command;
        console.log(`Command: ${commandName} uid=${context.params.uid} cmd_id=${context.params.cmd_id}`);

        let commandPromise;
        switch (commandName) {
            case 'match':
                commandPromise = checkersMatch(context.params.uid, command);
                break;
            case 'move':
                commandPromise = checkersMove(context.params.uid, command);
                break;
            case 'play_ai':
                commandPromise = checkersPlayAi(context.params.uid, command);
                break;
            case 'move_ai':
                commandPromise = checkersMoveAi(context.params.uid, command);
                break;
            default:
                commandPromise = Promise.reject('Unknown command');
                console.log(`Unknown command: ${commandName}`);
        }
        const removePromise = admin.database()
            .ref(`/commands/checkers/${context.params.uid}/${context.params.cmd_id}`)
            .remove();
        return Promise.all([commandPromise, removePromise]);
    });

function checkersMatch(uid: string, command: any) {
    const wantsToStart = command.wantsToStart;
    const rows = parseInt(command.rows);
    const columns = parseInt(command.columns);

    let matchingCheckRef: any, matchingRequestRef: any;
    let p1uid: any, p2uid: any;
    if (wantsToStart) {
        matchingCheckRef = admin.database().ref(`matching/second/${rows}/${columns}`);
        matchingRequestRef = admin.database().ref(`matching/first/${rows}/${columns}`);
    } else {
        matchingCheckRef = admin.database().ref(`matching/first/${rows}/${columns}`);
        matchingRequestRef = admin.database().ref(`matching/second/${rows}/${columns}`);
    }

    // TODO: convert to transaction
    return matchingCheckRef.once('value').then((data: any) => {
        const matchVal = data.val();
        if (matchVal === null) {
            console.log(`${uid} waiting for match. wantsToStart ${wantsToStart} rows ${rows} colums ${columns}`);
            const matchingPromise = matchingRequestRef.set({ uid: uid });
            matchingPromise.then(() => {
                return admin.database().ref(`player_states/${uid}`).set({
                    matching: true
                });
            });
            return matchingPromise;
        } else {
            // Matched with another player
            p1uid = wantsToStart ? uid : matchVal.uid;
            p2uid = wantsToStart ? matchVal.uid : uid;

            console.log(`Matched ${p1uid} with ${p2uid}`);

            const gameRef = admin.database().ref("games/checkers").push()
            const gamePromise = gameRef.set({
                p1uid: p1uid,
                p2uid: p2uid,
                turn: p1uid,
                winner: -1,
                gameMatrix: createCheckersBoard(rows, columns)
            });

            const gameId = gameRef.key
            console.log(`Starting game ${gameId} with p1uid: ${p1uid}, p2uid: ${p2uid}`)
            const p1StatePromise = admin.database().ref(`player_states/${p1uid}`).set({
                game: gameId,
                gamePath: 'checkers',
                message: "It's your turn! Make a move!"
            });
            const p2StatePromise = admin.database().ref(`player_states/${p2uid}`).set({
                game: gameId,
                gamePath: 'checkers',
                message: "Waiting for other player..."
            });
            return Promise.all([gamePromise, p1StatePromise, p2StatePromise, matchingCheckRef.remove()]);
        }
    });
}

function createCheckersBoard(rows: number, columns: number) {
    let gameMatrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
        gameMatrix[i] = [];
        for (let j = 0; j < columns; j++) {
            if (((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1))
                && i < (rows / 2) - 1) {
                gameMatrix[i][j] = 0;
            } else if (((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1))
                && i > (rows / 2)) {
                gameMatrix[i][j] = 2;
            } else {
                gameMatrix[i][j] = -1;
            }
        }
    }

    return gameMatrix;
}

function checkersPlayAi(uid: string, command: any) {
    const rows = parseInt(command.rows);
    const columns = parseInt(command.columns);
    const aiType = parseInt(command.aiType);
    const wantsToStart = command.wantsToStart;

    const gameRef = admin.database().ref('games/checkers').push();
    const gamePromise = gameRef.set({
        p1uid: wantsToStart ? uid : aiType,
        p2uid: wantsToStart ? aiType : uid,
        turn: wantsToStart ? uid : aiType,
        winner: -1,
        gameMatrix: createCheckersBoard(rows, columns)
    });
    const p1StatePromise = admin.database().ref(`player_states/${uid}`).set({
        game: gameRef.key,
        gamePath: 'checkers',
        message: 'your_turn_message' // It's your turn
    });

    return Promise.all([gamePromise, p1StatePromise]);
}

function checkersMoveAi(uid: string, command: any) {
    const playerStateRef = admin.database().ref(`player_states/${uid}`);

    return playerStateRef.once('value')
        .then(snap => {
            const playerState = snap.val();
            if (playerState && playerState.game) {
                return admin.database().ref(`games/checkers/${playerState.game}`)
                    .once('value')
                    .then(gameSnap => {
                        const game = gameSnap.val();
                        if (game.turn == 0 || game.turn == 1 || game.turn == 2) {
                            console.log('AI movement');
                            const mov = moveAI(game);
                            //console.log(mov);
                            const destRow = mov.path.length > 0 ? mov.path[mov.path.length - 2].x : mov.destRow;
                            const destCol = mov.path.length > 0 ? mov.path[mov.path.length - 2].y : mov.destCol;
                            return gameSnap.ref.update(applyMovement(game.turn, mov.srcRow, mov.srcCol,
                                destRow, destCol, game));
                        }
                        console.log("It's not AI turn");
                        throw new Error('not_ia_turn');
                    });
            } else {
                throw new Error("not_in_game");
            }
        }).catch(err => {
            console.log(`Move failed: ${err}`);
            return playerStateRef.update({
                message: err.message
            });
        });
}

function checkersMove(uid: string, command: any) {
    const fromRow = parseInt(command.fromRow);
    const fromCol = parseInt(command.fromCol);
    const toRow = parseInt(command.toRow);
    const toCol = parseInt(command.toCol);

    const playerStateRef = admin.database().ref(`player_states/${uid}`);

    return playerStateRef.once('value')
        .then(snap => {
            const playerState = snap.val();
            if (playerState && playerState.game) {
                return admin.database().ref(`games/checkers/${playerState.game}`)
                    .once('value')
                    .then(gameSnap => {
                        return gameSnap.ref.update(applyMovement(uid, fromRow, fromCol, toRow, toCol,
                            gameSnap.val()));
                    });
            } else {
                throw new Error("not_in_game");
            }
        }).catch(err => {
            console.log(`Move failed: ${err}`);
            return playerStateRef.update({
                message: err.message
            });
        });
}

function applyMovement(uid: string, fromRow: number, fromCol: number, toRow: number,
    toCol: number, game: any) {
    const p1uid = game.p1uid;
    const p2uid = game.p2uid;

    if (uid == p1uid
        && (game.gameMatrix[fromRow][fromCol] != 0 && game.gameMatrix[fromRow][fromCol] != 1)) {
        throw new Error("not_your_piece");
    } else if (uid == p2uid
        && (game.gameMatrix[fromRow][fromCol] != 2 && game.gameMatrix[fromRow][fromCol] != 3)) {
        throw new Error("not_your_piece");
    } else if (uid != p1uid && uid != p2uid) {
        throw new Error("not_in_game");
    }
    // Check if it's player's turn
    if (uid != game.turn) {
        throw new Error("not_turn");
    }
    attemptCheckersMovement(fromRow, fromCol, toRow, toCol, game.gameMatrix);

    const movementDistance = Math.abs(fromRow - toRow);
    // If jumped over a piece and there is another to jump we don't have
    // to change the turn
    if (movementDistance != 2 || !canJump(game.gameMatrix[toRow][toCol], game.gameMatrix)) {
        // Change turns
        game.turn = game.turn == p1uid ? p2uid : p1uid;
        console.log('changing turns');
    }
    game.winner = getWinner(game.gameMatrix) == 1 ? p1uid : getWinner(game.gameMatrix) == 2 ? p2uid : -1;

    return game;
}

function attemptCheckersMovement(fromRow: number, fromCol: number, toRow: number, toCol: number, gameMatrix: number[][]) {
    const pieceValue = gameMatrix[fromRow][fromCol];
    const distanceRow = fromRow - toRow;
    const distanceCol = fromCol - toCol;
    const absDistance = Math.abs(distanceRow);
    const enemy = (pieceValue == 0) || (pieceValue == 1) ? 2 : 0;
    const enemyCrown = (pieceValue == 2) || (pieceValue == 3) ? 1 : 3;

    // If the distance is not 1 or 2 or if is attempting to move
    // in a not empty space is certainly an ilegal movement
    if ((Math.abs(distanceRow) != Math.abs(distanceCol)) || (gameMatrix[toRow][toCol] != -1)
        || (absDistance != 1 && absDistance != 2)) {
        console.log('Invalid move attempted');
        throw new Error("invalid_movement");
    }

    // It's a black piece, it should move downward
    if ((pieceValue == 0) && (distanceRow > 0)) {
        console.log('Invalid move. Id 0 should move downward');
        throw new Error("invalid_movement");
    }
    // It's a red piece, it should move upward
    else if ((pieceValue == 2) && (distanceRow < 0)) {
        console.log('Invalid move. Id 2 should move upward');
        throw new Error("invalid_movement");
    }

    // It's a piece moving a single space (not jumping), check if there
    // is a possible enemy to jump anywhere in the board and if there is 
    // then it's an invalid movement
    if ((absDistance == 1) && canJump(pieceValue, gameMatrix)) {
        console.log('Invalid move. There is a possible enemy to jump');
        throw new Error("invalid_movement");
    }
    // It's a piece jumping (moving two spaces)
    else if (absDistance == 2) {
        // Check if is jumping over an enemy
        let jumpRow = (fromRow + toRow) / 2; // Row of the jumped piece.
        let jumpCol = (fromCol + toCol) / 2; // Column of the jumped piece.
        if ((gameMatrix[jumpRow][jumpCol] != enemy) && (gameMatrix[jumpRow][jumpCol] != enemyCrown)) {
            console.log('Invalid move. You must jump over an enemy');
            throw new Error("invalid_movement");
        }
        gameMatrix[jumpRow][jumpCol] = -1;
    }
    gameMatrix[fromRow][fromCol] = -1;

    // Check if a black piece was crowned
    if (toRow == gameMatrix.length - 1 && pieceValue == 0) {
        gameMatrix[toRow][toCol] = 1;
    } // Check if a red piece was crowned
    else if (toRow == 0 && pieceValue == 2) {
        gameMatrix[toRow][toCol] = 3;
    } else {
        gameMatrix[toRow][toCol] = pieceValue;
    }
}

function canJump(pieceValue: number, gameMatrix: number[][]) {
    const enemy = (pieceValue == 0) || (pieceValue == 1) ? 2 : 0;
    const enemyCrown = (pieceValue == 0) || (pieceValue == 1) ? 3 : 1;
    const ally = (pieceValue == 0) || (pieceValue == 1) ? 0 : 2;
    const allyCrown = (pieceValue == 0) || (pieceValue == 1) ? 1 : 3;

    for (let i = 0; i < gameMatrix.length; i++) {
        for (let j = 0; j < gameMatrix[0].length; j++) {
            if (gameMatrix[i][j] == ally || gameMatrix[i][j] == allyCrown) {
                const downRight = (i + 1 < gameMatrix.length && j + 1 < gameMatrix[0].length)
                    ? gameMatrix[i + 1][j + 1] : null;
                const downLeft = (i + 1 < gameMatrix.length && j - 1 >= 0)
                    ? gameMatrix[i + 1][j - 1] : null;
                const downRightSpace = (i + 2 < gameMatrix.length && j + 2 < gameMatrix[0].length)
                    ? gameMatrix[i + 2][j + 2] : null;
                const downLeftSpace = (i + 2 < gameMatrix.length && j - 2 >= 0)
                    ? gameMatrix[i + 2][j - 2] : null;
                // Downwards
                if ((gameMatrix[i][j] != 2) &&
                    (((downRight == enemy || downRight == enemyCrown) && downRightSpace == -1)
                        || ((downLeft == enemy || downLeft == enemyCrown) && downLeftSpace == -1))) {
                    return true;
                }

                const upRight = (i - 1 >= 0 && j + 1 < gameMatrix[0].length)
                    ? gameMatrix[i - 1][j + 1] : null;
                const upLeft = (i - 1 >= 0 && j - 1 >= 0)
                    ? gameMatrix[i - 1][j - 1] : null;
                const upRightSpace = (i - 2 >= 0 && j + 2 < gameMatrix[0].length)
                    ? gameMatrix[i - 2][j + 2] : null;
                const upLeftSpace = (i - 2 >= 0 && j - 2 >= 0)
                    ? gameMatrix[i - 2][j - 2] : null;
                // Upwards
                if ((gameMatrix[i][j] != 0) &&
                    (((upRight == enemy || upRight == enemyCrown) && upRightSpace == -1)
                        || ((upLeft == enemy || upLeft == enemyCrown) && upLeftSpace == -1))) {
                    return true;
                }
            }
        }
    }

    return false;
}

function getWinner(gameMatrix: number[][]): number {
    let blackPiece = false;
    let redPiece = false;

    for (let i = 0; i < gameMatrix.length; i++) {
        for (let k = 0; k < gameMatrix[0].length; k++) {
            if (gameMatrix[i][k] == 0 || gameMatrix[i][k] == 1) {
                blackPiece = true; //Existe una pieza negra en el tablero
            }
            if (gameMatrix[i][k] == 2 || gameMatrix[i][k] == 3) {
                redPiece = true; // Existe una pieza roja en el tablero
            }
        }
    }

    if (blackPiece && !redPiece) {
        return 1; // Gana negro
    } else if (redPiece && !blackPiece) {
        return 2; // Gana rojo
    } else {
        return -1; // nadie gana
    }
}
