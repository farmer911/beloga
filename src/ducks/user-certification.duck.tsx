import { Reducer } from 'redux';
import { ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { delay } from 'redux-saga';
import { createUploadFileChannel, getApiPath } from '../utils';
import { handleCommonError, NotificationService } from '../services';
import { ApiPaths } from '../commons/constants';

export enum UserCertificationActionTypes {
  CERTIFICATE_FETCH_REQUEST = '@@USER/CERTIFICATE_FETCH_REQUEST',
  CERTIFICATE_FETCH_SUCCESS = '@@USER/CERTIFICATE_FETCH_SUCCESS',
  CERTIFICATE_UPDATE_REQUEST = '@@USER/CERTIFICATE_UPDATE_REQUEST',
  CERTIFICATE_UPDATE_SUCCESS = '@@USER/CERTIFICATE_UPDATE_SUCCESS',
  CERTIFICATE_UPDATE_ERROR = '@@USER/CERTIFICATE_UPDATE_ERROR',
  CERTIFICATE_ADD_REQUEST = '@@USER/CERTIFICATE_ADD_REQUEST',
  CERTIFICATE_ADD_SUCCESS = '@@USER/CERTIFICATE_ADD_SUCCESS',
  CERTIFICATE_ADD_ERROR = '@@USER/CERTIFICATE_ADD_ERROR',
  CERTIFICATE_DELETE_REQUEST = '@@USER/CERTIFICATE_DELETE_REQUEST',
  CERTIFICATE_DELETE_SUCCESS = '@@USER/CERTIFICATE_DELETE_SUCCESS',
  CERTIFICATE_DELETE_ERROR = '@@USER/CERTIFICATE_DELETE_ERROR',
  CERTIFICATE_UPLOAD_IMAGE_REQUEST = '@@USER/CERTIFICATE_UPLOAD_IMAGE_REQUEST',
  CERTIFICATE_UPLOAD_IMAGE_SUCCESS = '@@USER/CERTIFICATE_UPLOAD_IMAGE_SUCCESS',
  CERTIFICATE_UPLOAD_IMAGE_ERROR = '@@USER/CERTIFICATE_UPLOAD_IMAGE_ERROR',
  CERTIFICATE_ARRANGE_REQUEST = '@@USER/CERTIFICATE_ARRANGE_REQUEST',
  CERTIFICATE_ARRANGE_SUCCESS = '@@USER/CERTIFICATE_ARRANGE_SUCCESS',
  CERTIFICATE_ARRANGE_ERROR = '@@USER/CERTIFICATE_ARRANGE_ERROR',
}

// action creator
export const uploadImageCertificateAction = (file: File, id: any) => ({
  type: UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_REQUEST,
  payload: { file: file, id: id }
});

export const getCertificateDataAction = (id: string, data: any): ActionBaseType => {
  return {
    type: UserCertificationActionTypes.CERTIFICATE_FETCH_REQUEST,
    payload: { id, data }
  };
};

export const addCertificateDataAction = (data: any, logoFile: File): ActionBaseType => {
  return {
    type: UserCertificationActionTypes.CERTIFICATE_ADD_REQUEST,
    payload: { data, logoFile }
  };
};

export const updateCertificateDataAction = (id: string, data: any, logoFile: File): ActionBaseType => {
  return {
    type: UserCertificationActionTypes.CERTIFICATE_UPDATE_REQUEST,
    payload: { id, data, logoFile }
  };
};

export const deleteCertificateDataAction = (id: string): ActionBaseType => {
  return {
    type: UserCertificationActionTypes.CERTIFICATE_DELETE_REQUEST,
    payload: id
  };
};
export const arrangeAwardAction = (data:any): ActionBaseType => {
  return {
    type: UserCertificationActionTypes.CERTIFICATE_ARRANGE_REQUEST,
    payload:data
  };
};

// reducer
interface UserState {
  readonly certificateData: any[];
  readonly isGettingCertificate: boolean;
  readonly isDeletingCertificate: boolean;
}

const initialState: UserState = {
  certificateData: [],
  isGettingCertificate: false,
  isDeletingCertificate: false
};

export const UserCertificateReducer: Reducer<UserState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    case UserCertificationActionTypes.CERTIFICATE_FETCH_REQUEST: {
      return { ...state, isGettingCertificate: true };
    }
    case UserCertificationActionTypes.CERTIFICATE_FETCH_SUCCESS: {
      return {
        ...state,
        isGettingCertificate: false,
        certificateData: action.payload
      };
    }
    case UserCertificationActionTypes.CERTIFICATE_ADD_SUCCESS: {
      const newCertificateData = [action.payload, ...state.certificateData];
      return { ...state, certificateData: newCertificateData };
    }
    case UserCertificationActionTypes.CERTIFICATE_UPDATE_SUCCESS: {
      const { certificateData } = state;
      const updatedItem = action.payload;
      const updatedCertificateData = [...certificateData];
      const indexOfUpdatedItem = updatedCertificateData.findIndex((item: any) => item.id === updatedItem.id);
      if (indexOfUpdatedItem > -1) {
        updatedCertificateData[indexOfUpdatedItem] = updatedItem;
      }
      return { ...state, certificateData: updatedCertificateData };
    }
    case UserCertificationActionTypes.CERTIFICATE_DELETE_SUCCESS: {
      const { certificateData } = state;
      const deletedItemId = action.payload;
      const updatedCertificateData = [...certificateData];
      const indexOfDeletedItem = updatedCertificateData.findIndex((item: any) => item.id === deletedItemId);
      if (indexOfDeletedItem > -1) {
        updatedCertificateData.splice(indexOfDeletedItem, 1);
      }
      return { ...state, certificateData: updatedCertificateData };
    }
    case UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_SUCCESS: {
      const { certificateData } = state;
      const id = action.payload.id;
      const updatedCertificateData = [...certificateData];
      const indexOfDeletedItem = updatedCertificateData.findIndex((item: any) => item.id === id);
      if (indexOfDeletedItem > -1) {
        updatedCertificateData[indexOfDeletedItem] = action.payload;
      }
      return { ...state, certificateData: updatedCertificateData };
    }
    default: {
      return state;
    }
  }
};

