import { 
    ON_SERVICE_VALUE_CHANGE, 
    ON_FORM_OPEN,
    SERVICE_FORM_SUBMIT,
    SERVICE_CREATE, 
    SERVICE_UPDATE
} from '../actions/types';

const INITIAL_STATE = {
    name: '',
    duration: '',
    price: '',
    description: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_SERVICE_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case ON_FORM_OPEN:
            return INITIAL_STATE;
        case SERVICE_FORM_SUBMIT:
            return { ...state, loading: true };
        case SERVICE_CREATE:
            return INITIAL_STATE;
        case SERVICE_UPDATE:
            return INITIAL_STATE;
        default:
            return state;
    }
};
