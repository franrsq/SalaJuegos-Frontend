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

    const gameRef = admin.database().ref('games/checkers').push();
    const gamePromise = gameRef.set({
        p1uid: uid,
        p2uid: aiType,
        turn: uid,
        gameMatrix: createCheckersBoard(rows, columns)
    });
    const p1StatePromise = admin.database().ref(`player_states/${uid}`).set({
        game: gameRef.key,
        gamePath: 'checkers',
        message: 'your_turn_message' // It's your turn
    });

    return Promise.all([gamePromise, p1StatePromise]);
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
                        gameSnap.ref.update(
                            applyMovement(uid, fromRow, fromCol, toRow, toCol, gameSnap.val())
                        );
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

    let playerNumber;
    if (uid == p1uid) {
        playerNumber = 1; // pieces 0 and 1
        if (game.gameMatrix[fromRow][fromCol] != 0 && game.gameMatrix[fromRow][fromCol] != 1) {
            throw new Error("not_your_piece");
        }
    } else if (uid == p2uid) {
        playerNumber = 2;  // pieces 2 and 3
        if (game.gameMatrix[fromRow][fromCol] != 2 && game.gameMatrix[fromRow][fromCol] != 3) {
            throw new Error("not_your_piece");
        }
    } else {
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
    if (movementDistance != 2 || !canJump(toRow, toCol, game.gameMatrix)) {
        // Change turns
        game.turn = playerNumber == 1 ? p2uid : p1uid
    }

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
    // is a possible enemy to jump and if there is then it's an invalid movement
    if ((absDistance == 1) && canJump(fromRow, fromCol, gameMatrix)) {
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
    else if (toRow == 0 && pieceValue == 0) {
        gameMatrix[toRow][toCol] = 3;
    } else {
        gameMatrix[toRow][toCol] = pieceValue;
    }
}

function canJump(fromRow: number, fromCol: number, gameMatrix: number[][]) {
    const pieceValue = gameMatrix[fromRow][fromCol];
    const enemy = (pieceValue == 0) || (pieceValue == 1) ? 2 : 0;
    const enemyCrown = (pieceValue == 0) || (pieceValue == 1) ? 3 : 1;

    const downRight = (fromRow + 1 < gameMatrix.length && fromCol + 1 < gameMatrix[0].length)
        ? gameMatrix[fromRow + 1][fromCol + 1] : null;
    const downLeft = (fromRow + 1 < gameMatrix.length && fromCol - 1 > 0)
        ? gameMatrix[fromRow + 1][fromCol - 1] : null;
    const downRightSpace = (fromRow + 2 < gameMatrix.length && fromCol + 2 < gameMatrix[0].length)
        ? gameMatrix[fromRow + 2][fromCol + 2] : null;
    const downLeftSpace = (fromRow + 2 < gameMatrix.length && fromCol - 2 > 0)
        ? gameMatrix[fromRow + 2][fromCol - 2] : null;
    // Downwards
    if ((pieceValue != 2) &&
        (((downRight == enemy || downRight == enemyCrown) && downRightSpace == -1)
            || ((downLeft == enemy || downLeft == enemyCrown) && downLeftSpace == -1))) {
        return true;
    }

    const upRight = (fromRow - 1 > 0 && fromCol + 1 < gameMatrix[0].length)
        ? gameMatrix[fromRow - 1][fromCol + 1] : null;
    const upLeft = (fromRow - 1 > 0 && fromCol - 1 > 0)
        ? gameMatrix[fromRow - 1][fromCol - 1] : null;
    const upRightSpace = (fromRow - 2 > 0 && fromCol + 2 < gameMatrix[0].length)
        ? gameMatrix[fromRow - 2][fromCol + 2] : null;
    const upLeftSpace = (fromRow - 2 > 0 && fromCol - 2 > 0)
        ? gameMatrix[fromRow - 2][fromCol - 2] : null;
    // Upwards
    if ((pieceValue != 0) &&
        (((upRight == enemy || upRight == enemyCrown) && upRightSpace == -1)
            || ((upLeft == enemy || upLeft == enemyCrown) && upLeftSpace == -1))) {
        return true;
    }

    return false;
}

function getWinner(gameMatrix: number[][]): number {
    let blackPiece = false
    let redPiece = false

    for (let i = 0; i < gameMatrix.length; i++) {
        for (let k = 0; k < gameMatrix[i].length; k++) {
            if (gameMatrix[i][k] == 0 || gameMatrix[i][k] == 1) {
                blackPiece = true; //Existe una pieza negra en el tablero
            }
            if (gameMatrix[i][k] == 2 || gameMatrix[i][k] == 3) {
                redPiece = true // Existe una pieza roja en el tablero
            }
        }
    }

    if (blackPiece && redPiece == false) {
        return 1; // Gana negro
    } else if (redPiece && blackPiece == false) {
        return 2; // Gana rojo
    } else {
        return 0; // nadie gana
    }
}
