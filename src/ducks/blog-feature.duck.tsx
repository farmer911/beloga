import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';

export enum BlogFeatureActionTypes {
  BLOG_FEATURE_REQUEST = '@@BLOG/BLOG_FEATURE_REQUEST',
  BLOG_FEATURE_SUCCESS = '@@BLOG/BLOG_FEATURE_SUCCESS',
  BLOG_FEATURE_ERROR = '@@BLOG/BLOG_FEATURE_ERROR'
}

// action creator
export const blogFeatureAction = () => ({
  type: BlogFeatureActionTypes.BLOG_FEATURE_REQUEST
});

// reducer
interface BlogState {
  readonly data: any[];
  readonly isLoading: boolean;
}

const initialState: BlogState = {
  data: [],
  isLoading: false
};

export const BlogFeatureReducer: Reducer<BlogState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case BlogFeatureActionTypes.BLOG_FEATURE_REQUEST: {
      return { ...state, isLoading: true };
    }
    case BlogFeatureActionTypes.BLOG_FEATURE_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case BlogFeatureActionTypes.BLOG_FEATURE_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectListFeatureBlog = (state: any) => state.BlogFeatureReducer.data;
export const selectIsLoadingFeature = (state: any) => state.BlogFeatureReducer.isLoading;

// side effect
function* watchBlogFeature(): any {
  yield call(delay, 300);
  try {
    const data = yield api.Blog.feature(1, 100);
    yield put({
      type: BlogFeatureActionTypes.BLOG_FEATURE_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: BlogFeatureActionTypes.BLOG_FEATURE_ERROR
    });
  }
}

export const BlogFeatureSaga = [takeLatest(BlogFeatureActionTypes.BLOG_FEATURE_REQUEST, watchBlogFeature)];
