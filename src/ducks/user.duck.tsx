import { Reducer } from 'redux';
import { UserType, ActionBaseType } from '../commons/types';
import { put, takeLatest, call, take } from 'redux-saga/effects';
import { api } from '@belooga/belooga-ts-sdk';
import { createUploadFileChannel, getApiPath } from '../utils';
import { createSelector } from 'reselect';
import { ApiPaths, HttpCodes } from '../commons/constants';
import { delay } from 'redux-saga';
import { AuthActionTypes } from './auth.duck';
import { handleCommonError, NotificationService } from '../services';
import { LoginActionTypes } from './login.duck';

export enum UserActionTypes {
  USER_FETCH_INFO_REQUEST = '@@USER/USER_FETCH_INFO_REQUEST',
  USER_FETCH_INFO_SUCCESS = '@@USER/USER_FETCH_INFO_SUCCESS',
  USER_UPDATE_INFO_REQUEST = '@@USER/USER_UPDATE_INFO_REQUEST',
  USER_UPDATE_INFO_SUCCESS = '@@USER/USER_UPDATE_INFO_SUCCESS',
  USER_UPDATE_INFO_ERROR = '@@USER/USER_UPDATE_INFO_ERROR',
  USER_UPDATE_ABOUT_REQUEST = '@@USER/USER_UPDATE_ABOUT_REQUEST',
  USER_UPDATE_ABOUT_SUCCESS = '@@USER/USER_UPDATE_ABOUT_SUCCESS',
  USER_UPDATE_ABOUT_ERROR = '@@USER/USER_UPDATE_ABOUT_ERROR',
  USER_REDIRECT_AFTER_UPDATE_BEGIN = '@@USER/USER_REDIRECT_AFTER_UPDATE_BEGIN',
  USER_REDIRECT_AFTER_UPDATE_END = '@@USER/USER_REDIRECT_AFTER_UPDATE_END',
  USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN = '@@USER/USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN',
  USER_REDIRECT_AFTER_UPDATE_USERNAME_END = '@@USER/USER_REDIRECT_AFTER_UPDATE_USERNAME_END',
  USER_RESET_INFO = '@@USER/USER_RESET_INFO',
  USER_RESET_UPDATE_INFO_ERROR = '@@USER/USER_RESET_UPDATE_INFO_ERROR',
  USER_UPDATE_CONTACT_INFO_REQUEST = '@@USER/USER_UPDATE_CONTACT_INFO_REQUEST',
  USER_UPDATE_CONTACT_INFO_SUCCESS = '@@USER/USER_UPDATE_CONTACT_INFO_SUCCESS',
  USER_UPDATE_JOB_TITLE_REQUEST = '@@USER/USER_UPDATE_JOB_TITLE_REQUEST',
  USER_UPDATE_JOB_TITLE_SUCCESS = '@@USER/USER_UPDATE_JOB_TITLE_SUCCESS',
  USER_UPDATE_JOB_TITLE_ERROR = '@@USER/USER_UPDATE_JOB_TITLE_ERROR',
  USER_UPDATE_STATUS_OPPORTUNITY_REQUEST = '@@USER/USER_UPDATE_STATUS_OPPORTUNITY_REQUEST',
  USER_UPDATE_STATUS_OPPORTUNITY_SUCCESS = '@@USER/USER_UPDATE_STATUS_OPPORTUNITY_SUCCESS',
  USER_UPDATE_STATUS_OPPORTUNITY_ERROR = '@@USER/USER_UPDATE_STATUS_OPPORTUNITY_ERROR',
  USER_UPDATE_SKILL_REQUEST = '@@USER/USER_UPDATE_SKILL_REQUEST',
  USER_UPDATE_SKILL_SUCCESS = '@@USER/USER_UPDATE_SKILL_SUCCESS',
  USER_UPDATE_SKILL_ERROR = '@@USER/USER_UPDATE_SKILL_ERROR',
  USER_UPDATE_HIDDEN_FIELD_REQUEST = '@@USER/USER_UPDATE_HIDDEN_FIELD_REQUEST',
  //languages
  USER_UPDATE_LANGUAGE_REQUEST = '@@USER/USER_UPDATE_LANGUAGE_REQUEST',
  USER_UPDATE_LANGUAGE_SUCCESS = '@@USER/USER_UPDATE_LANGUAGE_SUCCESS',
  USER_UPDATE_LANGUAGE_ERROR = '@@USER/USER_UPDATE_LANGUAGE_ERROR',

