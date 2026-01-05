/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const SHIPPO_API_BASE_URL = 'https://api.goshippo.com';

export const DISTANCE_UNITS = [
  { name: 'Inches', value: 'in' },
  { name: 'Centimeters', value: 'cm' },
  { name: 'Feet', value: 'ft' },
  { name: 'Millimeters', value: 'mm' },
  { name: 'Meters', value: 'm' },
  { name: 'Yards', value: 'yd' },
];

export const MASS_UNITS = [
  { name: 'Grams', value: 'g' },
  { name: 'Ounces', value: 'oz' },
  { name: 'Pounds', value: 'lb' },
  { name: 'Kilograms', value: 'kg' },
];

export const LABEL_FILE_TYPES = [
  { name: 'PDF', value: 'PDF' },
  { name: 'PDF 4x6', value: 'PDF_4x6' },
  { name: 'PNG', value: 'PNG' },
  { name: 'ZPL II', value: 'ZPLII' },
];

export const CONTENTS_TYPES = [
  { name: 'Documents', value: 'DOCUMENTS' },
  { name: 'Gift', value: 'GIFT' },
  { name: 'Sample', value: 'SAMPLE' },
  { name: 'Merchandise', value: 'MERCHANDISE' },
  { name: 'Humanitarian Donation', value: 'HUMANITARIAN_DONATION' },
  { name: 'Return Merchandise', value: 'RETURN_MERCHANDISE' },
  { name: 'Other', value: 'OTHER' },
];

export const NON_DELIVERY_OPTIONS = [
  { name: 'Return', value: 'RETURN' },
  { name: 'Abandon', value: 'ABANDON' },
];

export const SIGNATURE_TYPES = [
  { name: 'Standard', value: 'STANDARD' },
  { name: 'Adult', value: 'ADULT' },
  { name: 'Certified', value: 'CERTIFIED' },
  { name: 'Indirect', value: 'INDIRECT' },
  { name: 'Carrier Confirmation', value: 'CARRIER_CONFIRMATION' },
];

export const WEBHOOK_EVENTS = [
  { name: 'Track Updated', value: 'track_updated' },
  { name: 'Transaction Created', value: 'transaction_created' },
  { name: 'Transaction Updated', value: 'transaction_updated' },
  { name: 'Batch Created', value: 'batch_created' },
  { name: 'Batch Purchased', value: 'batch_purchased' },
];

export const BUILDING_LOCATION_TYPES = [
  { name: 'Front Door', value: 'Front Door' },
  { name: 'Back Door', value: 'Back Door' },
  { name: 'Side Door', value: 'Side Door' },
  { name: 'Knock on Door', value: 'Knock on Door' },
  { name: 'Ring Bell', value: 'Ring Bell' },
  { name: 'Mail Room', value: 'Mail Room' },
  { name: 'Office', value: 'Office' },
  { name: 'Reception', value: 'Reception' },
  { name: 'In/At Mailbox', value: 'In/At Mailbox' },
  { name: 'Other', value: 'Other' },
];

export const INCOTERMS = [
  { name: 'DDP (Delivered Duty Paid)', value: 'DDP' },
  { name: 'DDU (Delivered Duty Unpaid)', value: 'DDU' },
  { name: 'FCA (Free Carrier)', value: 'FCA' },
  { name: 'DAP (Delivered At Place)', value: 'DAP' },
];

export const COMMON_CARRIERS = [
  { name: 'USPS', value: 'usps' },
  { name: 'UPS', value: 'ups' },
  { name: 'FedEx', value: 'fedex' },
  { name: 'DHL Express', value: 'dhl_express' },
  { name: 'DHL eCommerce', value: 'dhl_ecommerce' },
  { name: 'Canada Post', value: 'canada_post' },
  { name: 'Australia Post', value: 'australia_post' },
  { name: 'Royal Mail', value: 'royal_mail' },
  { name: 'Deutsche Post', value: 'deutsche_post' },
  { name: 'Purolator', value: 'purolator' },
  { name: 'OnTrac', value: 'ontrac' },
  { name: 'LaserShip', value: 'lasership' },
  { name: 'Sendle', value: 'sendle' },
  { name: 'Aramex', value: 'aramex' },
];

export const PARCEL_TEMPLATES = {
  USPS: [
    { name: 'USPS Small Flat Rate Box', value: 'USPS_SmallFlatRateBox' },
    { name: 'USPS Medium Flat Rate Box', value: 'USPS_MediumFlatRateBox' },
    { name: 'USPS Large Flat Rate Box', value: 'USPS_LargeFlatRateBox' },
    { name: 'USPS Flat Rate Envelope', value: 'USPS_FlatRateEnvelope' },
    { name: 'USPS Legal Flat Rate Envelope', value: 'USPS_LegalFlatRateEnvelope' },
    { name: 'USPS Padded Flat Rate Envelope', value: 'USPS_PaddedFlatRateEnvelope' },
  ],
  UPS: [
    { name: 'UPS Express Box Small', value: 'UPS_Express_Box_Small' },
    { name: 'UPS Express Box Medium', value: 'UPS_Express_Box_Medium' },
    { name: 'UPS Express Box Large', value: 'UPS_Express_Box_Large' },
    { name: 'UPS Pak', value: 'UPS_Pak' },
    { name: 'UPS Tube', value: 'UPS_Tube' },
  ],
  FedEx: [
    { name: 'FedEx Envelope', value: 'FedEx_Envelope' },
    { name: 'FedEx Pak', value: 'FedEx_Pak' },
    { name: 'FedEx Small Box', value: 'FedEx_Small_Box' },
    { name: 'FedEx Medium Box', value: 'FedEx_Medium_Box' },
    { name: 'FedEx Large Box', value: 'FedEx_Large_Box' },
    { name: 'FedEx Extra Large Box', value: 'FedEx_Extra_Large_Box' },
    { name: 'FedEx Tube', value: 'FedEx_Tube' },
  ],
};
