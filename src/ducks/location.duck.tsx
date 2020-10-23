import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError } from '../services';
import { delay } from 'redux-saga';

export enum LocationActionTypes {
  LOCATION_FETCH_COUNTRY_REQUEST = '@@LOCATION/LOCATION_FETCH_COUNTRY_REQUEST',
  LOCATION_FETCH_COUNTRY_SUCCESS = '@@LOCATION/LOCATION_FETCH_COUNTRY_SUCCESS',
  LOCATION_FETCH_COUNTRY_ERROR = '@@LOCATION/LOCATION_FETCH_COUNTRY_ERROR',

  LOCATION_FETCH_STATE_REQUEST = '@@LOCATION/LOCATION_FETCH_STATE_REQUEST',
  LOCATION_FETCH_STATE_SUCCESS = '@@LOCATION/LOCATION_FETCH_STATE_SUCCESS',
  LOCATION_FETCH_STATE_ERROR = '@@LOCATION/LOCATION_FETCH_STATE_ERROR',

  LOCATION_FETCH_CITY_REQUEST = '@@LOCATION/LOCATION_FETCH_CITY_REQUEST',
  LOCATION_FETCH_CITY_SUCCESS = '@@LOCATION/LOCATION_FETCH_CITY_SUCCESS',
  LOCATION_FETCH_CITY_ERROR = '@@LOCATION/LOCATION_FETCH_CITY_ERROR',

  LOCATION_SWAP_ALL_CITY_REQUEST = '@@LOCATION/LOCATION_SWAP_ALL_CITY_REQUEST',
  LOCATION_SWAP_ALL_CITY_SUCCESS = '@@LOCATION/LOCATION_SWAP_ALL_CITY_SUCCESS',
  LOCATION_SWAP_ALL_CITY_ERROR = '@@LOCATION/LOCATION_SWAP_ALL_CITY_ERROR',

  LOCATION_SWAP_CITY_REQUEST = '@@LOCATION/LOCATION_SWAP_CITY_REQUEST',
  LOCATION_SWAP_CITY_SUCCESS = '@@LOCATION/LOCATION_SWAP_CITY_SUCCESS',
  LOCATION_SWAP_CITY_ERROR = '@@LOCATION/LOCATION_SWAP_CITY_ERROR',

  LOCATION_SWAP_ALL_STATE_REQUEST = '@@LOCATION/LOCATION_SWAP_ALL_STATE_REQUEST',
  LOCATION_SWAP_ALL_STATE_SUCCESS = '@@LOCATION/LOCATION_SWAP_ALL_STATE_SUCCESS',
  LOCATION_SWAP_ALL_STATE_ERROR = '@@LOCATION/LOCATION_SWAP_ALL_STATE_ERROR',

  LOCATION_SWAP_STATE_REQUEST = '@@LOCATION/LOCATION_SWAP_STATE_REQUEST',
  LOCATION_SWAP_STATE_SUCCESS = '@@LOCATION/LOCATION_SWAP_STATE_SUCCESS',
  LOCATION_SWAP_STATE_ERROR = '@@LOCATION/LOCATION_SWAP_STATE_ERROR',

  LOCATION_SWAP_ALL_COUNTRY_REQUEST = '@@LOCATION/LOCATION_SWAP_ALL_COUNTRY_REQUEST',
  LOCATION_SWAP_ALL_COUNTRY_SUCCESS = '@@LOCATION/LOCATION_SWAP_ALL_COUNTRY_SUCCESS',
  LOCATION_SWAP_ALL_COUNTRY_ERROR = '@@LOCATION/LOCATION_SWAP_ALL_COUNTRY_ERROR',

  LOCATION_RESET_INFO_REQUEST = '@@LOCATION/LOCATION_RESET_INFO_REQUEST',
  LOCATION_RESET_INFO_SUCCESS = '@@LOCATION/LOCATION_RESET_INFO_SUCCESS'
}

// action creator
export const fetchCountryAction = () => ({
  type: LocationActionTypes.LOCATION_FETCH_COUNTRY_REQUEST
});

export const fetchStateAction = (countryId: number) => ({
  type: LocationActionTypes.LOCATION_FETCH_STATE_REQUEST,
  payload: countryId
});

export const fetchCityAction = (countryId: number, stateId: number) => ({
  type: LocationActionTypes.LOCATION_FETCH_CITY_REQUEST,
  payload: { countryId, stateId }
});

export const swapAllCityAction = (keyword: string) => ({
  type: LocationActionTypes.LOCATION_SWAP_ALL_CITY_REQUEST,
  payload: keyword
});

export const swapCityDetailAction = (cityId: number) => ({
  type: LocationActionTypes.LOCATION_SWAP_CITY_REQUEST,
  payload: cityId
});

export const swapAllStateAction = (keyword: string) => ({
  type: LocationActionTypes.LOCATION_SWAP_ALL_STATE_REQUEST,
  payload: keyword
});

export const swapStateDetailAction = (stateId: number) => ({
  type: LocationActionTypes.LOCATION_SWAP_STATE_REQUEST,
  payload: stateId
});

export const swapAllCountryAction = (keyword: string) => ({
  type: LocationActionTypes.LOCATION_SWAP_ALL_COUNTRY_REQUEST,
  payload: keyword
});

