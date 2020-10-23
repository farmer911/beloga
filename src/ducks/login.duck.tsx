import axios from 'axios';
import { Reducer } from 'redux';
import { ActionBaseType, LoginType, LoginSocialType, ActivateType } from '../commons/types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { AuthActionTypes } from './auth.duck';
import { UserActionTypes } from './user.duck';
import { delay } from 'redux-saga';
import { getApiPath } from '../utils';
import { ApiPaths, HttpCodes } from '../commons/constants';
import { NotificationService } from '../services';

export enum LoginActionTypes {
  LOGIN_REQUEST = '@@LOGIN/LOGIN_REQUEST',
  LOGIN_FAILED = '@@LOGIN/LOGIN_FAILED',
  LOGIN_ERROR = '@@LOGIN/LOGIN_ERROR',
  LOGIN_SUCCESS = '@@LOGIN/LOGIN_SUCCESS',
  LOGOUT_REQUEST = '@@LOGOUT/LOGOUT_REQUEST',
  LOGOUT_SUCCESS = '@@LOGOUT/LOGOUT_SUCCESS',
  LOGOUT_FAIL = '@@LOGOUT/LOGOUT_FAIL',
  LOGIN_FACEBOOK = '@@LOGIN/LOGIN_FACEBOOK',
  LOGIN_GOOGLE = '@@LOGIN/LOGIN_GOOGLE',
  LOGIN_LINKEDIN = '@@LOGIN/LOGIN_LINKEDIN',
  RESET_ERROR = '@@LOGIN/RESET_ERROR',

  ACTIVATE_REQUEST = '@@ACTIVATE/ACTIVATE_REQUEST',
  ACTIVATE_FAILED = '@@ACTIVATE/ACTIVATE_FAILED',
  ACTIVATE_SUCCESS = '@@ACTIVATE/ACTIVATE_SUCCESS',

  RESEND_EMAIL_REQUEST = '@@LOGIN/RESEND_EMAIL_REQUEST',
  RESEND_EMAIL_FAILED = '@@LOGIN/RESEND_EMAIL_FAILED',
  RESEND_EMAIL_SUCCESS = '@@LOGIN/RESEND_EMAIL_SUCCESS'
}

// action creator

export const resendEmail = (username: string): ActionBaseType => {
  return {
    type: LoginActionTypes.RESEND_EMAIL_REQUEST,
    payload: username
  };
};

export const loginAction = (loginData: LoginType): ActionBaseType => {
  return {
    type: LoginActionTypes.LOGIN_REQUEST,
    payload: loginData
  };
};

export const resetError = () => {
  return {
    type: LoginActionTypes.RESET_ERROR
  };
};

export const loginActionSuccess = (): ActionBaseType => {
  return {
    type: LoginActionTypes.LOGIN_SUCCESS,
    payload: {}
  };
};

export const logoutAction = (): ActionBaseType => {
  return {
    type: LoginActionTypes.LOGOUT_REQUEST,
    payload: ''
  };
};

export const facebookLoginAction = (loginData: LoginSocialType): ActionBaseType => {
  return {
    type: LoginActionTypes.LOGIN_FACEBOOK,
    payload: loginData
  };
};

export const googleLoginAction = (loginData: LoginSocialType): ActionBaseType => {
  return {
    type: LoginActionTypes.LOGIN_GOOGLE,
    payload: loginData
  };
};

export const linkedinLoginAction = (loginData: LoginSocialType): ActionBaseType => {
  return {
    type: LoginActionTypes.LOGIN_LINKEDIN,
    payload: loginData
  };
};

export const activateAction = (activateData: ActivateType): ActionBaseType => {
  return {
    type: LoginActionTypes.ACTIVATE_REQUEST,
    payload: activateData
  };
};

// reducer
interface LoginState {
  isLoading: boolean;
  errorFromServer: string;
  activateState: boolean;
  isLoadingActivate: boolean;
  isLoadingSendMail: boolean;
  sendEmailResult: any;
  sendEmailError: any;
}

