import { Reducer } from 'redux';
import { UserType, ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { getApiPath } from '../utils';
import { delay } from 'redux-saga';
import { handleCommonError } from '../services';
import { ApiPaths } from '../commons/constants';

export enum UserPdfActionTypes {
  USER_EXPORT_PDF_REQUEST = '@@USER/EXPORT_PDF_REQUEST',
  USER_EXPORT_PDF_SUCCESS = '@@USER/EXPORT_PDF_SUCCESS',
  USER_EXPORT_PDF_RESET = '@@USER/EXPORT_PDF_RESET',
  USER_EXPORT_PDF_ERROR = '@@USER/EXPORT_PDF_ERROR'
}

export const exportProfilePdfAction = (id: string): ActionBaseType => {
  return {
    type: UserPdfActionTypes.USER_EXPORT_PDF_REQUEST,
    payload: id
  };
};

interface UserPdfState {
  readonly pdf_url: string;
  readonly isLoading: boolean;
}

const initialState: UserPdfState = {
  pdf_url: '',
  isLoading: false
};

export const UserPdfReducer: Reducer<UserPdfState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case UserPdfActionTypes.USER_EXPORT_PDF_REQUEST: {
      return { ...state, isLoading: true };
    }
    case UserPdfActionTypes.USER_EXPORT_PDF_SUCCESS: {
      return { ...state, pdf_url: action.payload, isLoading: false };
    }
    case UserPdfActionTypes.USER_EXPORT_PDF_RESET: {
      return { ...state, pdf_url: '', isLoading: false };
    }
    case UserPdfActionTypes.USER_EXPORT_PDF_ERROR: {
      return { ...state, isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export const selectIsLoadingPdf = (state: any) => state.UserPdfReducer.isLoading;
export const selectProfilePdfUrl = (state: any) => state.UserPdfReducer;

function* watchExportProfilePdf(action: ActionBaseType): any {
  try {
    let exportPath = ApiPaths.EXPORT_PDF;
    exportPath = exportPath.replace('{user_id}', action.payload);
    const response = yield fetch(getApiPath(exportPath), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    });
    if (response.url !== '') {
      yield put({
        type: UserPdfActionTypes.USER_EXPORT_PDF_SUCCESS,
        payload: response.url
      });
      /*yield put({
        type: UserPdfActionTypes.USER_EXPORT_PDF_RESET,
        payload: ''
      });*/
    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

export const UserPdfSaga = [takeLatest(UserPdfActionTypes.USER_EXPORT_PDF_REQUEST, watchExportProfilePdf)];
