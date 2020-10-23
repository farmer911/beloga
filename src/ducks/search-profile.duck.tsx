import axios from 'axios';
import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';
import { ApiPaths } from '../commons/constants';
import { getApiPath } from '../utils';
import { apiConfig } from '../commons/constants/pagination';

export enum SearchActionTypes {
  SEARCH_USER_REQUEST = '@@SEARCH/SEARCH_USER_REQUEST',
  SEARCH_USER_SUCCESS = '@@SEARCH/SEARCH_USER_SUCCESS',
  SEARCH_USER_ERROR = '@@SEARCH/SEARCH_USER_ERROR',

  SEARCH_USER_SUGGEST_REQUEST = '@@SEARCH/SEARCH_USER_SUGGEST_REQUEST',
  SEARCH_USER_SUGGEST_SUCCESS = '@@SEARCH/SEARCH_USER_SUGGEST_SUCCESS',
  SEARCH_USER_SUGGEST_ERROR = '@@SEARCH/SEARCH_USER_SUGGEST_ERROR',

  SEARCH_USER_SUGGEST_RESET = '@@SEARCH/SEARCH_USER_SUGGEST_RESET',

  // SET_SEARCH_USER_PAGE_FIRST_LOAD = '@@SEARCH/SET_SEARCH_USER_PAGE_FIRST_LOAD',
  SET_ACTIVE_INDEX_SEARCH_SUGGEST = '@@SEARCH/SET_ACTIVE_INDEX_SEARCH_SUGGEST',

  SEARCH_STORE_PARAMS = '@@SEARCH/SEARCH_STORE_PARAMS',
  SEARCH_RESET_DATA = '@@SEARCH/SEARCH_RESET_DATA',

  SEARCH_RESET_INFO_REQUEST = '@@SEARCH/SEARCH_RESET_INFO_REQUEST',
  SEARCH_RESET_INFO_SUCCESS = '@@SEARCH/SEARCH_RESET_INFO_SUCCESS'
}

// action creator
export const setActiveIndexSearchSuggest = (payload: number) => ({
  type: SearchActionTypes.SET_ACTIVE_INDEX_SEARCH_SUGGEST,
  payload
});
// export const setSearchPageFirstLoadFlag = (payload: boolean) => ({
//   type: SearchActionTypes.SET_SEARCH_USER_PAGE_FIRST_LOAD,
//   payload
// });
export const requestSearchSuggest = (payload: SearchParams) => ({
  type: SearchActionTypes.SEARCH_USER_SUGGEST_REQUEST,
  payload
});

export const requestSearch = (payload: SearchParams) => ({
  type: SearchActionTypes.SEARCH_USER_REQUEST,
  payload
});

export const storeSearchParams = (payload: any) => ({
  type: SearchActionTypes.SEARCH_STORE_PARAMS,
  payload
});

export const resetResponseData = () => ({
  type: SearchActionTypes.SEARCH_RESET_DATA
});

export const locationResetInfoAction = () => ({
  type: SearchActionTypes.SEARCH_RESET_INFO_REQUEST
});

export const resetSearchUserSuggest = () => ({
  type: SearchActionTypes.SEARCH_USER_SUGGEST_RESET
});

interface SearchState {
  readonly response: any;
  readonly error: any;
  readonly isLoadingSearch: boolean;
  readonly params: any;
  readonly responseSuggest: any;
  readonly errorSuggest: any;
  readonly isLoadingSearchSuggest: boolean;
  // readonly isFirstLoadPage: boolean;
  readonly activeIndexSuggest: number;
}

const initialState: SearchState = {
  response: {},
  error: undefined,
  isLoadingSearch: false,
  params: {},
  responseSuggest: {},
  errorSuggest: undefined,
  isLoadingSearchSuggest: false,
  // isFirstLoadPage: false,
  activeIndexSuggest: -1
};

