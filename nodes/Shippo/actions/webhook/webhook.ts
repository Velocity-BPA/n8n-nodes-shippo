/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest, shippoApiRequestAllItems } from '../../transport/shippoApi';
import { WEBHOOK_EVENTS } from '../../constants/constants';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a webhook subscription',
        action: 'Create a webhook',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a webhook subscription',
        action: 'Delete a webhook',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a webhook by ID',
        action: 'Get a webhook',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many webhooks',
        action: 'Get many webhooks',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a webhook subscription',
        action: 'Update a webhook',
      },
    ],
    default: 'getAll',
  },
];

export const webhookFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'https://example.com/webhook',
    description: 'The URL to receive webhook events',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Event',
    name: 'event',
    type: 'options',
    required: true,
    default: 'track_updated',
    options: WEBHOOK_EVENTS,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    description: 'The event type to subscribe to',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Is Test',
        name: 'isTest',
        type: 'boolean',
        default: false,
        description: 'Whether this webhook is for test events only',
      },
    ],
  },

  // Get, Update, Delete operation fields
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the webhook',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['get', 'update', 'delete'],
      },
    },
  },

  // Update operation fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/webhook',
        description: 'The URL to receive webhook events',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        default: 'track_updated',
        options: WEBHOOK_EVENTS,
        description: 'The event type to subscribe to',
      },
      {
        displayName: 'Is Test',
        name: 'isTest',
        type: 'boolean',
        default: false,
        description: 'Whether this webhook is for test events only',
      },
    ],
  },

  // Get All operation fields
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 25,
    description: 'Max number of results to return',
  },
];

export async function executeWebhookOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const url = this.getNodeParameter('url', itemIndex) as string;
      const event = this.getNodeParameter('event', itemIndex) as string;
      const options = this.getNodeParameter('options', itemIndex) as IDataObject;

      const body: IDataObject = {
        url,
        event,
      };

      if (options.isTest !== undefined) {
        body.is_test = options.isTest;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/webhooks',
        body,
      });
      break;
    }

    case 'get': {
      const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/webhooks/${webhookId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

      if (returnAll) {
        responseData = await shippoApiRequestAllItems.call(this, {
          endpoint: '/webhooks',
        });
      } else {
        const limit = this.getNodeParameter('limit', itemIndex) as number;
        responseData = await shippoApiRequest.call(this, {
          endpoint: '/webhooks',
          qs: { results: limit },
        });
        responseData = (responseData as IDataObject).results as IDataObject[];
      }
      break;
    }

    case 'update': {
      const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
      const updateFields = this.getNodeParameter('updateFields', itemIndex) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.url) {
        body.url = updateFields.url;
      }
      if (updateFields.event) {
        body.event = updateFields.event;
      }
      if (updateFields.isTest !== undefined) {
        body.is_test = updateFields.isTest;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'PUT',
        endpoint: `/webhooks/${webhookId}`,
        body,
      });
      break;
    }

    case 'delete': {
      const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
      await shippoApiRequest.call(this, {
        method: 'DELETE',
        endpoint: `/webhooks/${webhookId}`,
      });
      responseData = { success: true, deleted: webhookId };
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
