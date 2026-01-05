# n8n-nodes-shippo

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Shippo, the multi-carrier shipping API supporting 60+ carriers including USPS, UPS, FedEx, and DHL.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## Features

- **Multi-Carrier Rate Shopping** - Compare rates across 60+ carriers in a single API call
- **One-Call Label Creation** - Create shipments and purchase labels in a single operation
- **Address Validation** - Validate shipping addresses before creating shipments
- **Batch Processing** - Process hundreds of labels in bulk operations
- **Real-Time Tracking** - Register and track shipments across all carriers
- **International Shipping** - Full customs declaration and documentation support
- **Webhook Integration** - Trigger workflows on shipping events
- **Manifest/Scan Forms** - Generate end-of-day manifests for carrier pickups
- **Pickup Scheduling** - Schedule carrier pickups directly from n8n

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-shippo`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-shippo
```

### Development Installation

```bash
# Clone or extract the repository
cd n8n-nodes-shippo

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-shippo

# Restart n8n
```

## Credentials Setup

### Shippo API

| Field | Description |
|-------|-------------|
| **API Token** | Your Shippo API token (test or live) |

**Getting your API token:**

1. Log in to your [Shippo Dashboard](https://apps.goshippo.com/)
2. Navigate to **Settings** > **API**
3. Copy your API token

**Token Types:**

- **Test tokens** (`shippo_test_...`): Use for development and testing. No charges incurred.
- **Live tokens** (`shippo_live_...`): Use for production. Actual shipping charges apply.

## Resources & Operations

### Address

Manage shipping addresses with validation support.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new address (optionally validate) |
| **Get** | Retrieve an address by ID |
| **Get Many** | List all addresses |
| **Validate** | Validate an existing address |

### Parcel

Define package dimensions and weights.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a parcel definition |
| **Get** | Retrieve a parcel by ID |
| **Get Many** | List all parcels |

Supports carrier-specific templates (USPS Flat Rate, FedEx Pak, etc.)

### Shipment

Create shipments and retrieve multi-carrier rates.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a shipment and get rates |
| **Get** | Retrieve a shipment by ID |
| **Get Many** | List all shipments |

Features:
- Inline or referenced addresses/parcels
- Extras: signature confirmation, insurance, Saturday delivery
- Customs declarations for international shipments
- Carrier account filtering
- Async rate fetching

### Rate

Retrieve shipping rates for existing shipments.

| Operation | Description |
|-----------|-------------|
| **Get for Shipment** | Get rates for a shipment ID |

### Transaction (Labels)

Purchase shipping labels.

| Operation | Description |
|-----------|-------------|
| **Create** | Purchase a shipping label |
| **Get** | Retrieve a transaction by ID |
| **Get Many** | List all transactions |

**Creation Methods:**

1. **From Rate ID** - Two-call method: create shipment, then purchase selected rate
2. **One-Call** - Single API call creates shipment and purchases label

**Label Formats:** PDF, PDF_4x6, PNG, ZPLII

### Tracking

Track shipments across all carriers.

| Operation | Description |
|-----------|-------------|
| **Create** | Register tracking for a shipment |
| **Get** | Get current tracking status |

### Customs

Manage international shipping documentation.

| Operation | Description |
|-----------|-------------|
| **Create Declaration** | Create customs declaration |
| **Get Declaration** | Retrieve declaration by ID |
| **Create Item** | Create customs item |
| **Get Item** | Retrieve item by ID |

### Batch

Process labels in bulk.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a batch with shipments |
| **Get** | Retrieve batch status |
| **Get Many** | List all batches |
| **Add Shipments** | Add shipments to batch |
| **Remove Shipments** | Remove shipments from batch |
| **Purchase** | Purchase all labels in batch |

### Manifest (Scan Forms)

Generate end-of-day manifests.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a manifest |
| **Get** | Retrieve manifest by ID |
| **Get Many** | List all manifests |

### Pickup

Schedule carrier pickups.

| Operation | Description |
|-----------|-------------|
| **Create** | Schedule a pickup |
| **Get** | Retrieve pickup by ID |

### Refund

Request label refunds.

| Operation | Description |
|-----------|-------------|
| **Create** | Request a refund |
| **Get** | Retrieve refund status |
| **Get Many** | List all refunds |

### Carrier Account

Manage carrier integrations.

| Operation | Description |
|-----------|-------------|
| **Create** | Add a carrier account |
| **Get** | Retrieve account by ID |
| **Get Many** | List all accounts |
| **Update** | Update account settings |
| **Delete** | Remove a carrier account |

### Webhook

Manage webhook subscriptions.

| Operation | Description |
|-----------|-------------|
| **Create** | Create webhook subscription |
| **Get** | Retrieve webhook by ID |
| **Get Many** | List all webhooks |
| **Update** | Update webhook settings |
| **Delete** | Remove a webhook |

## Trigger Node

### Shippo Trigger

Starts workflows when Shippo events occur.

**Supported Events:**

| Event | Description |
|-------|-------------|
| `track_updated` | Tracking status changed |
| `transaction_created` | Label purchased |
| `transaction_updated` | Label status changed |
| `batch_created` | Batch created |
| `batch_purchased` | Batch labels purchased |

## Usage Examples

### Create and Purchase a Label (One-Call)

```javascript
// Transaction node configuration
{
  "resource": "transaction",
  "operation": "create",
  "creationMethod": "oneCall",
  "addressFromType": "fields",
  "fromName": "Sender Name",
  "fromStreet1": "123 Main St",
  "fromCity": "San Francisco",
  "fromState": "CA",
  "fromZip": "94102",
  "fromCountry": "US",
  "addressToType": "fields",
  "toName": "Recipient Name",
  "toStreet1": "456 Oak Ave",
  "toCity": "Los Angeles",
  "toState": "CA",
  "toZip": "90001",
  "toCountry": "US",
  "parcelType": "fields",
  "length": 10,
  "width": 8,
  "height": 4,
  "distanceUnit": "in",
  "weight": 2,
  "massUnit": "lb",
  "carrierAccount": "your_carrier_account_id",
  "serviceLevelToken": "usps_priority",
  "labelFileType": "PDF"
}
```

### Compare Rates Across Carriers

```javascript
// Shipment node configuration
{
  "resource": "shipment",
  "operation": "create",
  "addressFromType": "id",
  "addressFromId": "address_from_id",
  "addressToType": "id",
  "addressToId": "address_to_id",
  "parcelType": "id",
  "parcelId": "parcel_id",
  "async": false
}
// Returns rates from all connected carriers
```

### Batch Label Processing

```javascript
// Batch node configuration
{
  "resource": "batch",
  "operation": "create",
  "defaultCarrierAccount": "carrier_account_id",
  "defaultServiceLevelToken": "usps_priority",
  "batchShipments": "[{\"shipment\": {...}}, ...]"
}
```

### Track a Shipment

```javascript
// Tracking node configuration
{
  "resource": "tracking",
  "operation": "get",
  "carrier": "usps",
  "trackingNumber": "9400111899223456789012"
}
```

## Shipping Concepts

### Service Level Tokens

Each carrier has specific service level tokens:

| Carrier | Example Tokens |
|---------|----------------|
| USPS | `usps_priority`, `usps_first`, `usps_express` |
| UPS | `ups_ground`, `ups_3_day_select`, `ups_next_day_air` |
| FedEx | `fedex_ground`, `fedex_2_day`, `fedex_standard_overnight` |
| DHL | `dhl_express_worldwide`, `dhl_economy_select` |

### Address Validation

Shippo validates addresses during creation. The response includes:

- `is_complete`: All required fields present
- `validation_results`: Validation messages and suggested corrections

### International Shipping

For international shipments, you need:

1. **Customs Declaration**: Contents type, value, non-delivery instructions
2. **Customs Items**: Individual item details (description, quantity, value, HS codes)
3. **Commercial Invoice**: Auto-generated from customs info

## Error Handling

The node provides detailed error messages:

| Error Type | Description |
|------------|-------------|
| **400 Bad Request** | Invalid parameters or missing required fields |
| **401 Unauthorized** | Invalid API token |
| **404 Not Found** | Resource doesn't exist |
| **429 Rate Limited** | Too many requests (500 POST/min live, 50 POST/min test) |
| **500 Server Error** | Shippo API issue |

Enable "Continue on Fail" in n8n to handle errors gracefully in workflows.

## Security Best Practices

1. **Use Test Tokens for Development** - Avoid charges during testing
2. **Secure Your API Token** - Never expose tokens in logs or client code
3. **Validate Addresses** - Always validate before creating shipments
4. **Monitor Webhooks** - Use webhook signatures to verify authenticity
5. **Handle Rate Limits** - Implement retry logic for high-volume operations

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm test`)
5. Submit a pull request

## Support

- **Documentation**: [Shippo API Docs](https://docs.goshippo.com/)
- **Issues**: GitHub Issues
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [Shippo](https://goshippo.com) for their excellent shipping API
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for inspiration and feedback
