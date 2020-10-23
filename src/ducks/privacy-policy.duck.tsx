import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';
import { ApiPaths, RoutePaths } from '../commons/constants';
import { getApiPath } from '../utils';

export enum PrivacyActionTypes {
  PRIVACY_REQUEST = '@@PRIVACY/PRIVACY_REQUEST',
  PRIVACY_SUCCESS = '@@PRIVACY/PRIVACY_SUCCESS',
  PRIVACY_ERROR = '@@PRIVACY/PRIVACY_ERROR'
}

export const privacyAction = () => ({
  type: PrivacyActionTypes.PRIVACY_REQUEST
});

interface PrivacyState {
  readonly data: any[];
  readonly isLoading: boolean;
  readonly error: any;
}

const initialState: PrivacyState = {
  data: [],
  isLoading: false,
  error: undefined
};

export const PrivacyReducer: Reducer<PrivacyState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case PrivacyActionTypes.PRIVACY_REQUEST: {
      return { ...state, data: [], isLoading: true };
    }
    case PrivacyActionTypes.PRIVACY_ERROR: {
      return { ...state, error: action.payload, isLoading: false }
    }
    case PrivacyActionTypes.PRIVACY_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export const selectListData = (state: any) => state.PrivacyReducer.data;
export const selectLoadingPrivacy = (state: any) => state.PrivacyReducer.isLoading;

function* watchPrivacyData(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    let privacyPath = ApiPaths.PRIVACY_POLICY;
    const privacy = yield fetch(getApiPath(privacyPath), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    });
    yield put({
      type: PrivacyActionTypes.PRIVACY_SUCCESS,
      payload: Array.isArray(privacy) ? privacy : [privacy]
    });
  } catch (error) {
      yield handleCommonError(error.code);
      yield put({
        type: PrivacyActionTypes.PRIVACY_ERROR
      });
  }
}

export const Privacy = [takeLatest(PrivacyActionTypes.PRIVACY_REQUEST, watchPrivacyData)];