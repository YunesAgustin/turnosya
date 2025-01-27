import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';
import AuthReducer from './AuthReducer';
import ClientDataReducer from './ClientDataReducer';
import CourtFormReducer from './CourtFormReducer';
import CourtListReducer from './CourtListReducer';
import CommerceDataReducer from './CommerceDataReducer';

export default combineReducers({
  auth: AuthReducer,
  clientData: ClientDataReducer,
  serviceForm: ServiceFormReducer,
  servicesList: ServicesListReducer,
  courtForm: CourtFormReducer,
  courtsList: CourtListReducer,
  commerceData: CommerceDataReducer
});