const initialState: LoginState = {
  isLoading: false,
  errorFromServer: '',
  activateState: false,
  isLoadingActivate: true,
  isLoadingSendMail: false,
  sendEmailResult: {},
  sendEmailError: {}
};

export const LoginReducer: Reducer<LoginState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case LoginActionTypes.LOGIN_REQUEST: {
      return { ...state, isLoading: true };
    }
    case LoginActionTypes.LOGIN_SUCCESS: {
      return { ...state, isLoading: false, errorFromServer: '' };
    }
    case LoginActionTypes.LOGIN_FAILED: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    case LoginActionTypes.LOGIN_ERROR: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    case LoginActionTypes.LOGOUT_REQUEST: {
      return { ...state };
    }
    case LoginActionTypes.LOGOUT_SUCCESS: {
      localStorage.removeItem('userTemp');
      return { ...state };
    }
    case LoginActionTypes.LOGIN_FACEBOOK: {
      return { ...state };
    }
    case LoginActionTypes.LOGIN_GOOGLE: {
      return { ...state };
    }
    case LoginActionTypes.LOGIN_LINKEDIN: {
      return { ...state };
    }
    case LoginActionTypes.RESET_ERROR: {
      return { ...state, errorFromServer: '' };
    }
    case LoginActionTypes.ACTIVATE_SUCCESS: {
      return { ...state, isLoadingActivate: false, activateState: true, errorFromServer: '' };
    }
    case LoginActionTypes.ACTIVATE_FAILED: {
      return { ...state, isLoadingActivate: false, activateState: false, errorFromServer: action.payload };
    }
    case LoginActionTypes.RESEND_EMAIL_REQUEST:
      return {
        ...state,
        isLoadingSendMail: true
      };
    case LoginActionTypes.RESEND_EMAIL_FAILED:
      return {
        ...state,
        isLoadingSendMail: false,
        sendEmailError: action.payload
      };
    case LoginActionTypes.RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        isLoadingSendMail: false,
        sendEmailResult: action.payload
      };
    default: {
      return state;
    }
  }
};

// selector
export const selectLoginState = (state: any) => state.LoginReducer;
export const selectActivateState = (state: any) => state.LoginReducer.activateState;
export const selectIsActivateLoading = (state: any) => state.LoginReducer.isLoadingActivate;

export const messageConfirm = 'Please confirm email before logging in';

// side effect
function* watchLogin(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const result = yield api.Auth.login(action.payload);
    yield put({
      type: AuthActionTypes.AUTH_CHECK_FINISH,
      payload: true
    });
    yield put({
      type: LoginActionTypes.LOGIN_SUCCESS
    });
  } catch (error) {
    let message: string = 'Email or password wrong';
    if (typeof error === 'string') {
      message = error;
    } else if (typeof error !== 'string' && error['code'] === 'email_is_social') {
      message = "Please log in with social account used during registration"; 
    }
    if (message === messageConfirm) {
      yield put({
        type: LoginActionTypes.LOGIN_FAILED,
        payload: 'Your email address has not been confirmed. Please click the link in the email we sent.'
      });
    } else {
      yield put({
        type: LoginActionTypes.LOGIN_FAILED,
        payload: message
      });
      yield call(delay, 5000);
      yield put({
        type: LoginActionTypes.RESET_ERROR
      });
    }
  }
}

function* watchFacebookLogin(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    yield api.Auth.facebookLogin(action.payload);
    yield put({
      type: AuthActionTypes.AUTH_CHECK_FINISH,
      payload: true
    });
    yield put({
      type: LoginActionTypes.LOGIN_SUCCESS
    });
  } catch (error) {
    yield put({
      type: LoginActionTypes.LOGIN_FAILED,
      payload: 'This email address is already registered.' // Will be set to error return from server
    });
  }
}

function* watchGoogleLogin(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    yield api.Auth.googleLogin(action.payload);
    yield put({
      type: AuthActionTypes.AUTH_CHECK_FINISH,
      payload: true
    });
    yield put({
      type: LoginActionTypes.LOGIN_SUCCESS
    });
  } catch (error) {
    yield put({
      type: LoginActionTypes.LOGIN_FAILED,
      payload: 'This email address is already registered.' // Will be set to error return from server
    });
  }
}

