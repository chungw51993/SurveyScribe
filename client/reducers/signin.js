export function signin(state = [], action) {
  switch (action.type) {
    case 'TOGGLE_ERROR':
      return Object.assign({}, state[action.i], { error: !state.error });

    case 'ERROR_FALSE':
      return Object.assign({}, state[action.i], { error: false });

    case 'ERROR_TRUE':
      return Object.assign({}, state[action.i], {
        error: true,
        message: action.message
      });

    case 'EDIT_USER':
      return Object.assign({}, state[0], {
        name: action.name,
        id: action.id
      });

    case 'UPDATE_STATE':
      return action.signin;
    default:
      return state;
  }
}

export default signin;