  USER_UPDATE_INTEREST_REQUEST = '@@USER/USER_UPDATE_INTEREST_REQUEST',
  USER_UPDATE_INTEREST_SUCCESS = '@@USER/USER_UPDATE_INTEREST_SUCCESS',
  USER_UPDATE_INTEREST_ERROR = '@@USER/USER_UPDATE_INTEREST_ERROR',

  // upload avatar
  UPLOAD_AVATAR_REQUEST = '@@USER/UPLOAD_AVATAR_REQUEST',
  UPLOAD_AVATAR_PROGRESS = '@@USER/UPLOAD_AVATAR_SUCCESS',
  UPLOAD_AVATAR_SUCCESS = '@@USER/UPLOAD_AVATAR_SUCCESS',
  UPLOAD_AVATAR_ERROR = '@@USER/UPLOAD_AVATAR_ERROR',

  UPLOAD_VIDEO_REQUEST = '@@USER/UPLOAD_VIDEO_REQUEST',
  UPLOAD_VIDEO_PROGRESS = '@@USER/UPLOAD_VIDEO_PROGRESS',
  UPLOAD_VIDEO_SUCCESS = '@@USER/UPLOAD_VIDEO_SUCCESS',
  UPLOAD_VIDEO_ERROR = '@@USER/UPLOAD_VIDEO_ERROR',
  UPLOAD_VIDEO_RESET = '@@USER/UPLOAD_VIDEO_RESET',

  USER_UPDATE_EMAIL_REQUEST = '@@USER/CHANGE_EMAIL_REQUEST',
  USER_UPDATE_EMAIL_SUCCESS = '@@USER/CHANGE_EMAIL_SUCCESS',
  USER_UPDATE_EMAIL_RESET_STATUS = '@@USER/USER_UPDATE_EMAIL_RESET_STATUS',
  USER_UPDATE_EMAIL_ERROR = '@@USER/CHANGE_EMAIL_ERROR',
  USER_REDIRECT_AFTER_UPDATE_EMAIL_BEGIN = '@@USER/USER_REDIRECT_AFTER_UPDATE_EMAIL_BEGIN',
  USER_REDIRECT_AFTER_UPDATE_EMAIL_END = '@@USER/USER_REDIRECT_AFTER_UPDATE_EMAIL_END',

  USER_UPDATE_PASSWORD_REQUEST = '@@USER/CHANGE_PASSWORD_REQUEST',
  USER_UPDATE_PASSWORD_SUCCESS = '@@USER/CHANGE_PASSWORD_SUCCESS',
  USER_UPDATE_PASSWORD_ERROR = '@@USER/CHANGE_PASSWORD_ERROR',
  USER_REDIRECT_AFTER_UPDATE_PASSWORD_BEGIN = '@@USER/USER_REDIRECT_AFTER_UPDATE_PASSWORD_BEGIN',
  USER_REDIRECT_AFTER_UPDATE_PASSWORD_END = '@@USER/USER_REDIRECT_AFTER_UPDATE_PASSWORD_END',

  USER_AUTHORIZATION_HEADERS_REQUEST = '@@USER/AUTHORIZATION_HEADERS_REQUEST',
  USER_AUTHORIZATION_HEADERS_SUCCESS = '@@USER/AUTHORIZATION_HEADERS_SUCCESS',

  USER_REMOVE_RESUME_REQUEST = '@@USER/USER_REMOVE_RESUME_REQUEST',
  USER_REMOVE_COVER_VIDEO_REQUEST = '@@USER/USER_REMOVE_COVER_VIDEO_REQUEST',
  USER_REMOVE_JOB_VIDEO_REQUEST = '@@USER/USER_REMOVE_JOB_VIDEO_REQUEST',
  USER_REMOVE_EDUCATION_VIDEO_REQUEST = '@@USER/USER_REMOVE_EDUCATION_VIDEO_REQUEST',

