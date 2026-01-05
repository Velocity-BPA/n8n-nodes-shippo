/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// Base types
export interface IShippoAddress {
  object_id?: string;
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  street3?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
  is_residential?: boolean;
  validate?: boolean;
  metadata?: string;
}

export interface IShippoParcel {
  object_id?: string;
  length: number;
  width: number;
  height: number;
  distance_unit: 'in' | 'cm' | 'ft' | 'mm' | 'm' | 'yd';
  weight: number;
  mass_unit: 'g' | 'oz' | 'lb' | 'kg';
  template?: string;
  metadata?: string;
}

export interface IShippoShipment {
  object_id?: string;
  address_from: string | IShippoAddress;
  address_to: string | IShippoAddress;
  parcels: (string | IShippoParcel)[];
  address_return?: string | IShippoAddress;
  customs_declaration?: string | IShippoCustomsDeclaration;
  carrier_accounts?: string[];
  extra?: IShippoExtras;
  metadata?: string;
  async?: boolean;
}

export interface IShippoExtras {
  signature_confirmation?: 'STANDARD' | 'ADULT' | 'CERTIFIED' | 'INDIRECT' | 'CARRIER_CONFIRMATION';
  insurance?: {
    amount: string;
    currency: string;
    content?: string;
  };
  reference_1?: string;
  reference_2?: string;
  saturday_delivery?: boolean;
  bypass_address_validation?: boolean;
  is_return?: boolean;
  cod?: {
    amount: string;
    currency: string;
    payment_method: 'SECURED_FUNDS' | 'CASH' | 'ANY';
  };
}

export interface IShippoRate {
  object_id: string;
  amount: string;
  currency: string;
  provider: string;
  provider_image_75: string;
  provider_image_200: string;
  servicelevel: {
    name: string;
    token: string;
    terms: string;
  };
  estimated_days: number;
  duration_terms: string;
  carrier_account: string;
  zone: string;
}

export interface IShippoTransaction {
  object_id?: string;
  rate?: string;
  shipment?: string | IShippoShipment;
  carrier_account?: string;
  servicelevel_token?: string;
  label_file_type?: 'PDF' | 'PDF_4x6' | 'PNG' | 'ZPLII';
  metadata?: string;
  async?: boolean;
}

export interface IShippoTracking {
  carrier: string;
  tracking_number: string;
  metadata?: string;
}

export interface IShippoTrackingStatus {
  status: 'UNKNOWN' | 'PRE_TRANSIT' | 'TRANSIT' | 'DELIVERED' | 'RETURNED' | 'FAILURE';
  status_details: string;
  status_date: string;
  location: {
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface IShippoCustomsItem {
  object_id?: string;
  description: string;
  quantity: number;
  net_weight: number;
  mass_unit: 'g' | 'oz' | 'lb' | 'kg';
  value_amount: string;
  value_currency: string;
  origin_country: string;
  tariff_number?: string;
  sku_code?: string;
  eccn_ear99?: string;
  metadata?: string;
}

export interface IShippoCustomsDeclaration {
  object_id?: string;
  contents_type: 'DOCUMENTS' | 'GIFT' | 'SAMPLE' | 'MERCHANDISE' | 'HUMANITARIAN_DONATION' | 'RETURN_MERCHANDISE' | 'OTHER';
  contents_explanation?: string;
  non_delivery_option: 'ABANDON' | 'RETURN';
  certify: boolean;
  certify_signer: string;
  items: (string | IShippoCustomsItem)[];
  exporter_reference?: string;
  importer_reference?: string;
  invoice?: string;
  license?: string;
  certificate?: string;
  notes?: string;
  eel_pfc?: string;
  aes_itn?: string;
  incoterm?: 'DDP' | 'DDU' | 'FCA' | 'DAP';
  b13a_filing_option?: 'FILED_ELECTRONICALLY' | 'SUMMARY_REPORTING' | 'NOT_REQUIRED';
  b13a_number?: string;
  metadata?: string;
}

export interface IShippoBatch {
  object_id?: string;
  default_carrier_account: string;
  default_servicelevel_token: string;
  batch_shipments: IShippoBatchShipment[];
  label_filetype?: 'PDF' | 'PDF_4x6' | 'PNG' | 'ZPLII';
  metadata?: string;
}

export interface IShippoBatchShipment {
  object_id?: string;
  shipment: string | IShippoShipment;
  carrier_account?: string;
  servicelevel_token?: string;
  metadata?: string;
}

export interface IShippoManifest {
  object_id?: string;
  carrier_account: string;
  shipment_date: string;
  address_from: string | IShippoAddress;
  transactions?: string[];
  async?: boolean;
}

export interface IShippoPickup {
  object_id?: string;
  carrier_account: string;
  location: {
    building_location_type: 'Front Door' | 'Back Door' | 'Side Door' | 'Knock on Door' | 'Ring Bell' | 'Mail Room' | 'Office' | 'Reception' | 'In/At Mailbox' | 'Other';
    building_type?: 'apartment' | 'building' | 'department' | 'floor' | 'room' | 'suite';
    address: string | IShippoAddress;
    instructions?: string;
  };
  transactions: string[];
  requested_start_time: string;
  requested_end_time: string;
  is_test?: boolean;
  metadata?: string;
}

export interface IShippoRefund {
  object_id?: string;
  transaction: string;
  async?: boolean;
}

export interface IShippoCarrierAccount {
  object_id?: string;
  carrier: string;
  account_id: string;
  parameters?: IDataObject;
  active?: boolean;
  metadata?: string;
}

export interface IShippoWebhook {
  object_id?: string;
  url: string;
  event: 'track_updated' | 'transaction_created' | 'transaction_updated' | 'batch_created' | 'batch_purchased';
  is_test?: boolean;
}

// API Response types
export interface IShippoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IShippoError {
  code?: string;
  message: string;
  type?: string;
}

// Resource and operation types
export type ShippoResource =
  | 'address'
  | 'parcel'
  | 'shipment'
  | 'rate'
  | 'transaction'
  | 'tracking'
  | 'customs'
  | 'batch'
  | 'manifest'
  | 'pickup'
  | 'refund'
  | 'carrierAccount'
  | 'webhook';

export type AddressOperation = 'create' | 'get' | 'getAll' | 'validate';
export type ParcelOperation = 'create' | 'get' | 'getAll';
export type ShipmentOperation = 'create' | 'get' | 'getAll';
export type RateOperation = 'getForShipment';
export type TransactionOperation = 'create' | 'get' | 'getAll';
export type TrackingOperation = 'create' | 'get';
export type CustomsOperation = 'createDeclaration' | 'getDeclaration' | 'createItem' | 'getItem';
export type BatchOperation = 'create' | 'get' | 'getAll' | 'addShipments' | 'removeShipments' | 'purchase';
export type ManifestOperation = 'create' | 'get' | 'getAll';
export type PickupOperation = 'create' | 'get';
export type RefundOperation = 'create' | 'get' | 'getAll';
export type CarrierAccountOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';
export type WebhookOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';
