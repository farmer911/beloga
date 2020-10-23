export class RoutePaths {
  static readonly INDEX = '/';
  static readonly HOME = '/home';
  static readonly USER = '/user';
  static readonly USER_PROFILE = {
    PATH: '/user/:username',
    getPath: (username: string) => `/user/${username}`
  };
  static readonly USER_SEARCHING = {
    PATH: '/user/search/',
    getPath: (key: string, page: number) => `${RoutePaths.USER_SEARCHING.PATH}?key=${key}&page=${page}`
  };

  static readonly USER_PUBLIC = {
    PATH: '/public/:username',
    getPath: (username: string) => `/public/${username}`
  };
  static readonly USER_UPDATE_PROFILE = {
    PATH: '/user/:username/update-profile',
    getPath: (username: string) => `/user/${username}/update-profile`
  };
  static readonly USER_ACCOUNT_SETTING = {
    PATH: '/user/:username/account-setting',
    getPath: (username: string) => `/user/${username}/account-setting`
  };
  static readonly LOGIN = '/login';
  static readonly REGISTER = '/register';
  static readonly REGISTER_SOCIAL = {
    PATH: '/register/:provider',
    getPath: (provider: string) => `/register/${provider}`
  };
  static readonly FORGOTPASSWORD = '/forgot-password';
  static readonly RESETPASS = {
    PATH: '/reset-password/:uid/:token/:timestamp',
    getPath: (uid: string, token: string, timestamp: string) => `/reset-password/${uid}/${token}/${timestamp}`
  };
  static readonly POLICY = '/privacy-policy';
  static readonly TERM_AND_CONDITION = '/terms-and-conditions';
  static readonly NOT_FOUND = '/404-not-found';
  static readonly CONTACT_US = '/contact-us';
  //help page
  static readonly HELP = '/help';
  static readonly HELP_FAQ = '/help-faqs';
  static readonly VIDEO_TUTORIALS = '/video-tutorials';
  //Careers
  static readonly CAREERS = '/careers';

  static readonly CAREERS_DETAIL = {
    PATH: '/careers/:id',
    getPath: (id: string) => `/careers/${id}`
  };
  static readonly ACTIVATE_ACCOUNT = {
    PATH: '/activate-account/:key',
    getPath: (key: string) => `/activate-account/${key}`
  };
  static readonly ACTIVATE_LOGIN = {
    PATH: '/login/:key',
    getPath: (key: string) => `/login/${key}`
  };
  static readonly AFTER_REGISTER_SUCCESS = '/register-success';
  static readonly CHANGE_EMAIL_SUCCESS = '/change-email-success';
  static readonly BLOG = '/blog';
  static readonly BLOG_SINGLE = {
    PATH: '/blog/:blogslug',
    getPath: (blogslug: string) => `/blog/${blogslug}`
  };
  static readonly SOCIAL_CONNECT_SCENE = '/social-connect-scene';
  static readonly CALLBACK = '/callback';
}