  USER_UPDATE_FRESH_REQUEST = '@@USER/USER_UPDATE_FRESH_REQUEST',

  USER_DELETE_ACCOUNT_REQUEST = '@@USER/USER_DELETE_ACCOUNT_REQUEST'
}

// action creator
export const getAuthorizationHeadersAction = () => {
  return {
    type: UserActionTypes.USER_AUTHORIZATION_HEADERS_REQUEST
  };
};
export const uploadAvatarRequestAction = (file: File) => ({
  type: UserActionTypes.UPLOAD_AVATAR_REQUEST,
  payload: file
});

export const getUserInfoAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_FETCH_INFO_REQUEST
  };
};

export const updateUserInfoAction = (data: any, isRedirect: boolean): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_INFO_REQUEST,
    payload: { data, isRedirect }
  };
};

export const updateUserInterestAction = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_INTEREST_REQUEST,
    payload: { data }
  };
};

export const updateUserSkillAction = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_SKILL_REQUEST,
    payload: { data }
  };
};
export const updateUserLanguageAction = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_LANGUAGE_REQUEST,
    payload: { data }
  };
};

export const updateLocalUserInfo = (payload: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
    payload
  };
};

export const updateUserJobTitle = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_JOB_TITLE_REQUEST,
    payload: { data }
  };
};

export const updateUserAboutAction = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_ABOUT_REQUEST,
    payload: { data }
  };
};

export const updateUserContactInfoAction = (data: any, isUsernameUpdated: boolean): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_CONTACT_INFO_REQUEST,
    payload: { data, isUsernameUpdated }
  };
};

export const updateUserStatusOpportunity = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_STATUS_OPPORTUNITY_REQUEST,
    payload: { data }
  };
};

export const updateUserHiddenField = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_HIDDEN_FIELD_REQUEST,
    payload: { data }
  };
};

export const uploadVideoRequestAction = (file: File, uploadType: any) => ({
  type: UserActionTypes.UPLOAD_VIDEO_REQUEST,
  payload: {
    file,
    uploadType
  }
});

export const uploadVideoResetAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.UPLOAD_VIDEO_RESET
  };
};

export const updateUserEmailAction = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_EMAIL_REQUEST,
    payload: { data }
  };
};

export const updateUserPasswordAction = (data: any): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_PASSWORD_REQUEST,
    payload: { data }
  };
};

export const userRemoveResumeAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_REMOVE_RESUME_REQUEST
  };
};

export const removeCoverVideoAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_REMOVE_COVER_VIDEO_REQUEST
  };
};

export const removeJobVideoAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_REMOVE_JOB_VIDEO_REQUEST
  };
};

export const removeEducationVideoAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_REMOVE_EDUCATION_VIDEO_REQUEST
  };
};

export const userDeleteAccountAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_DELETE_ACCOUNT_REQUEST
  };
};

export const userUpdateFreshAction = (): ActionBaseType => {
  return {
    type: UserActionTypes.USER_UPDATE_FRESH_REQUEST
  };
};

interface UserState {
  readonly userInfo?: UserType;
  readonly isRedirect: boolean;
  readonly isChangeEmailSuccess: boolean;
  readonly updateUserError: string;
  readonly uploadAvatarError: string;
  readonly uploadVideoError: string;
  readonly uploadVideoProgress: number;
  readonly updateUserPassResponse: {
    isError: boolean;
    message: string;
  };
  readonly isLoading: boolean;
  readonly authorizationHeaders: any;
}

const initialState: UserState = {
  userInfo: undefined,
  isRedirect: false,
  isChangeEmailSuccess: false,
  updateUserError: '',
  uploadAvatarError: '',
  uploadVideoError: '',
  uploadVideoProgress: 0,
  updateUserPassResponse: {
    isError: false,
    message: ''
  },
  isLoading: false,
  authorizationHeaders: undefined
};

