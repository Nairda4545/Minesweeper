import React, { useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { initializeBoard, clickCell } from "../actions/actions";
import Cell from "./Cell";
import BoardHeader from "./BoardHeader";

const Board = (props) => {

    useEffect(() => {
        props.initializeBoard()
    }, [])

    const renderCells = props.board.map((cell) => {
        if(cell.id % props.boardWidth !== 0){
            return <React.Fragment key={cell.id}>
                    <Cell cellId={cell.id} cellValue={cell.cellValue} isOpen={cell.isOpen} gameStatus={props.gameStatus} />
                </React.Fragment>
        }
        return <React.Fragment key={cell.id}>
                <Cell cellId={cell.id} cellValue={cell.cellValue} isOpen={cell.isOpen} gameStatus={props.gameStatus} />
                <br/>
            </ React.Fragment>
    })

    if(!props.board){
        return <div>Loading</div>
    }

    return <div style={{ width: 'max-content', margin: 'auto' }}>
            <BoardHeader />
            <div style={{ marginTop: '20px' }}>{renderCells}</div>
        </div>
}

const mapStateToProps = (state) => {
    return {
        board: _.values(state.board),
        boardHeight: state.boardHeight,
        boardWidth: state.boardWidth,
        bombCount: state.bombCount,
        isFirstMove: state.isFirstMove,
        gameStatus: state.gameStatus
    }
}

export default connect( mapStateToProps, { initializeBoard, clickCell } )(Board)