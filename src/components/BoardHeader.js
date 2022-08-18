import React from "react";
import { connect } from "react-redux";
import { Form, Field } from "react-final-form";

import { setBoardProps } from "../actions/actions";

const BoardHeader = (props) => {
    const renderGameStatus = () => {
        if(props.gameStatus === 'lose'){
            return <h1>Game Over</h1>
        }else if(props.bombCount >= props.revealedCells.false){
            return <h1>You win</h1>
        }else {
            return <h1>Game ongoing</h1>
        }
    }

    const renderInput = ({ meta, label, input, min }) => {
        const className = `field ${meta.error && meta.touched ? 'error' : ''}`
        return <div className={className}>
            <label>{label}</label>
            <input {...input} type='number' min={min} autoComplete='off'/>
        </div>
    }

    return <div className='ui container'>
        {/* <Modal /> */}
        {renderGameStatus()}
        <Form
            initialValues={{
                boardHeight: props.boardHeight,
                boardWidth: props.boardWidth,
                bombCount: props.bombCount
            }}
            onSubmit={(formProps) => {
                props.setBoardProps(formProps)
            }}
            validate={(formProps) => {
                const errors = {}
                if(formProps.bombCount >= (formProps.boardHeight * formProps.boardWidth)){
                    errors.bombCount = 'Too many bombs'
                }
                if(formProps.bombCount < 1){
                    errors.bombCount = 'Need bigger number'
                }
                if(formProps.boardHeight < 2){
                    errors.boardHeight = 'Need bigger number'
                }
                if(formProps.boardWidth < 2){
                    errors.boardWidth = 'Need bigger number'
                }
                return errors
            }}
        >   
            {(props) => {
                return <form onSubmit={props.handleSubmit} className="ui form error">
                    <div className="ui grid">
                        <Field
                            name="boardHeight"
                            component={renderInput}
                            label="Board Height"
                            min='2'
                        />
                        <Field
                            name="boardWidth"
                            component={renderInput}
                            label="Board Width"
                            min='2'
                        />
                        <Field
                            name="bombCount"
                            component={renderInput}
                            label="Bomb Count"
                            min='1'
                        />
                        <button className="ui button primary" style={{ height: '100%', margin: 'auto 0 auto 0' }} >New Game</button>
                    </div>
                </form>
            }}
        </Form>
    </div>
}

const mapStateToProps = (state) => {
    return {
        gameStatus: state.gameStatus,
        revealedCells: state.revealedCells,
        bombCount: state.bombCount,
        boardHeight: state.boardHeight,
        boardWidth: state.boardWidth
    }
}

export default connect (mapStateToProps, { setBoardProps })(BoardHeader)