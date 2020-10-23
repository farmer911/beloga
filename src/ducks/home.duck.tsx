import { Reducer } from 'redux';
import { JobOpeningType, SearchType, VideoType } from '../commons/types/view-model';
import { put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

enum HomeActionTypes {
  FETCH_SEARCH_REQUEST = '@@Home/FETCH_SEARCH_REQUEST',
  FETCH_SEARCH_SUCCESS = '@@Home/FETCH_SEARCH_SUCCESS',
  FETCH_JOB_OPENINGS_REQUEST = '@@Home/FETCH_JOB_OPENINGS_REQUEST',
  FETCH_JOB_OPENINGS_SUCCESS = '@@Home/FETCH_JOB_OPENINGS_SUCCESS',
  FETCH_VIDEO_LIST_REQUEST = '@@HOME/FETCH_VIDEO_LIST_REQUEST',
  FETCH_VIDEO_LIST_SUCCESS = '@@HOME/FETCH_VIDEO_LIST_SUCCESS'
}

// action creator
export const searchRequestAction = (searchText: string): object => {
  return { type: HomeActionTypes.FETCH_SEARCH_REQUEST, payload: searchText };
};

export const getJobOpeningListAction = (): any => {
  return { type: HomeActionTypes.FETCH_JOB_OPENINGS_REQUEST };
};

export const getVideoListAction = (): any => {
  return { type: HomeActionTypes.FETCH_VIDEO_LIST_REQUEST };
};

// reducer
interface HomeState {
  readonly loading: boolean;
  readonly errors?: string;
  readonly selectedId: number;
  readonly jobs: JobOpeningType[];
  readonly searchData: SearchType[];
  readonly videoList: VideoType[];
}

const initialState: HomeState = {
  errors: undefined,
  loading: false,
  selectedId: 1,
  jobs: [],
  searchData: [],
  videoList: []
};

export const HomeReducer: Reducer<HomeState> = (state = initialState, action) => {
  switch (action.type) {
    case HomeActionTypes.FETCH_SEARCH_SUCCESS: {
      return { ...state, loading: true, searchData: action.payload };
    }
    case HomeActionTypes.FETCH_JOB_OPENINGS_REQUEST: {
      return { ...state };
    }
    case HomeActionTypes.FETCH_JOB_OPENINGS_SUCCESS: {
      return { ...state, jobs: action.payload };
    }
    case HomeActionTypes.FETCH_VIDEO_LIST_REQUEST: {
      return { ...state };
    }
    case HomeActionTypes.FETCH_VIDEO_LIST_SUCCESS: {
      return { ...state, videoList: action.payload };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectSearchResult = (state: any) => state.HomeReducer.searchData;
export const selectJobOpeningsList = (state: any) => state.HomeReducer.jobs;
export const selectVideoList = (state: any) => state.HomeReducer.videoList;

// side effect
function* watchFetchSearchRequest(action: any): any {
  yield call(delay, 700);
  const searchText = action.payload;
  let searchResult = [];
  if (searchText.trim() !== '') {
    searchResult = yield fetch(
      `https://5ba1fe9bee710f0014dd76ce.mockapi.io/api/v1/JobOpennings?search=${searchText}`
    ).then(res => {
      return res.json();
    });
  }

  yield put({
    type: HomeActionTypes.FETCH_SEARCH_SUCCESS,
    payload: searchResult
  });
}

function* watchFetchJobOpeningData(): any {
  yield call(delay, 700);
  const data: JobOpeningType = yield fetch('https://5ba1fe9bee710f0014dd76ce.mockapi.io/api/v1/JobOpennings').then(
    result => result.json()
  );

  yield put({
    type: HomeActionTypes.FETCH_JOB_OPENINGS_SUCCESS,
    payload: data
  });
}

function* watchFetchVideoList(): any {
  yield call(delay, 300);
  const data = [
    {
      videoItem: {
        title: 'Youtube video',
        videoSource: 'http://techslides.com/demos/sample-videos/small.mp4',
        showTitle: false,
        backgroundImage: '/images/blog-1.jpg'
      },
      postTitle: 'Stuff I like to do on',
      postDetail: 'This is detail of component video list item'
    },
    {
      videoItem: {
        title: 'Youtube video',
        videoSource: 'http://techslides.com/demos/sample-videos/small.mp4',
        showTitle: false,
        backgroundImage: '/images/blog-1.jpg'
      },
      postTitle: 'Stuff I like to do on',
      postDetail: 'This is detail of component video list item'
    }
  ];
  yield put({
    type: HomeActionTypes.FETCH_VIDEO_LIST_SUCCESS,
    payload: data
  });
}

export const HomeSaga = [
  takeLatest(HomeActionTypes.FETCH_SEARCH_REQUEST, watchFetchSearchRequest),
  takeLatest(HomeActionTypes.FETCH_VIDEO_LIST_REQUEST, watchFetchVideoList),
  takeLatest(HomeActionTypes.FETCH_JOB_OPENINGS_REQUEST, watchFetchJobOpeningData)
];
