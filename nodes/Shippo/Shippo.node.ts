/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { logLicensingNotice } from './transport/shippoApi';

// Address
import {
  addressOperations,
  addressFields,
  executeAddressOperation,
} from './actions/address/address';

// Parcel
import {
  parcelOperations,
  parcelFields,
  executeParcelOperation,
} from './actions/parcel/parcel';

// Shipment
import {
  shipmentOperations,
  shipmentFields,
  executeShipmentOperation,
} from './actions/shipment/shipment';

// Rate
import {
  rateOperations,
  rateFields,
  executeRateOperation,
} from './actions/rate/rate';

// Transaction
import {
  transactionOperations,
  transactionFields,
  executeTransactionOperation,
} from './actions/transaction/transaction';

// Tracking
import {
  trackingOperations,
  trackingFields,
  executeTrackingOperation,
} from './actions/tracking/tracking';

// Customs
import {
  customsOperations,
  customsFields,
  executeCustomsOperation,
} from './actions/customs/customs';

// Batch
import {
  batchOperations,
  batchFields,
  executeBatchOperation,
} from './actions/batch/batch';

// Manifest
import {
  manifestOperations,
  manifestFields,
  executeManifestOperation,
} from './actions/manifest/manifest';

// Pickup
import {
  pickupOperations,
  pickupFields,
  executePickupOperation,
} from './actions/pickup/pickup';

// Refund
import {
  refundOperations,
  refundFields,
  executeRefundOperation,
} from './actions/refund/refund';

// Carrier Account
import {
  carrierAccountOperations,
  carrierAccountFields,
  executeCarrierAccountOperation,
} from './actions/carrierAccount/carrierAccount';

// Webhook
import {
  webhookOperations,
  webhookFields,
  executeWebhookOperation,
} from './actions/webhook/webhook';

export class Shippo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Shippo',
    name: 'shippo',
    icon: 'file:shippo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Multi-carrier shipping API for labels, tracking, and rate comparison',
    defaults: {
      name: 'Shippo',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'shippoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Address',
            value: 'address',
            description: 'Manage shipping addresses',
          },
          {
            name: 'Batch',
            value: 'batch',
            description: 'Process labels in bulk',
          },
          {
            name: 'Carrier Account',
            value: 'carrierAccount',
            description: 'Manage carrier integrations',
          },
          {
            name: 'Customs',
            value: 'customs',
            description: 'Customs declarations and items',
          },
          {
            name: 'Manifest',
            value: 'manifest',
            description: 'Create scan forms',
          },
          {
            name: 'Parcel',
            value: 'parcel',
            description: 'Manage package dimensions',
          },
          {
            name: 'Pickup',
            value: 'pickup',
            description: 'Schedule carrier pickups',
          },
          {
            name: 'Rate',
            value: 'rate',
            description: 'Get shipping rates',
          },
          {
            name: 'Refund',
            value: 'refund',
            description: 'Request label refunds',
          },
          {
            name: 'Shipment',
            value: 'shipment',
            description: 'Create shipments and get rates',
          },
          {
            name: 'Tracking',
            value: 'tracking',
            description: 'Track packages',
          },
          {
            name: 'Transaction',
            value: 'transaction',
            description: 'Purchase shipping labels',
          },
          {
            name: 'Webhook',
            value: 'webhook',
            description: 'Manage webhook subscriptions',
          },
        ],
        default: 'shipment',
      },

      // Address operations and fields
      ...addressOperations,
      ...addressFields,

      // Parcel operations and fields
      ...parcelOperations,
      ...parcelFields,

      // Shipment operations and fields
      ...shipmentOperations,
      ...shipmentFields,

      // Rate operations and fields
      ...rateOperations,
      ...rateFields,

      // Transaction operations and fields
      ...transactionOperations,
      ...transactionFields,

      // Tracking operations and fields
      ...trackingOperations,
      ...trackingFields,

      // Customs operations and fields
      ...customsOperations,
      ...customsFields,

      // Batch operations and fields
      ...batchOperations,
      ...batchFields,

      // Manifest operations and fields
      ...manifestOperations,
      ...manifestFields,

      // Pickup operations and fields
      ...pickupOperations,
      ...pickupFields,

      // Refund operations and fields
      ...refundOperations,
      ...refundFields,

      // Carrier Account operations and fields
      ...carrierAccountOperations,
      ...carrierAccountFields,

      // Webhook operations and fields
      ...webhookOperations,
      ...webhookFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Log licensing notice once per execution
    logLicensingNotice();

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[];

        switch (resource) {
          case 'address':
            responseData = await executeAddressOperation.call(this, operation, i);
            break;
          case 'parcel':
            responseData = await executeParcelOperation.call(this, operation, i);
            break;
          case 'shipment':
            responseData = await executeShipmentOperation.call(this, operation, i);
            break;
          case 'rate':
            responseData = await executeRateOperation.call(this, operation, i);
            break;
          case 'transaction':
            responseData = await executeTransactionOperation.call(this, operation, i);
            break;
          case 'tracking':
            responseData = await executeTrackingOperation.call(this, operation, i);
            break;
          case 'customs':
            responseData = await executeCustomsOperation.call(this, operation, i);
            break;
          case 'batch':
            responseData = await executeBatchOperation.call(this, operation, i);
            break;
          case 'manifest':
            responseData = await executeManifestOperation.call(this, operation, i);
            break;
          case 'pickup':
            responseData = await executePickupOperation.call(this, operation, i);
            break;
          case 'refund':
            responseData = await executeRefundOperation.call(this, operation, i);
            break;
          case 'carrierAccount':
            responseData = await executeCarrierAccountOperation.call(this, operation, i);
            break;
          case 'webhook':
            responseData = await executeWebhookOperation.call(this, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Handle array responses
        if (Array.isArray(responseData)) {
          for (const item of responseData) {
            returnData.push({ json: item });
          }
        } else {
          returnData.push({ json: responseData });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