export const UserReducer: Reducer<UserState, ActionBaseType> = (state = initialState, action) => {
  switch (action.type) {
    // user
    case UserActionTypes.USER_FETCH_INFO_REQUEST: {
      return { ...state, isLoading: true };
    }
    case UserActionTypes.USER_FETCH_INFO_SUCCESS: {
      return { ...state, userInfo: action.payload, isLoading: false };
    }
    case UserActionTypes.USER_UPDATE_INFO_REQUEST: {
      return { ...state };
    }
    case UserActionTypes.USER_UPDATE_INFO_SUCCESS: {
      return { ...state, userInfo: action.payload };
    }
    case UserActionTypes.USER_UPDATE_INFO_ERROR: {
      return { ...state, updateUserError: action.payload };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_BEGIN: {
      return { ...state, isRedirect: true };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_END: {
      return { ...state, isRedirect: false };
    }
    case UserActionTypes.USER_RESET_INFO: {
      return { ...state, userInfo: undefined };
    }
    case UserActionTypes.USER_RESET_UPDATE_INFO_ERROR: {
      return { ...state, updateUserError: '' };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN: {
      return { ...state, isRedirect: true };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_END: {
      return { ...state, isRedirect: false };
    }
    // upload avatar
    case UserActionTypes.UPLOAD_AVATAR_REQUEST: {
      return { ...state };
    }
    case UserActionTypes.UPLOAD_AVATAR_SUCCESS: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          image_url: action.payload
        }
      };
    }
    case UserActionTypes.UPLOAD_AVATAR_ERROR: {
      return { ...state, updateUserError: action.payload };
    }

    case UserActionTypes.UPLOAD_VIDEO_REQUEST: {
      return { ...state };
    }
    case UserActionTypes.UPLOAD_VIDEO_SUCCESS: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          video_url: action.payload.video_url,
          cover_image_url: action.payload.cover_image_url,
          job_video_url: action.payload.job_video_url,
          job_cover_image_url: action.payload.job_cover_image_url,
          school_video_url: action.payload.school_video_url,
          school_cover_image_url: action.payload.school_cover_image_url
        }
      };
    }
    case UserActionTypes.UPLOAD_VIDEO_PROGRESS: {
      return { ...state, uploadVideoProgress: action.payload };
    }
    case UserActionTypes.UPLOAD_VIDEO_ERROR: {
      return { ...state, updateUserError: action.payload };
    }
    case UserActionTypes.UPLOAD_VIDEO_RESET: {
      return { ...state, uploadVideoProgress: 0 };
    }
    case UserActionTypes.USER_UPDATE_EMAIL_SUCCESS: {
      return { ...state, userInfo: undefined, isChangeEmailSuccess: true };
    }
    case UserActionTypes.USER_UPDATE_EMAIL_RESET_STATUS: {
      return { ...state, userInfo: undefined, isChangeEmailSuccess: false };
    }
    case UserActionTypes.USER_UPDATE_EMAIL_ERROR: {
      return { ...state, updateUserError: action.payload, isChangeEmailSuccess: false };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_EMAIL_BEGIN: {
      return { ...state, isRedirect: true };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_EMAIL_END: {
      return { ...state, isRedirect: false };
    }
    case UserActionTypes.USER_UPDATE_PASSWORD_REQUEST: {
      return { ...state, isLoading: true };
    }
    case UserActionTypes.USER_UPDATE_PASSWORD_SUCCESS: {
      return { ...state, isLoading: false };
    }
    case UserActionTypes.USER_UPDATE_PASSWORD_ERROR: {
      return {
        ...state,
        updateUserPassResponse: { isError: action.payload.isError, message: action.payload.message },
        isLoading: false
      };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_PASSWORD_BEGIN: {
      return { ...state, isRedirect: true };
    }
    case UserActionTypes.USER_REDIRECT_AFTER_UPDATE_PASSWORD_END: {
      return { ...state, isRedirect: false };
    }

    case UserActionTypes.USER_AUTHORIZATION_HEADERS_REQUEST: {
      return { ...state, authorizationHeaders: undefined };
    }
    case UserActionTypes.USER_AUTHORIZATION_HEADERS_SUCCESS: {
      return { ...state, authorizationHeaders: action.payload };
    }
    case UserActionTypes.USER_REMOVE_RESUME_REQUEST: {
      return { ...state };
    }

    default: {
      return state;
    }
  }
};

// selector
export const selectIsLoading = (state: any) => state.UserReducer.isLoading;
export const selectErrorFromServer = (state: any) => state.UserReducer.updateUserError;
export const selectUserInfo = (state: any) => state.UserReducer.userInfo;
export const selectIsRedirect = (state: any) => state.UserReducer.isRedirect;
export const selectIsChangeEmailSuccess = (state: any) => state.UserReducer.isChangeEmailSuccess;
export const selectIsNewUser = createSelector(
  selectUserInfo,
  userInfo => {
    return userInfo && userInfo.user && !userInfo.user.submitted ? true : false;
  }
);
export const selectIsUserInfoExists = createSelector(
  selectUserInfo,
  userInfo => {
    return userInfo ? true : false;
  }
);
// skill
export const selectSkillData = (state: any) => {
  const { userInfo } = state.UserReducer;
  return userInfo ? userInfo.skills : [];
};
//language
export const selectLanguageData = (state: any) => {
  const { userInfo } = state.UserReducer;
  return userInfo ? userInfo.languages : [];
};
// interest
export const selectInterestData = (state: any) => {
  const { userInfo } = state.UserReducer;
  return userInfo ? userInfo.interests : [];
};
export const getProgressUploadVideo = (state: any) => state.UserReducer.uploadVideoProgress;
export const selectErrorChangePassword = (state: any) => state.UserReducer.updateUserPassResponse;
export const selectAuthorizationHeaders = (state: any) => state.UserReducer.authorizationHeaders;
// side effect
function* watchFetchUserInfo(): any {
  yield call(delay, 1000);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    if (!isAuthed) {
      return;
    }
    const profile = yield call(api.User.profile);
    let { user, ...flatProfile } = profile;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    flatProfile = {
      ...flatProfile,
      facebook: `${flatProfile.facebook === null ? `` : flatProfile.facebook}`,
      twitter: `${flatProfile.twitter === null ? `` : flatProfile.twitter}`,
      portfolio: `${flatProfile.portfolio === null ? `` : flatProfile.portfolio}`,
      linkedin: `${flatProfile.linkedin === null ? `` : flatProfile.linkedin}`,
      instagram: `${flatProfile.instagram === null ? `` : flatProfile.instagram}`
    };
    yield put({
      type: UserActionTypes.USER_FETCH_INFO_SUCCESS,
      payload: flatProfile
    });
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUpdateUserInfo(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, isRedirect = true } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });

    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });

    if (isRedirect) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_BEGIN
      });
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_END
      });
    }
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      yield put({
        type: UserActionTypes.USER_UPDATE_INFO_ERROR,
        payload: 'Something went wrong, please try again later!'
      });
      yield call(delay, 5000);
      yield put({
        type: UserActionTypes.USER_RESET_UPDATE_INFO_ERROR
      });
    }
    yield handleCommonError(error.code);
  }
}

