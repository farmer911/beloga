import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';

export enum CompanyActionTypes {
  COMPANY_FETCH_COMPANY_REQUEST = '@@COMPANY/COMPANY_FETCH_COMPANY_REQUEST',
  COMPANY_FETCH_COMPANY_SUCCESS = '@@COMPANY/COMPANY_FETCH_COMPANY_SUCCESS',
  COMPANY_FETCH_COMPANY_ERROR = '@@COMPANY/COMPANY_FETCH_COMPANY_ERROR'
}

// action creator
export const fetchCompanyAction = () => ({
  type: CompanyActionTypes.COMPANY_FETCH_COMPANY_REQUEST
});

// reducer
interface CompanyState {
  readonly companyList: any[];
}

const initialState: CompanyState = {
  companyList: []
};

export const CompanyReducer: Reducer<CompanyState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case CompanyActionTypes.COMPANY_FETCH_COMPANY_SUCCESS: {
      return { ...state, companyList: action.payload };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectCompanyList = (state: any) => state.CompanyReducer.companyList;

// side effect
function* watchFetchCompany(): any {
  yield call(delay, 100);
  try {
    const data = yield api.Profile.company(1, 100);
    yield put({
      type: CompanyActionTypes.COMPANY_FETCH_COMPANY_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

export const CompanySaga = [takeLatest(CompanyActionTypes.COMPANY_FETCH_COMPANY_REQUEST, watchFetchCompany)];
