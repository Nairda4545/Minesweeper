import { toInteger } from "lodash"

import { 
    INITIALIZE_BOARD,
    FIRST_MOVE,
    REVEAL_CELL,
    GAME_LOSE,
    GAME_WIN,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    BOMB_COUNT
} from "./types"

export const initializeBoard = () => (dispatch, getState) => {
    const boardWidth = getState().boardWidth
    const boardHeight = getState().boardHeight
    let board = {}
    for(let i = 0; i < boardHeight * boardWidth; i++){
        board = {...board, [i+1]: {id: i+1, cellValue: 0, isOpen: false}}
    }

    dispatch({ type: INITIALIZE_BOARD, payload: board })
}

export const setBoardProps = ({boardHeight, boardWidth, bombCount}) => (dispatch) => {
    dispatch({ type: BOARD_HEIGHT, payload: toInteger(boardHeight) })
    dispatch({ type: BOARD_WIDTH, payload: toInteger(boardWidth) })
    dispatch({ type: BOMB_COUNT, payload: toInteger(bombCount) })
    dispatch(initializeBoard())
}

export const clickCell = (clickedCell) => (dispatch, getState) => {
    const board = getState().board
    const boardWidth = getState().boardWidth
    const gameStatus = getState().gameStatus
    if(getState().isFirstMove){
        dispatch(firstMove(clickedCell))
    }
    if(gameStatus === 'ongoing'){
        revealCell(clickedCell, board, boardWidth)
        dispatch({type: REVEAL_CELL, payload: board})
        const bombCount = getState().bombCount
        const revealedCells = getState().revealedCells
        if(board[clickedCell].cellValue === 9){
            dispatch({ type: GAME_LOSE })
        }else if(bombCount >= revealedCells.false){
            dispatch({ type: GAME_WIN })
        }
    }
}

//Helper Functions

const revealCell = (cellId, board, boardWidth, direction) => {
    cellId = parseInt(cellId)
    if(board[cellId].cellValue === 9){}    
    if(board[cellId].cellValue === 0 && !board[cellId].isOpen){
        //check top
        board[cellId].isOpen = true
        if(board[cellId - boardWidth] && board[cellId - boardWidth].cellValue !== 9 && !board[cellId - boardWidth].isOpen){
            if(board[cellId - boardWidth].cellValue === 0){
                console.log('top' + board[cellId - boardWidth].cellValue)
                board = revealCell(cellId - boardWidth, board, boardWidth)
            }else{
                board[cellId - boardWidth].isOpen = true
            }
        }
        //check right *
        if(cellId % boardWidth !== 0 && board[cellId + 1] && board[cellId + 1].cellValue !== 9 && !board[cellId + 1].isOpen){
            if(board[cellId + 1].cellValue === 0){
                console.log('right' + board[cellId + 1].cellValue)
                board = revealCell(cellId + 1, board, boardWidth)
            }else{
                board[cellId + 1].isOpen = true
            }
        }
        //check bottom *
        if(board[cellId + boardWidth] && board[cellId + boardWidth].cellValue !== 9 && !board[cellId + boardWidth].isOpen){
            if(board[cellId + boardWidth].cellValue === 0){
                console.log('bottom' + board[cellId + boardWidth].cellValue)
                board = revealCell(cellId + boardWidth, board, boardWidth)
            }else{
                board[cellId + boardWidth].isOpen = true
            }
        }
        //check left
        if(cellId % boardWidth !== 1 && board[cellId - 1] && board[cellId - 1].cellValue !== 9 && !board[cellId - 1].isOpen){
            if(board[cellId - 1].cellValue === 0){
                console.log('left' + board[cellId - 1].cellValue)
                board = revealCell(cellId - 1, board, boardWidth)
            }else{
                board[cellId - 1].isOpen = true
            }
        }
    }
    board[cellId].isOpen = true
    return board
}

const firstMove = (clickedCell) => (dispatch, getState) => {
    let board = getState().board
    const boardWidth = getState().boardWidth
    const boardHeight = getState().boardHeight
    const bombCount = getState().bombCount
    board = initializeCellValue(board, boardWidth, boardHeight, bombCount, clickedCell)
    // board = revealNearby(clickedCell, board, boardWidth)

    dispatch({type: FIRST_MOVE, payload: board})
}

const isNearby = (cellId, randomId, boardWidth) => {
        //NOTE TO SELF: REFACTOR THIS
        cellId = parseInt(cellId)
        //check top *
        if(cellId - boardWidth && cellId - boardWidth === randomId){return true}
        //check top-right
        if(cellId % boardWidth !== 0 && cellId - boardWidth + 1 === randomId){return true}
        //check right *
        if(cellId % boardWidth !== 0 && cellId + 1 === randomId){return true}
        //check bottom-right
        if(cellId % boardWidth !== 0 && cellId + boardWidth + 1 === randomId){return true}
        //check bottom *
        if(cellId + boardWidth && cellId + boardWidth === randomId){return true}
        //check bottom-left
        if(cellId % boardWidth !== 1 && cellId + boardWidth - 1 === randomId){return true}
        //check left
        if(cellId % boardWidth !== 1 && cellId - 1 === randomId){return true}
        //check top-left
        if(cellId % boardWidth !== 1 && cellId - boardWidth -1 === randomId){return true}
        //check current cell
        return false
}

const initializeCellValue = (board, boardWidth, boardHeight, bombCount, clickedCell) => {
    let numberOfBombs = 0
    var randomNumber = 0
    var random = []
    for(let i = 0; i < bombCount; i++){
        randomNumber = Math.floor(Math.random() * (boardWidth * boardHeight) + 1)
        if(random.includes(randomNumber) || randomNumber === clickedCell){
            i--
        }else if(isNearby(clickedCell, randomNumber, boardWidth) && (boardWidth * boardHeight) - bombCount > 9){
            i--
        }else{
            random = [...random, randomNumber]
        }
    }
    random.map((n) => {
        board[n].cellValue = 9
        return null
    })
    for (let cellId in board) {
        numberOfBombs = 0
        //I spent 2 hours debugging this type mismatch >:(
        cellId = parseInt(cellId)
        //check top *
        if(board[cellId - boardWidth] && board[cellId - boardWidth].cellValue === 9){numberOfBombs++}
        //check top-right
        if(cellId % boardWidth !== 0 &&  board[cellId - boardWidth + 1] && board[cellId - boardWidth + 1].cellValue === 9){numberOfBombs++}
        //check right *
        if(cellId % boardWidth !== 0 && board[cellId + 1] && board[cellId + 1].cellValue === 9){numberOfBombs++}
        //check bottom-right
        if(cellId % boardWidth !== 0 && board[cellId + boardWidth + 1] && board[cellId + boardWidth + 1].cellValue === 9){numberOfBombs++}
        //check bottom *
        if(board[cellId + boardWidth] && board[cellId + boardWidth].cellValue === 9){numberOfBombs++}
        //check bottom-left
        if(cellId % boardWidth !== 1 && board[cellId + boardWidth - 1] && board[cellId + boardWidth - 1].cellValue === 9){numberOfBombs++}
        //check left
        if(cellId % boardWidth !== 1 && board[cellId - 1] && board[cellId - 1].cellValue === 9){numberOfBombs++}
        //check top-left
        if(cellId % boardWidth !== 1 && board[cellId - boardWidth -1] && board[cellId - boardWidth -1].cellValue === 9){numberOfBombs++}
        //check current cell
        if(board[cellId].cellValue === 9){numberOfBombs = 9}

        board[cellId].cellValue = numberOfBombs
    }
    return board
}