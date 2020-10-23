import { combineReducers } from 'redux';
import { HomeReducer, HomeSaga } from './home.duck';
import { UserReducer, UserSaga } from './user.duck';
import { RegisterReducer, RegisterSaga } from './register.duck';
import { LoginReducer, LoginSaga } from './login.duck';
import { AuthReducer, AuthSaga } from './auth.duck';
import { UserEducationReducer, UserEducationSaga } from './user-education.duck';
import { UserExperienceReducer, UserExperienceSaga } from './user-experience.duck';
import { UserCertificateReducer, UserCertificationSaga } from './user-certification.duck';
import { LocationReducer, LocationSaga } from './location.duck';
import { ContactReducer, ContactSaga } from './contact.duck';
import { InterestReducer, InterestSaga } from './interest.duck';
import { UserPdfReducer, UserPdfSaga } from './user-pdf.duck';
import { UserPublicReducer, UserPublicSaga } from './user-public.duck';
import { BlogReducer, BlogSaga } from './blog.duck';
import { HelpReducer, HelpSaga,HelpVideoSaga } from './help.duck';
import { CareersReducer, CareersSaga } from './careers.duck';
import { BlogFeatureReducer, BlogFeatureSaga } from './blog-feature.duck';
import { BlogDetailReducer, BlogDetailSaga } from './blog-detail.duck';
import { CompanyReducer, CompanySaga } from './company.duck';
import { SchoolReducer, SchoolSaga } from './school.duck';
import { SearchProfile, SearchReducer } from './search-profile.duck';
import { all } from 'redux-saga/effects';
import { PrivacyReducer, Privacy } from './privacy-policy.duck';
import { TermConditionReducer, TermCondition } from './terms-conditions.duck';
import { ReportGetListReducer, ReportList } from './report-get-list.duck';
import {ReportPostListReducer, PostList } from './report-post-list.duck';
import { SocialReducer, SocialSaga } from './social.duck';

export const RootReducer = combineReducers({
  HomeReducer,
  UserReducer,
  UserEducationReducer,
  UserExperienceReducer,
  UserCertificateReducer,
  LoginReducer,
  RegisterReducer,
  AuthReducer,
  LocationReducer,
  ContactReducer,
  InterestReducer,
  UserPdfReducer,
  UserPublicReducer,
  BlogReducer,
  HelpReducer,
  CareersReducer,
  BlogDetailReducer,
  BlogFeatureReducer,
  CompanyReducer,
  SchoolReducer,
  SearchReducer,
  PrivacyReducer,
  TermConditionReducer,
  ReportGetListReducer,
  ReportPostListReducer,
  SocialReducer
});

export function* rootSaga() {
  yield all([
    ...HomeSaga,
    ...UserSaga,
    ...UserEducationSaga,
    ...UserExperienceSaga,
    ...UserCertificationSaga,
    ...LoginSaga,
    ...RegisterSaga,
    ...AuthSaga,
    ...LocationSaga,
    ...ContactSaga,
    ...InterestSaga,
    ...UserPdfSaga,
    ...UserPublicSaga,
    ...BlogSaga,
    ...HelpSaga,
    ...CareersSaga,
    ...HelpVideoSaga,
    ...BlogDetailSaga,
    ...BlogFeatureSaga,
    ...SearchProfile,
    ...CompanySaga,
    ...SchoolSaga,
    ...Privacy,
    ...TermCondition,
    ...ReportList,
    ...PostList,
    ...SocialSaga
  ]);
}
