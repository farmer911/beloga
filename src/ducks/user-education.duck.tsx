import { Reducer } from 'redux';
import { EducationType, ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { delay } from 'redux-saga';
import { createUploadFileChannel, getApiPath } from '../utils';
import { handleCommonError, NotificationService } from '../services';
import { ApiPaths } from '../commons/constants';

export enum UserEducationActionTypes {
  EDUCATION_FETCH_REQUEST = '@@USER/EDUCATION_FETCH_REQUEST',
  EDUCATION_FETCH_SUCCESS = '@@USER/EDUCATION_FETCH_SUCCESS',
  EDUCATION_UPDATE_REQUEST = '@@USER/EDUCATION_UPDATE_REQUEST',
  EDUCATION_UPDATE_SUCCESS = '@@USER/EDUCATION_UPDATE_SUCCESS',
  EDUCATION_UPDATE_ERROR = '@@USER/EDUCATION_UPDATE_ERROR',
  EDUCATION_ADD_REQUEST = '@@USER/EDUCATION_ADD_REQUEST',
  EDUCATION_ADD_SUCCESS = '@@USER/EDUCATION_ADD_SUCCESS',
  EDUCATION_ADD_ERROR = '@@USER/EDUCATION_ADD_ERROR',
  EDUCATION_DELETE_REQUEST = '@@USER/EDUCATION_DELETE_REQUEST',
  EDUCATION_DELETE_SUCCESS = '@@USER/EDUCATION_DELETE_SUCCESS',
  EDUCATION_DELETE_ERROR = '@@USER/EDUCATION_DELETE_ERROR',
  EDUCATION_UPLOAD_IMAGE_REQUEST = '@@USER/EDUCATION_UPLOAD_IMAGE_REQUEST',
  EDUCATION_UPLOAD_IMAGE_SUCCESS = '@@USER/EDUCATION_UPLOAD_IMAGE_SUCCESS',
  EDUCATION_UPLOAD_IMAGE_ERROR = '@@USER/EDUCATION_UPLOAD_IMAGE_ERROR',
  EDUCATION_ARRANGE_REQUEST = '@@USER/EDUCATION_ARRANGE_REQUEST',
  EDUCATION_ARRANGE_SUCCESS = '@@USER/EDUCATION_ARRANGE_SUCCESS',
  EDUCATION_ARRANGE_ERROR = '@@USER/EDUCATION_ARRANGE_ERROR'
}

// action creator
export const uploadLogoEducationAction = (file: File, id: any) => ({
  type: UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_REQUEST,
  payload: { file: file, id: id }
});

export const getEducationDataAction = (id: string, data: any): ActionBaseType => {
  return {
    type: UserEducationActionTypes.EDUCATION_FETCH_REQUEST,
    payload: { id, data }
  };
};

export const addEducationDataAction = (data: any, logoFile: File): ActionBaseType => {
  return {
    type: UserEducationActionTypes.EDUCATION_ADD_REQUEST,
    payload: { data, logoFile }
  };
};

export const updateEducationDataAction = (id: string, data: any, logoFile: File): ActionBaseType => {
  return {
    type: UserEducationActionTypes.EDUCATION_UPDATE_REQUEST,
    payload: { id, data, logoFile }
  };
};

export const deleteEducationDataAction = (id: string): ActionBaseType => {
  return {
    type: UserEducationActionTypes.EDUCATION_DELETE_REQUEST,
    payload: id
  };
};
export const arrangeEducation = (data: any): ActionBaseType => {
  return {
    type: UserEducationActionTypes.EDUCATION_ARRANGE_REQUEST,
    payload: data
  };
};

// reducer
interface UserState {
  readonly educationData: EducationType[];
  readonly isGettingEducation: boolean;
  readonly isDeletingEducation: boolean;
}

const initialState: UserState = {
  educationData: [],
  isGettingEducation: false,
  isDeletingEducation: false
};

export const UserEducationReducer: Reducer<UserState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case UserEducationActionTypes.EDUCATION_FETCH_REQUEST: {
      return { ...state, isGettingEducation: true };
    }
    case UserEducationActionTypes.EDUCATION_FETCH_SUCCESS: {
      return {
        ...state,
        isGettingEducation: false,
        educationData: action.payload
      };
    }
    case UserEducationActionTypes.EDUCATION_ADD_SUCCESS: {
      const newEducationData = [action.payload, ...state.educationData];
      return { ...state, educationData: newEducationData };
    }
    case UserEducationActionTypes.EDUCATION_UPDATE_SUCCESS: {
      const { educationData } = state;
      const updatedItem = action.payload;
      const updatedEducationData = [...educationData];
      const indexOfUpdatedItem = updatedEducationData.findIndex((item: any) => item.id === updatedItem.id);
      if (indexOfUpdatedItem > -1) {
        updatedEducationData[indexOfUpdatedItem] = updatedItem;
      }
      return { ...state, educationData: updatedEducationData };
    }
    case UserEducationActionTypes.EDUCATION_DELETE_SUCCESS: {
      const { educationData } = state;
      const deletedItemId = action.payload;
      const updatedEducationData = [...educationData];
      const indexOfDeletedItem = updatedEducationData.findIndex((item: any) => item.id === deletedItemId);
      if (indexOfDeletedItem > -1) {
        updatedEducationData.splice(indexOfDeletedItem, 1);
      }
      return { ...state, educationData: updatedEducationData };
    }
    case UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_SUCCESS: {
      const { educationData } = state;
      const id = action.payload.id;
      const updatedEducationData = [...educationData];
      const indexOfDeletedItem = updatedEducationData.findIndex((item: any) => item.id === id);
      if (indexOfDeletedItem > -1) {
        updatedEducationData[indexOfDeletedItem] = action.payload;
      }
      return { ...state, educationData: updatedEducationData };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectEducationData = (state: any) => state.UserEducationReducer.educationData;
export const selectIsGettingEducation = (state: any) => state.UserEducationReducer.isGettingEducation;
export const selectIsDeletingEducation = (state: any) => state.UserEducationReducer.isDeletingEducation;

// side effect
function* watchFetchEducationData(): any {
  yield call(delay, 1000);
  try {
    const data = yield api.Profile.educationExperiences(1, 100);
    yield put({
      type: UserEducationActionTypes.EDUCATION_FETCH_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchAddEducationItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const { data, logoFile } = action.payload;
  try {
    const addedItem = yield api.Profile.addEducationExperience(data);
    addedItem.image_url = logoFile ? '' : addedItem.image_url;
    yield put({
      type: UserEducationActionTypes.EDUCATION_ADD_SUCCESS,
      payload: addedItem
    });
    if (logoFile) {
      yield put({
        type: UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_REQUEST,
        payload: { file: logoFile, id: addedItem.id }
      });
    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
  NotificationService.notify('Add education item successfully!');
}
//arrange
function* watchArrangeEducationItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const { data } = action.payload;
  try {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload;
    var id = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id) {
          id.push(data[i].id);
        }
      }
    }
    const body = { ids: id };
    const response = yield fetch(getApiPath(ApiPaths.ARRANGE_EDUCATION), {
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
        type: UserEducationActionTypes.EDUCATION_FETCH_SUCCESS,
        payload: data
      });
      // NotificationService.notify('Arrange education item successfully!');
    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}
function* watchUpdateEducationItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const { data, id, logoFile } = action.payload;
  try {
    const updateItem = yield api.Profile.updateEducationExperience(id, data);
    const item: any = { ...updateItem, id };
    yield put({
      type: UserEducationActionTypes.EDUCATION_UPDATE_SUCCESS,
      payload: item
    });
    if (logoFile) {
      yield put({
        type: UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_REQUEST,
        payload: { file: logoFile, id: id }
      });
    }
    NotificationService.notify('Update education item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchDeleteEducationItem(action: ActionBaseType): any {
  yield call(delay, 500);
  const id = action.payload;
  try {
    yield api.Profile.deleteEducationExperience(id);
    yield put({
      type: UserEducationActionTypes.EDUCATION_DELETE_SUCCESS,
      payload: id
    });
    NotificationService.notify('Delete education item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUploadImageEducationItem(action: ActionBaseType) {
  try {
    const headers = yield api.Auth.getAuthorizationHeaders();
    const channel = yield call(
      createUploadFileChannel,
      getApiPath(`/profile/education-experiences/${action.payload.id}/logo/`),
      headers,
      action.payload.file,
      'avatar.png',
      'image/png',
      'image'
    );
    while (true) {
      const { progress = 0, err, success, res } = yield take(channel);
      if (success) {
        yield put({
          type: UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_SUCCESS,
          payload: res.data
        });
        return;
      }
      if (err) {
        yield put({
          type: UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_ERROR,
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

export const UserEducationSaga = [
  takeLatest(UserEducationActionTypes.EDUCATION_FETCH_REQUEST, watchFetchEducationData),
  takeLatest(UserEducationActionTypes.EDUCATION_UPDATE_REQUEST, watchUpdateEducationItem),
  takeLatest(UserEducationActionTypes.EDUCATION_ADD_REQUEST, watchAddEducationItem),
  takeLatest(UserEducationActionTypes.EDUCATION_DELETE_REQUEST, watchDeleteEducationItem),
  takeLatest(UserEducationActionTypes.EDUCATION_UPLOAD_IMAGE_REQUEST, watchUploadImageEducationItem),
  takeLatest(UserEducationActionTypes.EDUCATION_ARRANGE_REQUEST, watchArrangeEducationItem)
];
