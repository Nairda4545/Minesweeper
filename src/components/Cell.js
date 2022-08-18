import React from "react";  
import { connect } from 'react-redux'

import { clickCell } from "../actions/actions";

const Cell = (props) => {
    
    const setDisplay = () => {
        if(props.cellValue === 9 && (props.isOpen || props.gameStatus !== 'ongoing')){
            return '※'
        }else if(props.cellValue === 0 || !props.isOpen){
            return '\u00A0'
        }else{
            return props.cellValue
        }
    }   

    return <button 
            onClick={() => {props.clickCell(props.cellId)}}
            style={{
                fontSize: '30px',
                height: '50px',
                width: '50px',
                backgroundColor: `${props.isOpen && props.cellValue === 0 ? 'lightgray' : ''}`
            }}>
            {setDisplay()}
        </button>
}

export default connect( null, { clickCell })(Cell)