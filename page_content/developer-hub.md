# Developer Hub | FRAME Virtual Fiscalisation

## Hero Section
**Title:** Ship ZIMRA-compliant fiscalisation like any other API integration.
**Subtitle:** Connect your POS, ERP, or custom apps to FRAME's Virtual Fiscalisation APIs with battle-tested workflows, Maven setup, and clear examples.
**Kicker:** FRAME DEVELOPER HUB

### Tags
- Java & REST APIs
- Maven library 1.1.4
- EDMS-compliant workflows

---

## Developer Guide Overview
**Title:** Frame Library Developer Guide
**Content:** Explains how to integrate and use the FRAME Virtual Fiscalisation Library. Helps register fiscal devices, manage fiscal operations (invoices, credit/debit notes), and stay compliant with ZIMRA while the library handles FDMS communication.

### Guide Sections
- Overview
- Steps to get started
- Register a device on the ZIMRA portal
- Setting up the library
- Developing the workflows
- Registering your fiscal device
- Getting device configurations
- Getting the current fiscal day status
- Opening a fiscal day
- Processing invoices
- Closing a fiscal day
- Contact & Support

---

## Steps to Get Started
1. Register a fiscal device on the ZIMRA portal.
2. Set up the FRAME Virtual Fiscalisation Library in your Java project (Maven).
3. Implement workflows (register, configure, open/close day, process invoices).

---

## Technical Details
- **Maven Dependency:** `inc.frame:Frame-Virtual-Fiscalisation-Library:1.1.4`
- **Maven Repository:** `https://framernd.tech/repository/frame-library-releases/`
- **Authentication:** Requires username and API key provided by FRAME sales team.

---

## Workflow Examples (Java)
The guide provides Java code snippets for:
- **Registering Device:** Using `RegisterDeviceRequest` and `FdmsDeviceRegistration`.
- **Device Configuration:** Using `DeviceConfigurationRequest` and `FdmsDeviceConfigurations`.
- **Fiscal Day Status:** Using `FiscalDayStatusRequest` and `FdmsFiscalDayStatus`.
- **Opening Fiscal Day:** Using `OpenFiscalDayRequest` and `FdmsOpenFiscalDay`.
- **Processing Invoices:** Using `ProcessInvoiceRequest` (with `InvoiceLine` items) and `FdmsProcessInvoice`.
- **Closing Fiscal Day:** Using `CloseFiscalDayRequest` and `FdmsCloseFiscalDay`.

---

## Contact & Support
- **Technical Support:** support@frame.co.zw
- **Sales Enquiries:** sales@frame.co.zw
- **Phone:** +263 86 7718 6045
- **Emergency Support:** +263 86 7718 6045 (Outside business hours)
- **Support Hours:** Mon-Fri 8-5, Sat 9-1 (Harare Time).
- **Location:** 1 Napier Ave., Hillside, Bulawayo, Zimbabwe.