function* watchUpdateSkillRequest(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, isUsernameUpdated } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }

    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
    NotificationService.notify('Updated Successfully!');
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_BEGIN
    });
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_END
    });
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      yield put({
        type: UserActionTypes.USER_UPDATE_INFO_ERROR,
        payload: 'Something went wrong, please try again later!'
      });
      yield call(delay, 5000);
      yield put({
        type: UserActionTypes.USER_RESET_UPDATE_INFO_ERROR
      });
    }
    yield handleCommonError(error.code);
  }
}
//language
function* watchUpdateLanguageRequest(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, isUsernameUpdated } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }

    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
    NotificationService.notify('Updated Successfully!');
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_BEGIN
    });
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_END
    });
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      yield put({
        type: UserActionTypes.USER_UPDATE_INFO_ERROR,
        payload: 'Something went wrong, please try again later!'
      });
      yield call(delay, 5000);
      yield put({
        type: UserActionTypes.USER_RESET_UPDATE_INFO_ERROR
      });
    }
    yield handleCommonError(error.code);
  }
}

function* watchUpdateInterestRequest(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, isUsernameUpdated } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }

    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
    NotificationService.notify('Updated Successfully!');
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_BEGIN
    });
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_END
    });
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      yield put({
        type: UserActionTypes.USER_UPDATE_INFO_ERROR,
        payload: 'Something went wrong, please try again later!'
      });
      yield call(delay, 5000);
      yield put({
        type: UserActionTypes.USER_RESET_UPDATE_INFO_ERROR
      });
    }
    yield handleCommonError(error.code);
  }
}

