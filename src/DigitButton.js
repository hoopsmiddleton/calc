import { ACTIONS } from "./App"

export default function DigitButton({ dispatch, digit }) {
    return(
        <button 
            onClick={() => dispatch({type: ACTIONS.DIGIT, payload: {digit}})}
        >
            {digit}
        </button>
    )
}