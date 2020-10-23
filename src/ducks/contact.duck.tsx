import { Reducer } from 'redux';
import { ActionBaseType, ContactType } from '../commons/types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { getApiPath } from '../utils';
import { ApiPaths, HttpCodes } from '../commons/constants';
import { delay } from 'redux-saga';

export enum ContactActionTypes {
  CONTACT_REQUEST = '@@CONTACT/CONTACT_REQUEST',
  CONTACT_FAILED = '@@CONTACT/CONTACT_FAILED',
  CONTACT_ERROR = '@@CONTACT/CONTACT_ERROR',
  CONTACT_SUCCESS = '@@CONTACT/CONTACT_SUCCESS'
}

// action creator
export const contactAction = (contactData: ContactType): ActionBaseType => {
  return {
    type: ContactActionTypes.CONTACT_REQUEST,
    payload: contactData
  };
};

// reducer
interface ContactState {
  isLoading: boolean;
  errorFromServer: string;
}

const initialState: ContactState = {
  isLoading: false,
  errorFromServer: ''
};

export const ContactReducer: Reducer<ContactState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case ContactActionTypes.CONTACT_REQUEST: {
      return { ...state, isLoading: true };
    }
    case ContactActionTypes.CONTACT_SUCCESS: {
      return { ...state, isLoading: false, errorFromServer: '' };
    }
    case ContactActionTypes.CONTACT_FAILED: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    case ContactActionTypes.CONTACT_ERROR: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectContactState = (state: any) => state.ContactReducer;

// side effect
function* watchContact(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload;
    const body = data;
    const response = yield fetch(getApiPath(ApiPaths.CONTACT_US), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 200 || response.status === 201) {
      yield put({
        type: ContactActionTypes.CONTACT_SUCCESS
      });
    }
  } catch (error) {
    yield put({
      type: ContactActionTypes.CONTACT_FAILED,
      payload: 'Your information is invalid.'
    });
  }
}

export const ContactSaga = [takeLatest(ContactActionTypes.CONTACT_REQUEST, watchContact)];