function* watchLinkedinLogin(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    yield api.Auth.linkedInLogin(action.payload);
    yield put({
      type: AuthActionTypes.AUTH_CHECK_FINISH,
      payload: true
    });
    yield put({
      type: LoginActionTypes.LOGIN_SUCCESS
    });
  } catch (error) {
    yield put({
      type: LoginActionTypes.LOGIN_FAILED,
      payload: 'This email address is already registered.' // Will be set to error return from server
    });
  }
}

function* watchLoginSuccess(): any {
  yield put({
    type: UserActionTypes.USER_FETCH_INFO_REQUEST
  });
}

function* watchLogout(action: ActionBaseType): any {
  localStorage.setItem('is_logout', 'yes');
  yield api.Auth.logout();
  yield put.resolve({
    type: AuthActionTypes.AUTH_CHECK_FINISH,
    payload: false
  });
  yield put.resolve({
    type: UserActionTypes.USER_RESET_INFO
  });

  yield put({
    type: LoginActionTypes.LOGOUT_SUCCESS,
    payload: true
  });
}

function* watchActivate(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload;
    const body = data;
    const response = yield fetch(getApiPath(ApiPaths.ACTIVATE), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 200 || response.status === 201) {
      yield put({
        type: LoginActionTypes.ACTIVATE_SUCCESS,
        payload: true
      });
      NotificationService.notify('Activation Successful! Please log in to your account.');
    } else {
      yield put({
        type: LoginActionTypes.ACTIVATE_FAILED,
        payload: false
      });
      NotificationService.notify('Activation Failed! Please login with other account or create new account.');
    }
  } catch (error) {
    yield put({
      type: LoginActionTypes.ACTIVATE_FAILED,
      payload: 'The activation code is invalid.'
    });
  }
}

function* watchResendEmail(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const { data, error } = yield axios
      .post(getApiPath(ApiPaths.RESEND_EMAIL), { username: action.payload })
      .then(data => {
        if (data) {
          return {
            data
          };
        }
      })
      .catch(error => {
        if (error) {
          return {
            error
          };
        }
      });

    if (data) {
      yield put({
        type: LoginActionTypes.RESEND_EMAIL_SUCCESS,
        payload: data
      });
    } else if (error) {
      yield put({
        type: LoginActionTypes.RESEND_EMAIL_FAILED,
        payload: error
      });
    }
  } catch (error) {
    yield put({
      type: LoginActionTypes.RESEND_EMAIL_FAILED,
      payload: error
    });
  }
}

export const resetPassword = (email: any) => {
  const actionForgot = fetch(getApiPath(ApiPaths.RESET_PASSWORD), {
    method: 'POST',
    headers: { ...api.Auth.getAuthorizationHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return actionForgot;
};
export const resetPasswordConfirm = (data: any) => {
  const actionconfirm = fetch(getApiPath(ApiPaths.RESET_PASSWORD_CONFIRM), {
    method: 'POST',
    headers: { ...api.Auth.getAuthorizationHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return actionconfirm;
};

export const LoginSaga = [
  takeLatest(LoginActionTypes.LOGIN_REQUEST, watchLogin),
  takeLatest(LoginActionTypes.LOGIN_SUCCESS, watchLoginSuccess),
  takeLatest(LoginActionTypes.LOGOUT_REQUEST, watchLogout),
  takeLatest(LoginActionTypes.LOGIN_FACEBOOK, watchFacebookLogin),
  takeLatest(LoginActionTypes.LOGIN_GOOGLE, watchGoogleLogin),
  takeLatest(LoginActionTypes.LOGIN_LINKEDIN, watchLinkedinLogin),
  takeLatest(LoginActionTypes.ACTIVATE_REQUEST, watchActivate),
  takeLatest(LoginActionTypes.RESEND_EMAIL_REQUEST, watchResendEmail)
];
