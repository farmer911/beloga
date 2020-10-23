import { HttpCodes } from '../commons/constants';
import { put } from 'redux-saga/effects';
import { AuthActionTypes } from '../ducks/auth.duck';

export function* handleCommonError(code: HttpCodes) {
  switch (code) {
    case HttpCodes.Unauthorized:
      return yield handleUnauthorizedError();

    default:
      break;
  }
}

function* handleUnauthorizedError() {
  yield put({
    type: AuthActionTypes.AUTH_TOKEN_INVALID
  });
}
