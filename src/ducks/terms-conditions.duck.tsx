import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';
import { ApiPaths, RoutePaths } from '../commons/constants';
import { getApiPath } from '../utils';

export enum TermConditionActionTypes {
  TERM_CONDITION_REQUEST = '@@TERM_CONDITION/TERM_CONDITION_REQUEST',
  TERM_CONDITION_SUCCESS = '@@TERM_CONDITION/TERM_CONDITION_SUCCESS',
  TERM_CONDITION_ERROR = '@@TERM_CONDITION/TERM_CONDITION_ERROR'
}

export const termAction = () => ({
  type: TermConditionActionTypes.TERM_CONDITION_REQUEST
});

interface TermConditionState {
  readonly data: any[];
  readonly isLoading: boolean;
}

const initialState: TermConditionState = {
  data: [],
  isLoading: false
};

export const TermConditionReducer: Reducer<TermConditionState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case TermConditionActionTypes.TERM_CONDITION_REQUEST: {
      return { ...state, data: [], isLoading: true };
    }
    case TermConditionActionTypes.TERM_CONDITION_ERROR: {
      return { ...state, error: action.payload, isLoading: false };
    }
    case TermConditionActionTypes.TERM_CONDITION_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export const selectListData = (state: any) => state.TermConditionReducer.data;
export const selectLoadingTermCondition = (state: any) => state.TermConditionReducer.isLoading;

function* watchTermConditionData(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    let termPath = ApiPaths.TERM_CONDITION;
    const term = yield fetch(getApiPath(termPath), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    });
    yield put({
      type: TermConditionActionTypes.TERM_CONDITION_SUCCESS,
      payload: Array.isArray(term) ? term : [term]
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: TermConditionActionTypes.TERM_CONDITION_ERROR,
    });
  }
  
}

export const TermCondition = [takeLatest(TermConditionActionTypes.TERM_CONDITION_REQUEST, watchTermConditionData)];