function* watchUpdateUserContactInfo(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data, isUsernameUpdated } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }

    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });

    if (isUsernameUpdated) {
      yield put({
        type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_USERNAME_BEGIN
      });
    }
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_BEGIN
    });
    yield put({
      type: UserActionTypes.USER_REDIRECT_AFTER_UPDATE_END
    });
    NotificationService.notify('Updated Successfully!');
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      yield put({
        type: UserActionTypes.USER_UPDATE_INFO_ERROR,
        payload: 'Something went wrong, please try again later!'
      });
      yield call(delay, 5000);
      yield put({
        type: UserActionTypes.USER_RESET_UPDATE_INFO_ERROR
      });
    }
    yield handleCommonError(error.code);
    NotificationService.notify('Update contact info failed!');
  }
}

function* watchUpdateUserAbout(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
    NotificationService.notify('Updated Successfully!');
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      NotificationService.notify('Update about failed.');
    }
    yield handleCommonError(error.code);
  }
}

function* watchUpdateStatusOpportunity(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
    //NotificationService.notify('Update status opportunity successfully!');
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      NotificationService.notify('Update status opportunity failed.');
    }
    yield handleCommonError(error.code);
  }
}

function* watchUpdateHiddenField(action: ActionBaseType): any {
  yield call(delay, 500); 
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload.data;
    const body = data;
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    const response = yield fetch(getApiPath(ApiPaths.PROFILE_HIDDEN), {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(res => {
      return res.json();
    });
    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      NotificationService.notify('Update public field failed.');
    }
    yield handleCommonError(error.code);
  }
}

function* watchUpdateUserJobTitle(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const { data } = action.payload;
    const response = yield call(api.User.updateProfile, {
      ...data
    });
    let { user, ...flatProfile } = response;
    user = { ...user };
    flatProfile = { ...flatProfile, ...user };
    yield put({
      type: UserActionTypes.USER_UPDATE_INFO_SUCCESS,
      payload: flatProfile
    });
    NotificationService.notify('Update job title successfully!');
  } catch (error) {
    if (error.code === HttpCodes.BadRequest) {
      NotificationService.notify('Update job title failed.');
    }
    yield handleCommonError(error.code);
  }
}