export const SearchReducer: Reducer<SearchState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case SearchActionTypes.SEARCH_USER_REQUEST: {
      return {
        ...state,
        isLoadingSearch: true,
        response: {}
      };
    }

    case SearchActionTypes.SEARCH_USER_ERROR: {
      return {
        ...state,
        error: action.payload,
        isLoadingSearch: false
      };
    }

    case SearchActionTypes.SEARCH_USER_SUCCESS: {
      return {
        ...state,
        response: action.payload,
        isLoadingSearch: false
      };
    }

    case SearchActionTypes.SEARCH_USER_SUGGEST_REQUEST: {
      return {
        ...state,
        isLoadingSearchSuggest: true,
        responseSuggest: {}
      };
    }

    case SearchActionTypes.SEARCH_USER_SUGGEST_ERROR: {
      return {
        ...state,
        errorSuggest: action.payload,
        isLoadingSearchSuggest: false
      };
    }

    case SearchActionTypes.SEARCH_USER_SUGGEST_SUCCESS: {
      return {
        ...state,
        responseSuggest: action.payload,
        isLoadingSearchSuggest: false
      };
    }

    // case SearchActionTypes.SET_SEARCH_USER_PAGE_FIRST_LOAD: {
    //   return {
    //     ...state,
    //     isFirstLoadPage: action.payload
    //   };
    // }

    case SearchActionTypes.SEARCH_USER_SUGGEST_RESET: {
      return {
        ...state,
        responseSuggest: {},
        errorSuggest: undefined,
        isLoadingSearchSuggest: false
      };
    }

    case SearchActionTypes.SET_ACTIVE_INDEX_SEARCH_SUGGEST: {
      return {
        ...state,
        activeIndexSuggest: action.payload
      };
    }

    case SearchActionTypes.SEARCH_STORE_PARAMS: {
      return {
        ...state,
        params: action.payload
      };
    }

    case SearchActionTypes.SEARCH_RESET_DATA: {
      return {
        ...state,
        response: {},
        error: undefined
      };
    }

    default: {
      return state;
    }
  }
};

// selector
export const selectListUser = (state: any) => state.SearchReducer.users;
export const selectLoadingSearch = (state: any) => state.SearchReducer.isLoading;

// side effect
function* watchSearchUser(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const { data, err } = yield apiSearchUser(action.payload);
    if (data) {
      yield put({ type: SearchActionTypes.SEARCH_USER_SUCCESS, payload: data });
    } else if (err) {
      yield put({ type: SearchActionTypes.SEARCH_USER_ERROR, payload: err });
    }
  } catch (error) {
    yield put({ type: SearchActionTypes.SEARCH_USER_ERROR, payload: error });
    yield handleCommonError(error.code);
  }
}

function* watchSearchUserSuggest(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, err } = yield apiSearchUser(action.payload);
    if (data) {
      yield put({ type: SearchActionTypes.SEARCH_USER_SUGGEST_SUCCESS, payload: data });
    } else if (err) {
      yield put({ type: SearchActionTypes.SEARCH_USER_SUGGEST_ERROR, payload: err });
    }
  } catch (error) {
    yield put({ type: SearchActionTypes.SEARCH_USER_SUGGEST_ERROR, payload: error });
    yield handleCommonError(error.code);
  }
}

export const SearchProfile = [
  takeLatest(SearchActionTypes.SEARCH_USER_REQUEST, watchSearchUser),
  takeLatest(SearchActionTypes.SEARCH_USER_SUGGEST_REQUEST, watchSearchUserSuggest)
];

export type SearchParams = {
  page: number;
  key: string;
  // limit: number;
};

const apiSearchUser = (body: SearchParams) => {
  const searchUrl = getApiPath(`${ApiPaths.SEARCH_PROFILE}?key=${body.key}&page=${body.page}&limit=${apiConfig.limit}`);
  return axios.get(searchUrl)
    .then(res => {
      return {
        data: res.data
      };
    })
    .catch(err => {
      err;
    });
};
