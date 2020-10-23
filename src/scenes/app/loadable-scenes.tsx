import React from 'react';

export const LoadableHomeScene = React.lazy(() => import('../home/home.scene'));

export const LoadableRegisterScene = React.lazy(() => import('../register/register.scene'));

export const LoadabeAfterRegisterScene = React.lazy(() => import('../register/afterregister.scene'));
export const LoadableUserScene = React.lazy(() => import('../user/user.scene'));

export const LoadableLoginScene = React.lazy(() => import('../login/login.scene'));

export const LoadablePrivacyPolicyScene = React.lazy(() => import('../privacy-policy/privacy-policy.scene'));

export const LoadableTermsConditionsScene = React.lazy(() =>
  import('../terms-and-conditions/terms-and-conditions.scene')
);

export const LoadableContactUsScene = React.lazy(() => import('../contact-us/contact-us.scene'));

export const LoadableNotFoundScene = React.lazy(() => import('../not-found/not-found.scene'));

export const LoadableActivateAccountScene = React.lazy(() => import('../activate-account/activate-account.scene'));
export const LoadablePublicScene = React.lazy(() => import('../public/public.scene'));
export const ForGotPassWord = React.lazy(() => import('../forgot-password/forgot_password.scene'));
export const ResetPass = React.lazy(() => import('../reset-password/reset_password.scene'));
export const LoadableBlogScene = React.lazy(() => import('../blog/blog.scene'));
export const LoadableHelpScene = React.lazy(() => import('../help/help.scene'));
export const LoadableHelpFAQsScene = React.lazy(() => import('../help/help-faqs.scene'));
export const LoadableHelpVideoTutorials = React.lazy(() => import('../help/video-tutorials.scene'));
export const LoadableSingleBlogScene = React.lazy(() => import('../blog/single/single.scene'));
export const LoadableCareersScene = React.lazy(() => import('../careers/careers-page.scene'));
export const LoadableCareersDetailScene = React.lazy(() => import('../careers/careers-detail.scene'));
export const SocialConnectScene = React.lazy(() => import('../../commons/components/_forms/social-form/social-connect-scene'));