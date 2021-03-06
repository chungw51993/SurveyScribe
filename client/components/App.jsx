import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Main from './Main';

function mapStateToProps(state) {
  return {
    surveys: state.surveys,
    questions: state.questions,
    options: state.options,
    signin: state.signin,
    responses: state.responses,
    response: state.response,
    aggregates: state.aggregates,
    snackbar: state.snackbar,
    warning: state.warning
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