// selector
export const selectCertificateData = (state: any) => state.UserCertificateReducer.certificateData;
export const selectIsGettingCertificate = (state: any) => state.UserCertificateReducer.isGettingCertificate;
export const selectIsDeletingCertificate = (state: any) => state.UserCertificateReducer.isDeletingCertificate;

// side effect
function* watchFetchCertificateData(): any {
  yield call(delay, 1000);
  try {
    const data = yield api.Profile.awardCertifications(1, 100);
    yield put({
      type: UserCertificationActionTypes.CERTIFICATE_FETCH_SUCCESS,
      payload: data.results
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchAddCertificateItem(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, logoFile } = action.payload;
    const addedItem = yield api.Profile.addAwardCertification(data);
    addedItem.image_url = logoFile ? '' : addedItem.image_url;
    yield put({
      type: UserCertificationActionTypes.CERTIFICATE_ADD_SUCCESS,
      payload: addedItem
    });
    if (logoFile) {
      yield put({
        type: UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_REQUEST,
        payload: { file: logoFile, id: addedItem.id }
      });
    }
    NotificationService.notify('Add award & certificate item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUpdateCertificateItem(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, id, logoFile } = action.payload;
    const upadteItem = yield api.Profile.updateAwardCertification(id, data);
    const item: any = { ...upadteItem, id };
    yield put({
      type: UserCertificationActionTypes.CERTIFICATE_UPDATE_SUCCESS,
      payload: item
    });
    if (logoFile) {
      yield put({
        type: UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_REQUEST,
        payload: { file: logoFile, id: id }
      });
    }
    NotificationService.notify('Update award & certificate item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchDeleteCertificateItem(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const id = action.payload;
    yield api.Profile.deleteAwardCertification(id);
    yield put({
      type: UserCertificationActionTypes.CERTIFICATE_DELETE_SUCCESS,
      payload: id
    });
    NotificationService.notify('Delete award & certificate item successfully!');
  } catch (error) {
    yield handleCommonError(error.code);
  }
}
function* watchArrangeCertificateItem(action: ActionBaseType): any {
  yield call(delay, 500);
  // const { data } = action.payload;
  try {
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload;
    var id=[];
    if(data && data.length>0){
      for(let i=0; i< data.length; i++){
        if(data[i].id){
          id.push(data[i].id);
        }
      }
    }
    const body = {ids:id};
    // console.log('body',body)
    const response = yield fetch(getApiPath(ApiPaths.ARRANGE_AWARD), {
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
      type: UserCertificationActionTypes.CERTIFICATE_FETCH_SUCCESS,
        payload: data
      });
    // NotificationService.notify('Arrange award & certificate item successfully!');

    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUploadImageCertificateItem(action: ActionBaseType) {
  try {
    const headers = yield api.Auth.getAuthorizationHeaders();
    const channel = yield call(
      createUploadFileChannel,
      getApiPath(`/profile/award-certifications/${action.payload.id}/logo/`),
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
          type: UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_SUCCESS,
          payload: res.data
        });
        return;
      }
      if (err) {
        yield put({
          type: UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_ERROR,
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
export const UserCertificationSaga = [
  takeLatest(UserCertificationActionTypes.CERTIFICATE_FETCH_REQUEST, watchFetchCertificateData),
  takeLatest(UserCertificationActionTypes.CERTIFICATE_UPDATE_REQUEST, watchUpdateCertificateItem),
  takeLatest(UserCertificationActionTypes.CERTIFICATE_ADD_REQUEST, watchAddCertificateItem),
  takeLatest(UserCertificationActionTypes.CERTIFICATE_DELETE_REQUEST, watchDeleteCertificateItem),
  takeLatest(UserCertificationActionTypes.CERTIFICATE_UPLOAD_IMAGE_REQUEST, watchUploadImageCertificateItem),
  takeLatest(UserCertificationActionTypes.CERTIFICATE_ARRANGE_REQUEST, watchArrangeCertificateItem)
];
