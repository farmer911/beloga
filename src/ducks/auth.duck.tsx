import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { createSelector } from 'reselect';
import { UserActionTypes } from './user.duck';

export enum AuthActionTypes {
  AUTH_CHECK_START = '@@AUTH/AUTH_CHECK_START',
  AUTH_CHECK_FINISH = '@@AUTH/AUTH_CHECK_FINISH',
  AUTH_TOKEN_INVALID = '@@AUTH/AUTH_TOKEN_INVALID'
}

// action creator
export const checkAuthAction = (): any => {
  return {
    type: AuthActionTypes.AUTH_CHECK_START
  };
};

// reducer
interface AuthState {
  isAuthenticated?: boolean;
  isTokenInvalid: boolean;
}

const initialState: AuthState = {
  isAuthenticated: undefined,
  isTokenInvalid: false
};

export const AuthReducer: Reducer<AuthState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_CHECK_START: {
      return { ...state };
    }
    case AuthActionTypes.AUTH_CHECK_FINISH: {
      return { ...state, isAuthenticated: action.payload };
    }
    case AuthActionTypes.AUTH_TOKEN_INVALID: {
      return { ...state, isAuthenticated: false, isTokenInvalid: true };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectAuthState = (state: any) => state.AuthReducer;
export const selectCanAccessLogin = createSelector(
  [selectAuthState],
  (authState: AuthState) => {
    const { isAuthenticated } = authState;
    return isAuthenticated ? false : true;
  }
);

// side effect
function* watchCheckAuthen(action: ActionBaseType): any {
  const isAuthenticated = yield api.Auth.isAuthenticated();
  yield put({
    type: AuthActionTypes.AUTH_CHECK_FINISH,
    payload: isAuthenticated
  });
}

function* watchTokenInvalid(): any {
  try {
    yield api.Auth.logout();
    yield put.resolve({
      type: UserActionTypes.USER_RESET_INFO
    });
  } catch (error) {}
}

export const AuthSaga = [
  takeLatest(AuthActionTypes.AUTH_CHECK_START, watchCheckAuthen),
  takeLatest(AuthActionTypes.AUTH_TOKEN_INVALID, watchTokenInvalid)
];
