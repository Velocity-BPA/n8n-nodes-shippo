/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ShippoApi implements ICredentialType {
  name = 'shippoApi';
  displayName = 'Shippo API';
  documentationUrl = 'https://docs.goshippo.com/docs/intro/auth/';
  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description:
        'Your Shippo API token. Test tokens start with "shippo_test_" and live tokens start with "shippo_live_".',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=ShippoToken {{$credentials.apiToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.goshippo.com',
      url: '/addresses',
      method: 'GET',
      qs: {
        results: 1,
      },
    },
  };
}
