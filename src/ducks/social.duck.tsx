import axios from 'axios';
import { Reducer } from 'redux';
import { ActionBaseType, LoginType, LoginSocialType, ActivateType } from '../commons/types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { AuthActionTypes } from './auth.duck';
import { UserActionTypes } from './user.duck';
import { delay } from 'redux-saga';
import { getApiPath } from '../utils';
import { ApiPaths, HttpCodes } from '../commons/constants';
import { handleCommonError, NotificationService } from '../services';

export enum SocialConnect {
    FACEBOOK_CONNECT = '@@FACEBOOK/FACEBOOK_CONNECT',
    LINKEDIN_CONNECT = '@@LOGIN/LINKEDIN_CONNECT',
    TWITTER_CONNECT = '@@TWITTER/TWITTER_CONNECT',
    INSTAGRAM_CONNECT = '@@INSTAGRAM/INSTAGRAM_CONNECT',
}
export const facebookConnectAction = (token: LoginSocialType): ActionBaseType => {
    return {
        type: SocialConnect.FACEBOOK_CONNECT,
        payload: { token }
    };
};
export const linkedinConnectAction = (token: LoginSocialType): ActionBaseType => {
    return {
        type: SocialConnect.LINKEDIN_CONNECT,
        payload: { token }
    };
};
export const twitterConnectAction = (token: LoginSocialType): ActionBaseType => {
    return {
        type: SocialConnect.TWITTER_CONNECT,
        payload: { token }
    };
};
export const instagramConnectAction = (token: LoginSocialType): ActionBaseType => {
    return {
        type: SocialConnect.INSTAGRAM_CONNECT,
        payload: { token }
    };
};

interface SocialState {
    readonly data: any[];
    readonly isLoading: boolean;
}

const initialState: SocialState = {
    data: [],
    isLoading: false
};

export const SocialReducer: Reducer<SocialState, ActionBaseType> = (state = initialState, action) => {
    switch (action.type) {
        case SocialConnect.FACEBOOK_CONNECT: {
            return { ...state };
        }
        case SocialConnect.LINKEDIN_CONNECT: {
            return { ...state };
        }
        case SocialConnect.TWITTER_CONNECT: {
            return { ...state };
        }
        case SocialConnect.INSTAGRAM_CONNECT: {
            return { ...state };
        }
        default: {
            return state;
        }
    }
};
export const selectListSocial = (state: any) => state.SocialReducer.data;
export const selectIsLoading = (state: any) => state.SocialReducer.isLoading;

function* watchFacebookSocial(action: ActionBaseType): any {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const { token } = action.payload;
    const body = { access_token: token }
    yield call(delay, 300);
    try {
        yield fetch(getApiPath(ApiPaths.CONNECT_FACEBOOK), {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        yield put({
            type: AuthActionTypes.AUTH_CHECK_FINISH,
            payload: true
        });
    }
    catch (error) {
    }
}

function* watchLinkedinSocial(action: ActionBaseType): any {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const { token } = action.payload;
    const body = token;
    yield call(delay, 300);
    try {
        yield fetch(getApiPath(ApiPaths.CONNECT_LINKEDIN), {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        yield put({
            type: AuthActionTypes.AUTH_CHECK_FINISH,
            payload: true
        });
    }
    catch (error) {
    }
}

function* watchTwitterSocial(action: ActionBaseType): any {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const { token } = action.payload;
    const body = token;
    yield call(delay, 300);
    try {
        yield fetch(getApiPath(ApiPaths.CONNECT_TWITTER), {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        yield put({
            type: AuthActionTypes.AUTH_CHECK_FINISH,
            payload: true
        });
    }
    catch (error) {
    }
}

function* watchInstagramSocial(action: ActionBaseType): any {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const { token } = action.payload;
    const body = { access_token: token }
    yield call(delay, 300);
    try {
        yield fetch(getApiPath(ApiPaths.CONNECT_INSTAGRAM), {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        yield put({
            type: AuthActionTypes.AUTH_CHECK_FINISH,
            payload: true
        });
    }
    catch (error) {
    }
}
export const SocialSaga = [
    takeLatest(SocialConnect.FACEBOOK_CONNECT, watchFacebookSocial),
    takeLatest(SocialConnect.LINKEDIN_CONNECT, watchLinkedinSocial),
    takeLatest(SocialConnect.TWITTER_CONNECT, watchTwitterSocial),
    takeLatest(SocialConnect.INSTAGRAM_CONNECT, watchInstagramSocial),
];
