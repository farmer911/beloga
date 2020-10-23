import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';
import { getApiPath } from '../utils';
import { ApiPaths } from './../commons/constants/api-paths';


export enum CareersActionTypes {
  CAREERS_FETCH_REQUEST = '@@CAREERS/CAREERS_FETCH_REQUEST',
  CAREERS_FETCH_SUCCESS = '@@CAREERS/CAREERS_FETCH_SUCCESS',
  CAREERS_FETCH_ERROR = '@@CAREERS/CAREERS_FETCH_ERROR',
  CONTACT_REQUEST = '@@CAREERS/CONTACT_REQUEST',
  CONTACT_FAILED = '@@CAREERS/CONTACT_FAILED',
  CONTACT_ERROR = '@@CAREERS/CONTACT_ERROR',
  CONTACT_SUCCESS = '@@CAREERS/CONTACT_SUCCESS'
}

// action creator
export const fetchCareersAction = () => ({
  type: CareersActionTypes.CAREERS_FETCH_REQUEST
});

// reducer
interface CareersState {
  readonly data: any[];
  readonly isLoading: boolean;
}

const initialState: CareersState = {
  data: [],
  isLoading: false
};

export const CareersReducer: Reducer<CareersState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case CareersActionTypes.CAREERS_FETCH_REQUEST: {
      return { ...state, isLoading: true };
    }
    case CareersActionTypes.CAREERS_FETCH_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case CareersActionTypes.CAREERS_FETCH_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    case CareersActionTypes.CONTACT_REQUEST: {
      return { ...state, isLoading: true };
    }
    case CareersActionTypes.CONTACT_SUCCESS: {
      return { ...state, isLoading: false, errorFromServer: '' };
    }
    case CareersActionTypes.CONTACT_FAILED: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    case CareersActionTypes.CONTACT_ERROR: {
      return { ...state, isLoading: false, errorFromServer: action.payload };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectListCareers = (state: any) => state.CareersReducer.data;
export const selectIsLoading = (state: any) => state.CareersReducer.isLoading;

export const ApplyJob = (data:any): ActionBaseType => {
  return {
    type: CareersActionTypes.CONTACT_REQUEST,
    payload: { data }
  };
}
// side effect
function* watchFetchCareers(): any {
  yield call(delay, 300);
  try {;
    const data = yield fetch(getApiPath(ApiPaths.CAREERS), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res=>{
        return res.json();
    });
    yield put({
      type: CareersActionTypes.CAREERS_FETCH_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: CareersActionTypes.CAREERS_FETCH_ERROR
    });
  }
}
function* watchContact(action: ActionBaseType): any {
  yield call(delay, 300);

  try {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const {data} = action.payload;
    const body = {message:data.message};
    let careerApply = ApiPaths.CAREERS_APPLY;
    let carrerApplyPath = careerApply.replace('{job_id}',data.job_id);
    const response = yield fetch(getApiPath(carrerApplyPath), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 200 || response.status === 201) {
      yield put({
        type: CareersActionTypes.CONTACT_SUCCESS
      });
    }
  } catch (error) {
    yield put({
      type: CareersActionTypes.CONTACT_FAILED,
      payload: 'Your information is invalid.'
    });
  }
}

export const CareersSaga = [
  takeLatest(CareersActionTypes.CAREERS_FETCH_REQUEST, watchFetchCareers),
  takeLatest(CareersActionTypes.CONTACT_REQUEST, watchContact)
];
