import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';
import { getApiPath } from '../utils';
import { ApiPaths } from './../commons/constants/api-paths';


export enum HelpActionTypes {
  HELP_FETCH_REQUEST = '@@HELP/HELP_FETCH_REQUEST',
  HELP_FETCH_SUCCESS = '@@HELP/HELP_FETCH_SUCCESS',
  HELP_FETCH_ERROR = '@@BHELP/HELP_FETCH_ERROR',
  HELP_VIDEO_FETCH_REQUEST = '@@HELP/HELP_VIDEO_FETCH_REQUEST',
  HELP_VIDEO_FETCH_SUCCESS = '@@HELP/HELP_VIDEO_FETCH_SUCCESS',
  HELP_VIDEO_FETCH_ERROR = '@@HELP/HELP_VIDEO_FETCH_ERROR',
}

// action creator
export const fetchHelpAction = () => ({
  type: HelpActionTypes.HELP_FETCH_REQUEST
});
export const fetchHelpVideoAction = () => ({
  type: HelpActionTypes.HELP_VIDEO_FETCH_REQUEST
});

// reducer
interface HelpState {
  readonly data: any[];
  readonly isLoading: boolean;
}

const initialState: HelpState = {
  data: [],
  isLoading: false
};

export const HelpReducer: Reducer<HelpState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case HelpActionTypes.HELP_FETCH_REQUEST: {
      return { ...state, isLoading: true };
    }
    case HelpActionTypes.HELP_FETCH_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case HelpActionTypes.HELP_FETCH_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    case HelpActionTypes.HELP_VIDEO_FETCH_REQUEST: {
      return { ...state, isLoading: true };
    }
    case HelpActionTypes.HELP_VIDEO_FETCH_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case HelpActionTypes.HELP_VIDEO_FETCH_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectListHelp = (state: any) => state.HelpReducer.data;
export const selectListHelpVideo = (state: any) => state.HelpReducer.data;
export const selectIsLoading = (state: any) => state.HelpReducer.isLoading;

// side effect
function* watchFetchHelp(): any {
  yield call(delay, 300);
  try {;
    const data = yield fetch(getApiPath(ApiPaths.FAQ), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res=>{
        return res.json();
    });
    yield put({
      type: HelpActionTypes.HELP_FETCH_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: HelpActionTypes.HELP_FETCH_ERROR
    });
  }
}
function* watchFetchHelpVideo(): any {
  yield call(delay, 300);
  try {;
    const data = yield fetch(getApiPath(ApiPaths.VIDEO_HELP), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res=>{
        return res.json();
    });
    yield put({
      type: HelpActionTypes.HELP_VIDEO_FETCH_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: HelpActionTypes.HELP_VIDEO_FETCH_ERROR
    });
  }
}
export const HelpSaga = [takeLatest(HelpActionTypes.HELP_FETCH_REQUEST, watchFetchHelp)];
export const HelpVideoSaga = [takeLatest(HelpActionTypes.HELP_VIDEO_FETCH_REQUEST, watchFetchHelpVideo)];
