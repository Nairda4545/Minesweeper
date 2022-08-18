import _ from "lodash";

import { combineReducers } from "redux";

import { 
    INITIALIZE_BOARD,
    FIRST_MOVE,
    REVEAL_CELL,
    GAME_LOSE,
    GAME_WIN,
    MODAL_OPEN,
    MODAL_CLOSE,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    BOMB_COUNT
 } from "../actions/types";

const boardReducer = (state = {}, action) => {
    switch(action.type){
        case INITIALIZE_BOARD:
            return {...action.payload}
        case FIRST_MOVE:
            return {...action.payload}
        case REVEAL_CELL:
            return {...action.payload}
        default:
            return state
    }
}

const firstMoveReducer = (state = true, action) => {
    switch(action.type){
        case INITIALIZE_BOARD:
            return true
        case FIRST_MOVE:
            return false
        default:
            return state
    }
}

const gameStatusReducer = (state = 'ongoing', action) => {
    switch(action.type){
        case INITIALIZE_BOARD:
            return 'ongoing'
        case GAME_LOSE:
            return 'lose'
        case GAME_WIN:
            return 'win'
        default:
            return state
    }
}

const revealedCellsReducer = (state = {}, action) => {
    switch(action.type){
        case INITIALIZE_BOARD:
            return {}
        case REVEAL_CELL:
            return _.countBy(action.payload, 'isOpen')
        default:
            return state
    }
}

const modalReducer = (state = false, action) => {
    switch(action.type){
        case MODAL_OPEN:
            return true
        case MODAL_CLOSE:
            return false
        default:
            return state
    }
}

const boardHeightReducer = (state = 15, action) => {
    switch(action.type){
        case BOARD_HEIGHT:
            return action.payload
        default:
            return state
    }
}

const boardWidthReducer = (state = 15, action) => {
    switch(action.type){
        case BOARD_WIDTH:
            return action.payload
        default:
            return state
    }
}

const bombCountReducer = (state = 10, action) => {
    switch(action.type){
        case BOMB_COUNT:
            return action.payload
        default:
            return state
    }
}

export default combineReducers({
    isFirstMove: firstMoveReducer,
    board: boardReducer,
    boardWidth: boardWidthReducer,
    boardHeight: boardHeightReducer,
    bombCount: bombCountReducer,
    gameStatus: gameStatusReducer,
    revealedCells: revealedCellsReducer,
    isModalOpen: modalReducer
})