function* watchUploadAvatar(action: ActionBaseType) {
  try {
    const headers = yield api.Auth.getAuthorizationHeaders();
    const channel = yield call(
      createUploadFileChannel,
      getApiPath(ApiPaths.UPLOAD_AVATAR),
      headers,
      action.payload,
      'avatar.png',
      'image/png',
      'image'
    );
    while (true) {
      const { progress = 0, err, success, res } = yield take(channel);

      if (success) {
        yield put({
          type: UserActionTypes.UPLOAD_AVATAR_SUCCESS,
          payload: res.data.image_url
        });
        return;
      }
      if (err) {
        yield put({
          type: UserActionTypes.UPLOAD_AVATAR_ERROR,
          payload: 'Upload failed'
        });
        return;
      }
      yield put({
        type: UserActionTypes.UPLOAD_AVATAR_PROGRESS,
        payload: progress
      });
    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUploadVideo(action: ActionBaseType) {
  yield call(delay, 300);
  try {
    const headers = yield api.Auth.getAuthorizationHeaders();
    let path = null;
    const { uploadType, file } = action.payload;
    let channel = null;
    if (uploadType == 'resume') {
      path = ApiPaths.UPLOAD_VIDEO;
      channel = yield call(createUploadFileChannel, getApiPath(path), headers, file, file.name, file.type, 'video');
    } else if (uploadType == 'education') {
      path = ApiPaths.UPLOAD_VIDEO_EDUCATION;
      channel = yield call(
        createUploadFileChannel,
        getApiPath(path),
        headers,
        file,
        file.name,
        file.type,
        'school_video'
      );
    } else if (uploadType == 'experience') {
      path = ApiPaths.UPLOAD_VIDEO_EXPERIENCE;
      channel = yield call(createUploadFileChannel, getApiPath(path), headers, file, file.name, file.type, 'job_video');
    }
    const { progress, err, success, res } = yield take(channel);
    while (!res && progress && progress > 0 && progress <= 100) {
      const { progress, err, success, res } = yield take(channel);
      if (success) {
        yield put({
          type: UserActionTypes.UPLOAD_VIDEO_SUCCESS,
          payload: { ...res.data }
        });
      }
      if (err) {
        yield put({
          type: UserActionTypes.UPLOAD_VIDEO_ERROR,
          payload: 'Upload failed'
        });
        NotificationService.notify('Upload video failed. Please check again!');
      }
      if (progress) {
        yield put({
          type: UserActionTypes.UPLOAD_VIDEO_PROGRESS,
          payload: progress
        });
      }
    }
  } catch (error) {
    yield handleCommonError(error.code);
  }
}

function* watchUpdateUserEmail(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload.data;
    const body = {
      email: data.email
    };
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    const response = yield fetch(getApiPath(ApiPaths.CHANGE_EMAIL), {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 200) {
      yield put({
        type: UserActionTypes.USER_UPDATE_EMAIL_SUCCESS
      });
      yield put({
        type: UserActionTypes.USER_UPDATE_EMAIL_RESET_STATUS
      });
      yield put({
        type: AuthActionTypes.AUTH_CHECK_FINISH,
        payload: false
      });
      yield put({
        type: UserActionTypes.USER_RESET_INFO
      });
      yield put({
        type: LoginActionTypes.LOGOUT_REQUEST
      });
    }
  } catch (err) {
    yield put({
      type: UserActionTypes.USER_UPDATE_EMAIL_ERROR,
      payload: 'Something went wrong, please try again later!'
    });
  }
}

function* watchUpdateUserPass(action: ActionBaseType): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    const data = action.payload.data;
    const body = data;
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    const response = yield fetch(getApiPath(ApiPaths.CHANGE_PASSWORD), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(res => {
      return res.json();
    });
    if (response.old_password) {
      yield put({
        type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
        payload: {
          isError: true,
          message: response.old_password[0]
        }
      });

      yield call(delay, 5000);

      yield put({
        type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
        payload: ''
      });
    }
    if (response.detail) {
      yield put({
        type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
        payload: {
          isError: false,
          message: response.detail
        }
      });

      yield call(delay, 5000);

      yield put({
        type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
        payload: {
          isError: false,
          message: ''
        }
      });
    }
    if (response.new_password2) {
      yield put({
        type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
        payload: {
          isError: true,
          message: response.new_password2
        }
      });

      yield call(delay, 5000);

      yield put({
        type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
        payload: {
          isError: false,
          message: ''
        }
      });
    }
  } catch (err) {
    yield put({
      type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
      payload: {
        isError: true,
        message: 'Something went wrong, please try again later!'
      }
    });

    yield call(delay, 5000);

    yield put({
      type: UserActionTypes.USER_UPDATE_PASSWORD_ERROR,
      payload: {
        isError: false,
        message: ''
      }
    });
  }
}

function* watchUserRemoveResume(): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    yield fetch(getApiPath(ApiPaths.UPLOAD_RESUME), {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    NotificationService.notify('Remove your resume failed. Please check again!');
  }
}

function* watchUserRemoveCoverVideo(): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    yield fetch(getApiPath(ApiPaths.UPLOAD_VIDEO), {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    NotificationService.notify('Remove your cover video failed. Please check again!');
  }
}

function* watchUserRemoveJobVideo(): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    yield fetch(getApiPath(ApiPaths.UPLOAD_VIDEO_EXPERIENCE), {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    NotificationService.notify('Remove your experience video failed. Please check again!');
  }
}

function* watchUserRemoveEducationVideo(): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    yield fetch(getApiPath(ApiPaths.UPLOAD_VIDEO_EDUCATION), {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    NotificationService.notify('Remove your education video failed. Please check again!');
  }
}

function* watchUserDeleteAccount(): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    yield fetch(getApiPath('/users/'), {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
    yield put({
      type: LoginActionTypes.LOGOUT_REQUEST
    });
    NotificationService.notify('Your account has been successfully deleted');
  } catch (err) {
    NotificationService.notify('Delete your account failed. Please check again!');
  }
}

function* watchUserUpdateFresh(): any {
  yield call(delay, 500);
  try {
    const isAuthed = yield call(api.Auth.isAuthenticated);
    const headers = yield call(api.Auth.getAuthorizationHeaders);
    if (!isAuthed) {
      // handle redirect to login
      return;
    }
    yield fetch(getApiPath(ApiPaths.CHANGE_FRESH_USER), {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    NotificationService.notify('User turn off tips failed. Please check again!');
  }
}

function* watchAuthorizationHeaders(): any {
  yield call(delay, 500);
  const headers = yield call(api.Auth.getAuthorizationHeaders);
  yield put({
    type: UserActionTypes.USER_AUTHORIZATION_HEADERS_SUCCESS,
    payload: headers
  });
}

export const UserSaga = [
  takeLatest(UserActionTypes.USER_FETCH_INFO_REQUEST, watchFetchUserInfo),
  takeLatest(UserActionTypes.USER_UPDATE_INFO_REQUEST, watchUpdateUserInfo),
  takeLatest(UserActionTypes.USER_UPDATE_SKILL_REQUEST, watchUpdateSkillRequest),
  takeLatest(UserActionTypes.USER_UPDATE_LANGUAGE_REQUEST, watchUpdateLanguageRequest),
  takeLatest(UserActionTypes.USER_UPDATE_INTEREST_REQUEST, watchUpdateInterestRequest),
  takeLatest(UserActionTypes.USER_UPDATE_STATUS_OPPORTUNITY_REQUEST, watchUpdateStatusOpportunity),
  takeLatest(UserActionTypes.USER_UPDATE_HIDDEN_FIELD_REQUEST, watchUpdateHiddenField),
  takeLatest(UserActionTypes.USER_UPDATE_JOB_TITLE_REQUEST, watchUpdateUserJobTitle),
  takeLatest(UserActionTypes.USER_UPDATE_ABOUT_REQUEST, watchUpdateUserAbout),
  takeLatest(UserActionTypes.UPLOAD_AVATAR_REQUEST, watchUploadAvatar),
  takeLatest(UserActionTypes.USER_UPDATE_CONTACT_INFO_REQUEST, watchUpdateUserContactInfo),
  takeLatest(UserActionTypes.UPLOAD_VIDEO_REQUEST, watchUploadVideo),
  takeLatest(UserActionTypes.USER_UPDATE_EMAIL_REQUEST, watchUpdateUserEmail),
  takeLatest(UserActionTypes.USER_UPDATE_PASSWORD_REQUEST, watchUpdateUserPass),
  takeLatest(UserActionTypes.USER_AUTHORIZATION_HEADERS_REQUEST, watchAuthorizationHeaders),
  takeLatest(UserActionTypes.USER_REMOVE_RESUME_REQUEST, watchUserRemoveResume),
  takeLatest(UserActionTypes.USER_REMOVE_COVER_VIDEO_REQUEST, watchUserRemoveCoverVideo),
  takeLatest(UserActionTypes.USER_REMOVE_JOB_VIDEO_REQUEST, watchUserRemoveJobVideo),
  takeLatest(UserActionTypes.USER_REMOVE_EDUCATION_VIDEO_REQUEST, watchUserRemoveEducationVideo),
  takeLatest(UserActionTypes.USER_DELETE_ACCOUNT_REQUEST, watchUserDeleteAccount),
  takeLatest(UserActionTypes.USER_UPDATE_FRESH_REQUEST, watchUserUpdateFresh)
];
