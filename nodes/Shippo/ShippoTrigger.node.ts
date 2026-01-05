/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

import { shippoApiRequest, logLicensingNotice } from './transport/shippoApi';
import { WEBHOOK_EVENTS } from './constants/constants';

export class ShippoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Shippo Trigger',
    name: 'shippoTrigger',
    icon: 'file:shippo.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts workflow on Shippo events',
    defaults: {
      name: 'Shippo Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'shippoApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: 'track_updated',
        options: WEBHOOK_EVENTS,
        description: 'The event to listen for',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Is Test',
            name: 'isTest',
            type: 'boolean',
            default: false,
            description: 'Whether to receive test events only',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        logLicensingNotice();
        
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;

        try {
          const response = await shippoApiRequest.call(this, {
            endpoint: '/webhooks',
          });

          const webhooks = (response as IDataObject).results as IDataObject[];

          for (const webhook of webhooks) {
            if (webhook.url === webhookUrl && webhook.event === event) {
              const webhookData = this.getWorkflowStaticData('node');
              webhookData.webhookId = webhook.object_id;
              return true;
            }
          }

          return false;
        } catch {
          return false;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        logLicensingNotice();
        
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;
        const options = this.getNodeParameter('options') as IDataObject;

        const body: IDataObject = {
          url: webhookUrl,
          event,
        };

        if (options.isTest !== undefined) {
          body.is_test = options.isTest;
        }

        try {
          const response = await shippoApiRequest.call(this, {
            method: 'POST',
            endpoint: '/webhooks',
            body,
          });

          const webhookData = this.getWorkflowStaticData('node');
          webhookData.webhookId = (response as IDataObject).object_id;

          return true;
        } catch (error) {
          console.error('Failed to create Shippo webhook:', error);
          return false;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        logLicensingNotice();
        
        const webhookData = this.getWorkflowStaticData('node');

        if (!webhookData.webhookId) {
          return true;
        }

        try {
          await shippoApiRequest.call(this, {
            method: 'DELETE',
            endpoint: `/webhooks/${webhookData.webhookId}`,
          });

          delete webhookData.webhookId;

          return true;
        } catch (error) {
          console.error('Failed to delete Shippo webhook:', error);
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    logLicensingNotice();
    
    const bodyData = this.getBodyData();

    return {
      workflowData: [this.helpers.returnJsonArray(bodyData)],
    };
  }
}
