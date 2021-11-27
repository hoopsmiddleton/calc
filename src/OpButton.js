import { ACTIONS } from "./App"

export default function OpButton({ dispatch, op }) {
    return(
        <button 
            onClick={() => dispatch({type: ACTIONS.OPCODE, payload: {op}})}
        >
            {op}
        </button>
    )
}