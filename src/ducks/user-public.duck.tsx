import { Reducer } from 'redux';
import { UserType, ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { createUploadFileChannel, getApiPath } from '../utils';
import { createSelector } from 'reselect';
import { ApiPaths, HttpCodes, RoutePaths } from '../commons/constants';
import { delay } from 'redux-saga';
import { handleCommonError, NotificationService } from '../services';

export enum UserPublicActionTypes {
  USER_PUBLIC_INFO_REQUEST = '@@USER/USER_PUBLIC_INFO_REQUEST',
  USER_PUBLIC_INFO_SUCCESS = '@@USER/USER_PUBLIC_INFO_SUCCESS',
  USER_PUBLIC_INFO_FAILED = '@@USER/USER_PUBLIC_INFO_FAILED'
}

// action creator
export const getUserPublicAction = (username: string): ActionBaseType => {
  return {
    type: UserPublicActionTypes.USER_PUBLIC_INFO_REQUEST,
    payload: username
  };
};

interface UserPublicState {
  readonly userPublic?: UserType;
  readonly isLoading: boolean;
  readonly isUserExist: boolean;
}

const initialState: UserPublicState = {
  userPublic: undefined,
  isLoading: false,
  isUserExist: false
};

export const UserPublicReducer: Reducer<UserPublicState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    // user
    case UserPublicActionTypes.USER_PUBLIC_INFO_REQUEST: {
      return { ...state, isLoading: true };
    }
    case UserPublicActionTypes.USER_PUBLIC_INFO_SUCCESS: {
      return { ...state, userPublic: action.payload, isLoading: false, isUserExist: true };
    }
    case UserPublicActionTypes.USER_PUBLIC_INFO_FAILED: {
      return { ...state, userPublic: undefined, isLoading: false, isUserExist: false };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectIsLoading = (state: any) => state.UserPublicReducer.isLoading;
export const selectUserInfo = (state: any) => state.UserPublicReducer.userPublic;
export const selectUserInfoExist = (state: any) => state.UserPublicReducer.isUserExist;

// side effect
function* watchFetchUserInfoPublic(action: ActionBaseType): any {
  yield call(delay, 1000);
  try {
    let publicPath = ApiPaths.USER_PUBLIC;
    publicPath = publicPath.replace('{username}', action.payload);
    const profile = yield fetch(getApiPath(publicPath), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    });
    if (profile && profile.user) {
      let { user, ...flatProfile } = profile;
      user = { ...user };
      flatProfile = { ...flatProfile, ...user };
      yield put({
        type: UserPublicActionTypes.USER_PUBLIC_INFO_SUCCESS,
        payload: flatProfile
      });
    } else {
      yield put({
        type: UserPublicActionTypes.USER_PUBLIC_INFO_FAILED,
        payload: false
      });
      location.href = RoutePaths.NOT_FOUND;
    }
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: UserPublicActionTypes.USER_PUBLIC_INFO_FAILED,
      payload: false
    });
  }
}

export const UserPublicSaga = [takeLatest(UserPublicActionTypes.USER_PUBLIC_INFO_REQUEST, watchFetchUserInfoPublic)];
