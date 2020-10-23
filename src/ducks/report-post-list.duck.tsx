import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';
import { ApiPaths, RoutePaths } from '../commons/constants';
import { getApiPath } from '../utils';
import { api } from '@belooga/belooga-ts-sdk';

export enum ReportPostListActionTypes {
  POST_CONTENT_LIST_REQUEST = '@@POST_CONTENT_LIST/POST_CONTENT_LIST_REQUEST',
  POST_CONTENT_LIST_SUCCESS = '@@POST_CONTENT_LIST/POST_CONTENT_LIST_SUCCESS',
  POST_CONTENT_LIST_ERROR = '@@POST_CONTENT_LIST/POST_CONTENT_LIST_ERROR'
}

export const postContent = (user: Object, content: String) => ({
  type: ReportPostListActionTypes.POST_CONTENT_LIST_REQUEST,
  payload: { user, content }
});

interface ReportState {
  readonly data: any[];
  readonly isLoading: boolean;
}

const initialState: ReportState = {
  data: [],
  isLoading: false
};

export const ReportPostListReducer: Reducer<ReportState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case ReportPostListActionTypes.POST_CONTENT_LIST_REQUEST: {
      return { ...state, data: [], isLoading: true };
    }
    case ReportPostListActionTypes.POST_CONTENT_LIST_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case ReportPostListActionTypes.POST_CONTENT_LIST_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export const selectPostListData = (state: any) => state.ReportPostListReducer.data;
export const selectLoadingReportList = (state: any) => state.ReportPostListReducer.isLoading;
export const selectUser = (state: any) => state.UserPublicReducer.userPublic;

function* watchReportPostListData(action: ActionBaseType): any {
  try {
    let postPath = ApiPaths.POST_LIST;
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload;
    postPath = postPath + data.user.user_id + '/report/';
    const postData = yield fetch(getApiPath(postPath), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data.content })
    }).then(res => {
      return res.json();
    });
    yield put({
      type: ReportPostListActionTypes.POST_CONTENT_LIST_SUCCESS,
      payload: postData
    });
    NotificationService.notify(
      'Thank you for reporting this profile to our team. We take these violations very seriously and will be reviewing this issue immediately.'
    );
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: ReportPostListActionTypes.POST_CONTENT_LIST_ERROR
    });
    NotificationService.notify('Something wrong when trying to report this profile.');
  }
}

export const PostList = [takeLatest(ReportPostListActionTypes.POST_CONTENT_LIST_REQUEST, watchReportPostListData)];
