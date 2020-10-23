import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';
import { ApiPaths, RoutePaths } from '../commons/constants';
import { getApiPath } from '../utils';
import { api } from '@belooga/belooga-ts-sdk';
import { AuthActionTypes } from './auth.duck';
import { string, any } from 'prop-types';

export enum ReportGetListActionTypes {
  REPORT_GET_LIST_REQUEST = '@@REPORT_GET_LIST/REPORT_GET_LIST_REQUEST',
  REPORT_GET_LIST_SUCCESS = '@@REPORT_GET_LIST/REPORT_GET_LIST_SUCCESS',
  REPORT_GET_LIST_ERROR = '@@REPORT_GET_LIST/REPORT_GET_LIST_ERROR'
}

export const reportAction = () => ({
  type: ReportGetListActionTypes.REPORT_GET_LIST_REQUEST
});

interface ReportState {
  readonly data: any[];
  readonly isLoading: boolean;
}

const initialState: ReportState = {
  data: [],
  isLoading: false
};

export const ReportGetListReducer: Reducer<ReportState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case ReportGetListActionTypes.REPORT_GET_LIST_REQUEST: {
      return { ...state, data: [], isLoading: true };
    }
    case ReportGetListActionTypes.REPORT_GET_LIST_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case ReportGetListActionTypes.REPORT_GET_LIST_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export const selectListData = (state: any) => state.ReportGetListReducer.data;
export const selectLoadingReportList = (state: any) => state.ReportGetListReducer.isLoading;

function* watchReportGetListData(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const reportPath = ApiPaths.REPORT_LIST;
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = yield fetch(getApiPath(reportPath), {
      method: 'GET',
      headers: { ...headers, 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    });
    yield put({
      type: ReportGetListActionTypes.REPORT_GET_LIST_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: ReportGetListActionTypes.REPORT_GET_LIST_ERROR
    });
  }
}

export const ReportList = [takeLatest(ReportGetListActionTypes.REPORT_GET_LIST_REQUEST, watchReportGetListData)];