export const locationResetInfoAction = () => ({
  type: LocationActionTypes.LOCATION_RESET_INFO_REQUEST
});

// reducer
interface LocationState {
  readonly countries: any[];
  readonly states: any[];
  readonly cities: any[];
  readonly cityInfo: any;
  readonly stateInfo: any;
}

const initialState: LocationState = {
  countries: [],
  states: [],
  cities: [],
  cityInfo: undefined,
  stateInfo: undefined
};

export const LocationReducer: Reducer<LocationState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case LocationActionTypes.LOCATION_FETCH_COUNTRY_SUCCESS: {
      return { ...state, countries: action.payload, states: [], cities: [] };
    }
    case LocationActionTypes.LOCATION_FETCH_STATE_SUCCESS: {
      return { ...state, states: action.payload, cities: [] };
    }
    case LocationActionTypes.LOCATION_FETCH_CITY_SUCCESS: {
      return { ...state, cities: action.payload };
    }
    case LocationActionTypes.LOCATION_SWAP_ALL_CITY_SUCCESS: {
      return { ...state, cities: action.payload };
    }
    case LocationActionTypes.LOCATION_SWAP_CITY_SUCCESS: {
      return { ...state, cityInfo: action.payload };
    }
    case LocationActionTypes.LOCATION_SWAP_ALL_STATE_SUCCESS: {
      return { ...state, states: action.payload };
    }
    case LocationActionTypes.LOCATION_SWAP_STATE_SUCCESS: {
      return { ...state, stateInfo: action.payload };
    }
    case LocationActionTypes.LOCATION_SWAP_ALL_COUNTRY_SUCCESS: {
      return { ...state, countries: action.payload };
    }
    case LocationActionTypes.LOCATION_RESET_INFO_REQUEST: {
      return { ...state, cityInfo: undefined, stateInfo: undefined };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectCountries = (state: any) => state.LocationReducer.countries;
export const selectStates = (state: any) => state.LocationReducer.states;
export const selectCities = (state: any) => state.LocationReducer.cities;
export const selectCityInfo = (state: any) => state.LocationReducer.cityInfo;
export const selectStateInfo = (state: any) => state.LocationReducer.stateInfo;

// side effect
function* watchFetchCountry(): any {
  yield call(delay, 100);
  try {
    const data = yield api.Location.countries(1, 100);
    yield put({
      type: LocationActionTypes.LOCATION_FETCH_COUNTRY_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchFetchState(action: ActionBaseType): any {
  try {
    yield call(delay, 100);
    const countryId = action.payload;
    const data =
      countryId !== -1 && countryId !== undefined ? yield api.Location.states(countryId, 1, 100) : { results: [] };
    yield put({
      type: LocationActionTypes.LOCATION_FETCH_STATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchFetchCity(action: ActionBaseType): any {
  try {
    yield call(delay, 100);
    const { countryId, stateId } = action.payload;
    const data =
      stateId !== -1 && stateId !== undefined && countryId !== -1 && countryId !== undefined
        ? yield api.Location.cities(countryId, stateId, 1, 100)
        : { results: [] };
    yield put({
      type: LocationActionTypes.LOCATION_FETCH_CITY_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchSwapAllCity(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const keyword = action.payload;
    const data = yield api.Location.swapCities(keyword, 1, 100);
    yield put({
      type: LocationActionTypes.LOCATION_SWAP_ALL_CITY_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchSwapCityDetail(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const cityId = action.payload;
    const data = yield api.Location.swapCity(cityId);
    yield put({
      type: LocationActionTypes.LOCATION_SWAP_CITY_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchSwapAllState(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const keyword = action.payload;
    const data = yield api.Location.swapStates(keyword, 1, 100);
    yield put({
      type: LocationActionTypes.LOCATION_SWAP_ALL_STATE_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchSwapStateDetail(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const stateId = action.payload;
    const data = yield api.Location.swapState(stateId);
    yield put({
      type: LocationActionTypes.LOCATION_SWAP_STATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchSwapAllCountry(action: ActionBaseType): any {
  yield call(delay, 100);
  try {
    const keyword = action.payload;
    const data = yield api.Location.swapCountries(keyword, 1, 100);
    yield put({
      type: LocationActionTypes.LOCATION_SWAP_ALL_COUNTRY_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}
export const LocationSaga = [
  takeLatest(LocationActionTypes.LOCATION_FETCH_COUNTRY_REQUEST, watchFetchCountry),
  takeLatest(LocationActionTypes.LOCATION_FETCH_STATE_REQUEST, watchFetchState),
  takeLatest(LocationActionTypes.LOCATION_FETCH_CITY_REQUEST, watchFetchCity),
  takeLatest(LocationActionTypes.LOCATION_SWAP_ALL_CITY_REQUEST, watchSwapAllCity),
  takeLatest(LocationActionTypes.LOCATION_SWAP_CITY_REQUEST, watchSwapCityDetail),
  takeLatest(LocationActionTypes.LOCATION_SWAP_ALL_STATE_REQUEST, watchSwapAllState),
  takeLatest(LocationActionTypes.LOCATION_SWAP_STATE_REQUEST, watchSwapStateDetail),
  takeLatest(LocationActionTypes.LOCATION_SWAP_ALL_COUNTRY_REQUEST, watchSwapAllCountry)
];
