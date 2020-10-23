import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { handleCommonError, NotificationService } from '../services';
import { delay } from 'redux-saga';

export enum BlogDetailActionTypes {
  BLOG_DETAIL_REQUEST = '@@BLOG/BLOG_DETAIL_REQUEST',
  BLOG_DETAIL_SUCCESS = '@@BLOG/BLOG_DETAIL_SUCCESS',
  BLOG_DETAIL_ERROR = '@@BLOG/BLOG_DETAIL_ERROR'
}

// action creator
export const getBlogDetailAction = (blogSlug: string) => ({
  type: BlogDetailActionTypes.BLOG_DETAIL_REQUEST,
  payload: blogSlug
});

// reducer
interface BlogDetailState {
  readonly blog: any;
  readonly isLoading: boolean;
  readonly isSlug: boolean;
}

const initialState: BlogDetailState = {
  blog: undefined,
  isLoading: false,
  isSlug: true
};

export const BlogDetailReducer: Reducer<BlogDetailState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case BlogDetailActionTypes.BLOG_DETAIL_REQUEST: {
      return { ...state, blog: undefined, isLoading: true, isSlug:true };
    }
    case BlogDetailActionTypes.BLOG_DETAIL_SUCCESS: {
      return { ...state, blog: action.payload, isLoading: false, isSlug:true };
    }
    case BlogDetailActionTypes.BLOG_DETAIL_ERROR: {
      return { ...state, blog: undefined, isLoading: false, isSlug:false };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectBlogDetail = (state: any) => state.BlogDetailReducer.blog;
export const selectIsLoading = (state: any) => state.BlogDetailReducer.isLoading;
export const selectIsSlug = (state: any) => state.BlogDetailReducer.isSlug;

// side effect
function* watchDetailBlog(action: ActionBaseType): any {
  yield call(delay, 300);
  try {
    const data = yield api.Blog.getBlogDetail(action.payload);
    yield put({
      type: BlogDetailActionTypes.BLOG_DETAIL_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield handleCommonError(error.code);
    yield put({
      type: BlogDetailActionTypes.BLOG_DETAIL_ERROR
    });
  }
}

export const BlogDetailSaga = [takeLatest(BlogDetailActionTypes.BLOG_DETAIL_REQUEST, watchDetailBlog)];
