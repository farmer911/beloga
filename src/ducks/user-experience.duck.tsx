import { Reducer } from 'redux';
import { ExperienceType, ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { delay } from 'redux-saga';
import { createUploadFileChannel, getApiPath } from '../utils';
import { handleCommonError, NotificationService } from '../services';
import { ApiPaths } from './../commons/constants/api-paths';

export enum UserExperienceActionTypes {
  EXPERIENCE_FETCH_REQUEST = '@@USER/EXPERIENCE_FETCH_REQUEST',
  EXPERIENCE_FETCH_SUCCESS = '@@USER/EXPERIENCE_FETCH_SUCCESS',
  EXPERIENCE_UPDATE_REQUEST = '@@USER/EXPERIENCE_UPDATE_REQUEST',
  EXPERIENCE_UPDATE_SUCCESS = '@@USER/EXPERIENCE_UPDATE_SUCCESS',
  EXPERIENCE_UPDATE_ERROR = '@@USER/EXPERIENCE_UPDATE_ERROR',
  EXPERIENCE_ADD_REQUEST = '@@USER/EXPERIENCE_ADD_REQUEST',
  EXPERIENCE_ADD_SUCCESS = '@@USER/EXPERIENCE_ADD_SUCCESS',
  EXPERIENCE_ADD_ERROR = '@@USER/EXPERIENCE_ADD_ERROR',
  EXPERIENCE_DELETE_REQUEST = '@@USER/EXPERIENCE_DELETE_REQUEST',
  EXPERIENCE_DELETE_SUCCESS = '@@USER/EXPERIENCE_DELETE_SUCCESS',
  EXPERIENCE_DELETE_ERROR = '@@USER/EXPERIENCE_DELETE_ERROR',
  EXPERIENCE_UPLOAD_IMAGE_REQUEST = '@@USER/EXPERIENCE_UPLOAD_IMAGE_REQUEST',
  EXPERIENCE_UPLOAD_IMAGE_SUCCESS = '@@USER/EXPERIENCE_UPLOAD_IMAGE_SUCCESS',
  EXPERIENCE_UPLOAD_IMAGE_ERROR = '@@USER/EXPERIENCE_UPLOAD_IMAGE_ERROR',
  EXPERIENCE_ARRANGE_REQUEST = '@@USER/EXPERIENCE_ARRANGE_REQUEST',
  EXPERIENCE_ARRANGE_SUCCESS = '@@USER/EXPERIENCE_ARRANGE_SUCCESS',
  EXPERIENCE_ARRANGE_ERROR = '@@USER/EXPERIENCE_ARRANGE_ERROR',
}

// action creator
export const uploadLogoExperienceAction = (file: File, id: any) => ({
  type: UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_REQUEST,
  payload: { file: file, id: id }
});

export const getExperienceDataAction = (): ActionBaseType => {
  return {
    type: UserExperienceActionTypes.EXPERIENCE_FETCH_REQUEST
  };
};

export const addExperienceDataAction = (data: any, logoFile: File): ActionBaseType => {
  return {
    type: UserExperienceActionTypes.EXPERIENCE_ADD_REQUEST,
    payload: { data, logoFile }
  };
};

export const updateExperienceDataAction = (id: string, data: any, logoFile: File): ActionBaseType => {
  return {
    type: UserExperienceActionTypes.EXPERIENCE_UPDATE_REQUEST,
    payload: { id, data, logoFile }
  };
};

export const deleteExperienceDataAction = (id: string): ActionBaseType => {
  return {
    type: UserExperienceActionTypes.EXPERIENCE_DELETE_REQUEST,
    payload: id
  };
};
export const arrangeExpAction = (data: any) => ({
  type: UserExperienceActionTypes.EXPERIENCE_ARRANGE_REQUEST,
    payload: data
});

// reducer
interface UserState {
  readonly experienceData: ExperienceType[];
  readonly isGettingExperience: boolean;
  readonly isDeletingExperience: boolean;
}

const initialState: UserState = {
  experienceData: [],
  isGettingExperience: false,
  isDeletingExperience: false
};

export const UserExperienceReducer: Reducer<UserState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    // Experience
    case UserExperienceActionTypes.EXPERIENCE_FETCH_REQUEST: {
      return { ...state, isGettingExperience: true };
    }
    case UserExperienceActionTypes.EXPERIENCE_FETCH_SUCCESS: {
      return {
        ...state,
        experienceData: action.payload,
        isGettingExperience: false
      };
    }
    case UserExperienceActionTypes.EXPERIENCE_ADD_SUCCESS: {
      const newData = [action.payload, ...state.experienceData];
      return { ...state, experienceData: newData };
    }
    case UserExperienceActionTypes.EXPERIENCE_UPDATE_SUCCESS: {
      const { experienceData } = state;
      const updatedItem = action.payload;
      const updatedExperienceData = [...experienceData];
      const indexOfUpdatedItem = updatedExperienceData.findIndex((item: any) => item.id === updatedItem.id);
      if (indexOfUpdatedItem > -1) {
        updatedExperienceData[indexOfUpdatedItem] = updatedItem;
      }
      return { ...state, experienceData: updatedExperienceData };
    }
    case UserExperienceActionTypes.EXPERIENCE_DELETE_SUCCESS: {
      const { experienceData } = state;
      const deletedItemId = action.payload;
      const updatedExperienceData = [...experienceData];
      const indexOfDeletedItem = updatedExperienceData.findIndex((item: any) => item.id === deletedItemId);
      if (indexOfDeletedItem > -1) {
        updatedExperienceData.splice(indexOfDeletedItem, 1);
      }
      return { ...state, experienceData: updatedExperienceData };
    }
    case UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_SUCCESS: {
      const { experienceData } = state;
      const id = action.payload.id;
      const updatedExperienceData = [...experienceData];
      const indexOfDeletedItem = updatedExperienceData.findIndex((item: any) => item.id === id);
      if (indexOfDeletedItem > -1) {
        updatedExperienceData[indexOfDeletedItem] = action.payload;
      }
      return { ...state, experienceData: updatedExperienceData };
    }
    case UserExperienceActionTypes.EXPERIENCE_ARRANGE_REQUEST: {
      return { ...state };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectExperienceData = (state: any) => state.UserExperienceReducer.experienceData;
export const selectIsGettingExperience = (state: any) => state.UserExperienceReducer.isGettingExperience;
export const selectIsDeletingExperience = (state: any) => state.UserExperienceReducer.isDeletingExperience;

// side effect
function* watchFetchExperienceData(): any {
  yield call(delay, 1000);
  try {
    const data = yield api.Profile.jobExperiences(1, 100);
    yield put({
      type: UserExperienceActionTypes.EXPERIENCE_FETCH_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    // error
    yield handleCommonError(error.code);
  }
}

function* watchAddExperienceItem(action: ActionBaseType): any {
  const { data, logoFile } = action.payload;
  try {
    const addItem = yield api.Profile.addJobExperience(data);
    addItem.image_url = logoFile ? '' : addItem.image_url;
    yield put({
      type: UserExperienceActionTypes.EXPERIENCE_ADD_SUCCESS,
      payload: addItem
    });
    if (logoFile) {
      yield put({
        type: UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_REQUEST,
        payload: { id: addItem.id, file: logoFile }
      });
    }
    NotificationService.notify('Add experience item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchArrangeExperienceItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const { data } = action.payload;
  try {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload;
    var id=[];
    // console.log(data)
    if(data && data.length>0){
      for(let i=0; i< data.length; i++){
        if(data[i].id){
          id.push(data[i].id);
        }
      }
    }
    const body = {ids:id};
    // console.log('body',body)
    const response = yield fetch(getApiPath(ApiPaths.ARRANGE_EXP), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 200 || response.status === 201) {
      // yield put({
      //   type: UserEducationActionTypes.EDUCATION_ARRANGE_SUCCESS,
      //   payload: data
      // });
      yield put({
        type: UserExperienceActionTypes.EXPERIENCE_FETCH_SUCCESS,
        payload: data
      });
    // NotificationService.notify('Arrange experience item successfully!');

    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}


function* watchUpdateExperienceItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const { data, id, logoFile } = action.payload;
  try {
    if (data) {
      const updateItem = yield api.Profile.updateJobExperience(id, data);
      const item: any = { ...updateItem, id };
      yield put({
        type: UserExperienceActionTypes.EXPERIENCE_UPDATE_SUCCESS,
        payload: item
      });
    }
    if (logoFile) {
      yield put({
        type: UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_REQUEST,
        payload: { file: logoFile, id }
      });
    }
    NotificationService.notify('Update experience item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchDeleteExperienceItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const id = action.payload;
  try {
    yield api.Profile.deleteJobExperience(id);
    yield put({
      type: UserExperienceActionTypes.EXPERIENCE_DELETE_SUCCESS,
      payload: id
    });
    NotificationService.notify('Delete experience item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUploadImageExperienceItem(action: ActionBaseType) {
  try {
    const headers = yield api.Auth.getAuthorizationHeaders();
    const channel = yield call(
      createUploadFileChannel,
      getApiPath(`/profile/job-experiences/${action.payload.id}/logo/`),
      headers,
      action.payload.file,
      'avatar.png',
      'image/png',
      'image'
    );
    while (true) {
      const { err, success, res } = yield take(channel);
      if (success) {
        yield put({
          type: UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_SUCCESS,
          payload: res.data
        });
        return;
      }
      if (err) {
        yield put({
          type: UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_ERROR,
          payload: 'Upload failed'
        });
        return;
      }
      // yield put({
      //   type: UserActionTypes.UPLOAD_AVATAR_PROGRESS,
      //   payload: progress
      // }); Check progress
    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

export const UserExperienceSaga = [
  takeLatest(UserExperienceActionTypes.EXPERIENCE_FETCH_REQUEST, watchFetchExperienceData),
  takeLatest(UserExperienceActionTypes.EXPERIENCE_UPDATE_REQUEST, watchUpdateExperienceItem),
  takeLatest(UserExperienceActionTypes.EXPERIENCE_ADD_REQUEST, watchAddExperienceItem),
  takeLatest(UserExperienceActionTypes.EXPERIENCE_DELETE_REQUEST, watchDeleteExperienceItem),
  takeLatest(UserExperienceActionTypes.EXPERIENCE_UPLOAD_IMAGE_REQUEST, watchUploadImageExperienceItem),
  takeLatest(UserExperienceActionTypes.EXPERIENCE_ARRANGE_REQUEST, watchArrangeExperienceItem)
];
