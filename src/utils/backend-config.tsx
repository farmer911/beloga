import { ApiClient } from '@belooga/belooga-ts-sdk';
import { SessionStorage } from '../services';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://dev-api.belooga.com/v1';

const _sessionStorage: any = new SessionStorage();

const _config: any = {
  baseUrl: baseUrl,
  AUTH_SESSION_KEY: 'oauth_token',
  session: _sessionStorage
};

export const configBackend = () => {
  ApiClient.setApiConfig(_config);
};

export const getApiPath = (resourceName: string) => `${_config.baseUrl}${resourceName}`;
