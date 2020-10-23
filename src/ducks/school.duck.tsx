import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';

export enum SchoolActionTypes {
  SCHOOL_FETCH_SCHOOL_REQUEST = '@@SCHOOL/SCHOOL_FETCH_SCHOOL_REQUEST',
  SCHOOL_FETCH_SCHOOL_SUCCESS = '@@SCHOOL/SCHOOL_FETCH_SCHOOL_SUCCESS',
  SCHOOL_FETCH_SCHOOL_ERROR = '@@SCHOOL/SCHOOL_FETCH_SCHOOL_ERROR'
}

// action creator
export const fetchSchoolAction = () => ({
  type: SchoolActionTypes.SCHOOL_FETCH_SCHOOL_REQUEST
});

// reducer
interface SchoolState {
  readonly schoolList: any[];
}

const initialState: SchoolState = {
  schoolList: []
};

export const SchoolReducer: Reducer<SchoolState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case SchoolActionTypes.SCHOOL_FETCH_SCHOOL_SUCCESS: {
      return { ...state, schoolList: action.payload, states: [], cities: [] };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectSchoolList = (state: any) => state.SchoolReducer.schoolList;

// side effect
function* watchFetchSchool(): any {
  yield call(delay, 100);
  try {
    const data = yield api.Profile.school(1, 100);
    yield put({
      type: SchoolActionTypes.SCHOOL_FETCH_SCHOOL_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

export const SchoolSaga = [takeLatest(SchoolActionTypes.SCHOOL_FETCH_SCHOOL_REQUEST, watchFetchSchool)];
