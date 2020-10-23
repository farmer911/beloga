import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';

export enum InterestActionTypes {
  INTEREST_FETCH_REQUEST = '@@INTEREST/INTEREST_FETCH_REQUEST',
  INTEREST_FETCH_SUCCESS = '@@INTEREST/INTEREST_FETCH_SUCCESS',
  INTEREST_FETCH_ERROR = '@@INTEREST/INTEREST_FETCH_ERROR'
}

// action creator
export const fetchInterestAction = () => ({
  type: InterestActionTypes.INTEREST_FETCH_REQUEST
});

// reducer
interface LocationState {
  readonly data: any[];
}

const initialState: LocationState = {
  data: []
};

export const InterestReducer: Reducer<LocationState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case InterestActionTypes.INTEREST_FETCH_SUCCESS: {
      return { ...state, data: action.payload };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectInterest = (state: any) => state.InterestReducer.data;

// side effect
function* watchFetchInterest(): any {
  yield call(delay, 300);
  try {
    const data = yield api.Interest.interests(1, 100);
    yield put({
      type: InterestActionTypes.INTEREST_FETCH_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

export const InterestSaga = [takeLatest(InterestActionTypes.INTEREST_FETCH_REQUEST, watchFetchInterest)];
