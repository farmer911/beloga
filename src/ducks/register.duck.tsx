import { Reducer } from 'redux';
import { api } from '@belooga/belooga-ts-sdk';
import { ActionBaseType, RegisterType, LoginSocialType } from '../commons/types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { NotificationService } from '../services';
import { delay } from 'redux-saga';

enum RegisterActionTypes {
  REGISTER_USER_REQUEST = '@@REGISTER/REGISTER_USER_REQUEST',
  REGISTER_USER_SUCCESS = '@@REGISTER/REGISTER_USER_SUCCESS',
  REGISTER_USER_ERROR = '@@REGISTER/REGISTER_USER_ERROR',
  REGISTER_USER_SUCCESS_REDIRECT_BEGIN = '@@REGISTER/REGISTER_USER_SUCCESS_REDIRECT_BEGIN',
  REGISTER_USER_SUCCESS_REDIRECT_END = '@@REGISTER/REGISTER_USER_SUCCESS_REDIRECT_END',
  REGISTER_USER_CHECK_VALID_EMAIL_REQUEST = '@@REGISTER/REGISTER_USER_CHECK_VALID_EMAIL_REQUEST',
  REGISTER_USER_CHECK_VALID_USERNAME_REQUEST = '@@REGISTER/REGISTER_USER_CHECK_VALID_USERNAME_REQUEST'
}

// action creator
export const submitRegisterUserAction = (registerInfo: RegisterType): ActionBaseType => {
  return {
    type: RegisterActionTypes.REGISTER_USER_REQUEST,
    payload: registerInfo
  };
};

export const checkValidEmailAction = (email: string, callback: any): ActionBaseType => {
  return {
    type: RegisterActionTypes.REGISTER_USER_CHECK_VALID_EMAIL_REQUEST,
    payload: { email: email, callback }
  };
};

export const checkValidUsernameAction = (username: string, callback: any): ActionBaseType => {
  return {
    type: RegisterActionTypes.REGISTER_USER_CHECK_VALID_USERNAME_REQUEST,
    payload: { username: username, callback }
  };
};
// reducer
interface RegisterState {
  isRedirect: boolean;
  isLoading: boolean;
  errorFromServer: string;
}

const initialState: RegisterState = {
  isRedirect: false,
  isLoading: false,
  errorFromServer: ''
};

export const RegisterReducer: Reducer<RegisterState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case RegisterActionTypes.REGISTER_USER_REQUEST: {
      return { ...state, isLoading: true };
    }
    case RegisterActionTypes.REGISTER_USER_SUCCESS: {
      return { ...state, isLoading: false, errorFromServer: '' };
    }
    case RegisterActionTypes.REGISTER_USER_ERROR: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    case RegisterActionTypes.REGISTER_USER_SUCCESS_REDIRECT_BEGIN: {
      return { ...state, isLoading: false, isRedirect: true };
    }
    case RegisterActionTypes.REGISTER_USER_SUCCESS_REDIRECT_END: {
      return { ...state, isLoading: false, isRedirect: false };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectRegisterState = (state: any) => state.RegisterReducer;

// side effect
function* watchRegisterRequest(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const userInfo = action.payload;
    yield api.User.register({
      username: userInfo.username,
      email: userInfo.email,
      first_name: userInfo.firstname,
      last_name: userInfo.lastname,
      password1: userInfo.password1,
      password2: userInfo.password2,
      access_token: userInfo.access_token,
      provider: userInfo.provider
    });

    yield put({
      type: RegisterActionTypes.REGISTER_USER_SUCCESS_REDIRECT_BEGIN
    });
  } catch (error) {
    yield put({
      type: RegisterActionTypes.REGISTER_USER_ERROR,
      payload: 'Something went wrong, please try again later!'
    });
  }
}

function* watchRegisterSuccess(action: ActionBaseType): any {
  NotificationService.notify('Please check your email for a confirmation link to verify your account.');
}

function* watchAfterRedirect(action: ActionBaseType): any {
  yield put({
    type: RegisterActionTypes.REGISTER_USER_SUCCESS_REDIRECT_END
  });
}

function* watchCheckValidEmail(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const result = yield api.User.existsEmail(action.payload.email);
    if (result) {
      action.payload.callback('This email already exists');
    } else {
      action.payload.callback();
    }
  } catch (error) {
    action.payload.callback("Can't check email");
  }
}

function* watchCheckValidUsername(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const result = yield api.User.existsUser(action.payload.username);
    if (result) {
      action.payload.callback('This username already exists');
    } else {
      action.payload.callback();
    }
  } catch (error) {
    action.payload.callback("Can't check username");
  }
}

export const RegisterSaga = [
  takeLatest(RegisterActionTypes.REGISTER_USER_REQUEST, watchRegisterRequest),
  takeLatest(RegisterActionTypes.REGISTER_USER_SUCCESS, watchRegisterSuccess),
  takeLatest(RegisterActionTypes.REGISTER_USER_SUCCESS_REDIRECT_BEGIN, watchAfterRedirect),
  takeLatest(RegisterActionTypes.REGISTER_USER_CHECK_VALID_EMAIL_REQUEST, watchCheckValidEmail),
  takeLatest(RegisterActionTypes.REGISTER_USER_CHECK_VALID_USERNAME_REQUEST, watchCheckValidUsername)
];
