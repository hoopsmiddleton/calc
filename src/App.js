import React, { useReducer } from 'react'
import DigitButton from './DigitButton'
import OpButton from './OpButton'
import './styles.css'

export const ACTIONS = {
    DIGIT: 'digit',
    CLEAR: 'clear',
    DEL: 'del',
    OPCODE: 'opCode',
    EVAL: 'eval'
}

const INT_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0
})

function FormatOperand(op) {
    if (op == null) return
    const [i, d] = op.split(".")

    if (d == null) return INT_FORMATTER.format(i)

    return `${INT_FORMATTER.format(i)}.${d}`
}


function App() {
    const [{currOperand, prevOperand, operation}, dispatch] = useReducer(reducer, {})

    function reducer(state, {type, payload}) {

        switch(type) {
            case ACTIONS.DIGIT:
                if (state.overwrite) {
                    return {
                        ...state,
                        currOperand: payload.digit,
                        overwrite: false
                    }
                }
                if (payload.digit === "0" && state.currOperand === "0") {
                    return state
                }
                if (payload.digit === "." && state.currOperand != null && state.currOperand.includes(".")) {
                    return state
                }
                
                return {
                    ...state,
                    currOperand: `${state.currOperand || ""}${payload.digit}`
                }
            case ACTIONS.OPCODE: 
                if (state.currOperand == null && state.prevOperand == null) {
                    return state
                }
                if (state.currOperand == null) {
                    return {
                        ...state,
                        operation: payload.op
                    }
                }
                if (state.prevOperand == null) {
                    return {
                        ...state,
                        operation: payload.op,
                        prevOperand: state.currOperand,
                        currOperand: null
                    }
                }
                return {
                    ...state,
                    prevOperand: Evaluate(state),
                    currOperand: null,
                    operation: payload.op
                }
            case ACTIONS.CLEAR:
                return {}

            case ACTIONS.DEL:
                if (state.overwrite) {
                    return {
                        ...state,
                        currOperand: null,
                        overwrite: false
                    }
                }
                if (state.currOperand == null) {
                    return state
                }
                if (state.currOperand.length === 1) {
                    return {
                        ...state,
                        currOperand: null
                    }
                }
                return {
                    ...state,
                    currOperand: state.currOperand.slice(0, -1)
                }
                
            case ACTIONS.EVAL:
                if (
                    state.currOperand == null || 
                    state.prevOperand == null || 
                    state.operation == null
                ) {
                    return state
                }
                
                return {
                    ...state,
                    operation: "",
                    prevOperand: null,
                    overwrite: true,
                    currOperand: Evaluate(state)
                }
            default:
                return {...state, currOperand: 0}
        }
    
        function Evaluate({currOperand, prevOperand, operation}) {
            const prev = parseFloat(prevOperand)
            const curr = parseFloat(currOperand)
            

            if (isNaN(prev) || isNaN(curr)) {
                return ""
            }
            
            let value = ""

            switch (operation) {
                case "+": {
                    value = prev + curr
                    break
                } 
                case '-': {
                    value = prev - curr
                    break
                }
                case '*': {
                    value = prev * curr
                    break
                }
                case '÷': {
                    value = prev / curr
                    break
                }
                default: {
                    value = 0
                    break
                }
            }
            return value.toString()
        }
    }
    return (
        <div className="calculator-grid">
            <div className="output">
                <div className="prevOperand">
                    {FormatOperand(prevOperand)} {operation}
                </div>
                <div className="currOperand">
                    {FormatOperand(currOperand)}
                </div>
            </div>
            <button 
                className="span-two" 
                onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
            <button onClick={() => dispatch({type: ACTIONS.DEL})}>DEL</button>
            <OpButton op="÷" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OpButton op="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OpButton op="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OpButton op="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button 
                className="span-two"
                onClick={() => dispatch({type: ACTIONS.EVAL})}>=</button>
        </div>
    )
}

export default App