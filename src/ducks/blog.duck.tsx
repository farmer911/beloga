import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';

export enum BlogActionTypes {
  BLOG_FETCH_REQUEST = '@@BLOG/BLOG_FETCH_REQUEST',
  BLOG_FETCH_SUCCESS = '@@BLOG/BLOG_FETCH_SUCCESS',
  BLOG_FETCH_ERROR = '@@BLOG/BLOG_FETCH_ERROR'
}

// action creator
export const fetchBlogAction = () => ({
  type: BlogActionTypes.BLOG_FETCH_REQUEST
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

export const BlogReducer: Reducer<BlogState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case BlogActionTypes.BLOG_FETCH_REQUEST: {
      return { ...state, isLoading: true };
    }
    case BlogActionTypes.BLOG_FETCH_SUCCESS: {
      return { ...state, data: action.payload, isLoading: false };
    }
    case BlogActionTypes.BLOG_FETCH_ERROR: {
      return { ...state, data: [], isLoading: false };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectListBlog = (state: any) => state.BlogReducer.data;
export const selectIsLoading = (state: any) => state.BlogReducer.isLoading;

// side effect
function* watchFetchBlog(): any {
  yield call(delay, 300);
  try {
    const data = yield api.Blog.list(1, 100);
    yield put({
      type: BlogActionTypes.BLOG_FETCH_SUCCESS,
      payload: data
    });
    
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: BlogActionTypes.BLOG_FETCH_ERROR
    });
  }
}

export const BlogSaga = [takeLatest(BlogActionTypes.BLOG_FETCH_REQUEST, watchFetchBlog)];
