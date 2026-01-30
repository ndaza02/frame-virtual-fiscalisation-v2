# Developer Hub - FRAME Virtual Fiscalisation

> FRAME Developer Hub - Integrate with our Virtual Fiscalisation API. Get started with our comprehensive documentation, guides, and resources.

**Source:** c:\Users\ndaza\CascadeProjects\frame-virtual-fiscalisation-revamp\developer-hub.html

---

Frame Library Developer Guide

In this guide

Overview

Steps to Get Started

Register a Device on the ZIMRA Portal

Setting up the Library

Developing the Workflows

Registering Your Fiscal Device

Getting Device Configurations

Getting the Current Fiscal Day Status

Opening a Fiscal Day

Contact & Support

Overview

This guide provides a comprehensive overview of how to integrate and utilize the Virtual Fiscalisation Library. It assists developers in registering fiscal devices, managing fiscal-related operations such as processing invoices and credit/debit notes, and ensuring compliance with fiscal requirements. The library simplifies communication with ZIMRA by abstracting complex processes into user-friendly APIs, while ensuring adherence to key rules and guidelines for handling fiscal data.

Steps to Get Started

1. Register a Device on the ZIMRA Portal

Before using the API, you need to register a fiscal device with the Zimbabwe Revenue Authority (ZIMRA). This process provides you with:

Device ID

– A unique identifier for your device.

Serial Number

– The serial number of the device.

Activation Key

– A key required to activate the device.

2. Setting up the library

### Contact FRAME sales team to acquire a API key, email:

sales@frame.co.zw

You will be provided with a username and a key, which you can use as password.

<dependency>

<groupId>inc.frame</groupId>

<artifactId>Frame-Virtual-Fiscalisation-Library</artifactId>

<version>1.1.4</version>

</dependency>

Once the dependency is in place, copy the settings.xml file below and place it in your maven .m2 directory, making sure to replace the library credentials with those provided to you by FRAME.

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"

xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0

https://maven.apache.org/xsd/settings-1.0.0.xsd">

<servers>

<server>

<id>frame-library-releases</id>

<username>library_username</username>

<password>API_KEY</password>

</server>

</servers>

<profiles>

<profile>

<id>allow-insecure-repositories</id>

<activation>

<activeByDefault>true</activeByDefault>

</activation>

<repositories>

<repository>

<id>frame-library-releases</id>

<url>https://framernd.tech/repository/frame-library-releases/</url>

<releases>

<enabled>true</enabled>

</releases>

<snapshots>

<enabled>false</enabled>

</snapshots>

</repository>

</repositories>

</profile>

</profiles>

</settings>

With the library placed in the pom file, and the settings.xml updated accordingly, you may proceed to test. In order to pull the library from the Nexus repository, you now need to run:

mvn clean install

Depending on the version of library being downloaded. Expect output similar to the below for the library download stacktrace:

[INFO]   from pom.xml

[INFO] --------------------------------[ jar ]---------------------------------

Downloading from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.pom

Downloaded from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.pom (3.1 kB at 1.3 kB/s)

Downloading from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.jar

Downloaded from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.jar (119 kB at 71 kB/s)

## [INFO]

This should pull the library without errors. If any errors are encountered you may reach out to FRAME support for assistance at

support@frame.co.zw

. Please note that while we are committed to assisting our clients with their integration of the library into the codebase, the base package for this will only include assistance in setting up the library. Development of the solution is left to the client's discretion, unless further arrangements are made for a higher tier service agreement.

Developing the workflows

In this section we will go over the key APIs ZIMRA require for fiscalisation and how to use these with the library. The sections will be divided into:

Registering your Fiscal Device

Getting device configurations

Getting the current fiscal day status

Open Fiscal Day

Pinging the ZIMRA FDMS server

Processing invoices

Closing the Fiscal Day

Registering your Fiscal Device

### Build the device registration request:

public void registerDevice() {

// Create a RegisterDeviceRequest object using the builder pattern

RegisterDeviceRequest request = RegisterDeviceRequest.builder()

.deviceId(DEVICE_ID)

.serialNumber(DEVICE_SERIAL_NUMBER)

.activationKey(DEVICE_ACTIVATION_KEY)

.build();

// Register the device and retrieve the registration response

RegisterDeviceResponse registrationResponse = registerDevice(request);

// Log the registration response

LOGGER.log(Level.INFO,

"FDMS Registration request log, whatever logic you'd like to invoke here: {0}",

registrationResponse.getSomeProperty()

);

}

Make a call to the registration service using the RDMSDeviceRegistration class provided, as shown below:

public RegisterDeviceResponse registerDevice(RegisterDeviceRequest request) {

// Initialize the device registration service with the base URL

FdmsDeviceRegistration registrationService = new FdmsDeviceRegistration(TEST_SERVER_BASE_URL);

try {

// Attempt to register the device and return the response

return registrationService.registerDevice(request);

} catch (DeviceRegistrationException e) {

// Handle exceptions and wrap them in a RuntimeException for better error reporting

throw new RuntimeException("Failed to register the device: " + e.getMessage(), e);

}

}

Getting the device configurations

Once the device is registered, you will need to get the device configurations. This will provide you with the device's configurations as well as the fiscalisation details.

### 1. Build the device configuration request:

public void getDeviceConfigurations() {

// Create a DeviceConfigurationRequest object

DeviceConfigurationRequest request = DeviceConfigurationRequest.builder()

.deviceId(DEVICE_ID)

.build();

// Get the device configurations

DeviceConfigurationResponse configResponse = getDeviceConfigurations(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Device Configuration: {0}",

configResponse.getSomeProperty()

);

}

### 2. Call the device configuration service:

public DeviceConfigurationResponse getDeviceConfigurations(DeviceConfigurationRequest request) {

// Initialize the device configuration service

FdmsDeviceConfigurations configService = new FdmsDeviceConfigurations(TEST_SERVER_BASE_URL);

try {

// Fetch and return the device configurations

return configService.getDeviceConfigurations(request);

} catch (DeviceConfigurationException e) {

throw new RuntimeException("Failed to get device configurations: " + e.getMessage(), e);

}

}

Getting the current fiscal day status

Once the device is registered and configured, you will need to check the current fiscal day status. This will let you know if the device is ready to process invoices or if you need to open a new fiscal day.

### 1. Build the fiscal day status request:

public void getFiscalDayStatus() {

// Create a FiscalDayStatusRequest object

FiscalDayStatusRequest request = FiscalDayStatusRequest.builder()

.deviceId(DEVICE_ID)

.build();

// Get the fiscal day status

FiscalDayStatusResponse statusResponse = getFiscalDayStatus(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Fiscal Day Status: {0}",

statusResponse.getStatus()

);

}

### 2. Call the fiscal day status service:

public FiscalDayStatusResponse getFiscalDayStatus(FiscalDayStatusRequest request) {

// Initialize the fiscal day status service

FdmsFiscalDayStatus statusService = new FdmsFiscalDayStatus(TEST_SERVER_BASE_URL);

try {

// Fetch and return the fiscal day status

return statusService.getFiscalDayStatus(request);

} catch (FiscalDayStatusException e) {

throw new RuntimeException("Failed to get fiscal day status: " + e.getMessage(), e);

}

}

Opening a Fiscal Day

Before processing any invoices, you need to ensure that a fiscal day is open. If the fiscal day status indicates that no day is open, you'll need to open one.

### 1. Build the open fiscal day request:

public void openFiscalDay() {

// Create an OpenFiscalDayRequest object

OpenFiscalDayRequest request = OpenFiscalDayRequest.builder()

.deviceId(DEVICE_ID)

.fiscalDay(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))

.build();

// Open the fiscal day

OpenFiscalDayResponse openResponse = openFiscalDay(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Open Fiscal Day: {0}",

openResponse.isSuccess() ? "Success" : "Failed"

);

}

### 2. Call the open fiscal day service:

public OpenFiscalDayResponse openFiscalDay(OpenFiscalDayRequest request) {

// Initialize the open fiscal day service

FdmsOpenFiscalDay openService = new FdmsOpenFiscalDay(TEST_SERVER_BASE_URL);

try {

// Open the fiscal day and return the response

return openService.openFiscalDay(request);

} catch (OpenFiscalDayException e) {

throw new RuntimeException("Failed to open fiscal day: " + e.getMessage(), e);

}

}

Processing Invoices

Once you have an open fiscal day, you can start processing invoices. Each invoice must include the necessary details such as the invoice number, date, customer information, and line items.

### 1. Build the invoice request:

public void processInvoice() {

// Create line items for the invoice

List

invoiceLines = Arrays.asList(

InvoiceLine.builder()

.itemCode("ITEM001")

.description("Product 1")

.quantity(2)

.unitPrice(BigDecimal.valueOf(100.00))

.taxRate(BigDecimal.valueOf(15.00))

.discount(BigDecimal.ZERO)

.build(),

InvoiceLine.builder()

.itemCode("ITEM002")

.description("Product 2")

.quantity(1)

.unitPrice(BigDecimal.valueOf(200.00))

.taxRate(BigDecimal.valueOf(15.00))

.discount(BigDecimal.ZERO)

.build()

);

// Create the invoice request

ProcessInvoiceRequest request = ProcessInvoiceRequest.builder()

.deviceId(DEVICE_ID)

.invoiceNumber("INV-001")

.invoiceDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))

.customerName("John Doe")

.customerTin("123456789")

.lines(invoiceLines)

.build();

// Process the invoice

ProcessInvoiceResponse invoiceResponse = processInvoice(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Invoice Processed: {0}",

invoiceResponse.isSuccess() ? "Success" : "Failed"

);

}

### 2. Call the invoice processing service:

public ProcessInvoiceResponse processInvoice(ProcessInvoiceRequest request) {

// Initialize the invoice service

FdmsProcessInvoice invoiceService = new FdmsProcessInvoice(TEST_SERVER_BASE_URL);

try {

// Process the invoice and return the response

return invoiceService.processInvoice(request);

} catch (ProcessInvoiceException e) {

throw new RuntimeException("Failed to process invoice: " + e.getMessage(), e);

}

}

Closing a Fiscal Day

At the end of the business day, you need to close the fiscal day. This operation finalizes all transactions for the day and generates the required fiscal reports.

### 1. Build the close fiscal day request:

public void closeFiscalDay() {

// Create a CloseFiscalDayRequest object

CloseFiscalDayRequest request = CloseFiscalDayRequest.builder()

.deviceId(DEVICE_ID)

.fiscalDay(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))

.build();

// Close the fiscal day

CloseFiscalDayResponse closeResponse = closeFiscalDay(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Close Fiscal Day: {0}",

closeResponse.isSuccess() ? "Success" : "Failed"

);

if (closeResponse.isSuccess()) {

LOGGER.log(Level.INFO, "Fiscal Report Number: {0}", closeResponse.getReportNumber());

LOGGER.log(Level.INFO, "Fiscal Receipt Count: {0}", closeResponse.getReceiptCount());

LOGGER.log(Level.INFO, "Fiscal Day Total: {0}", closeResponse.getFiscalDayTotal());

}

}

### 2. Call the close fiscal day service:

public CloseFiscalDayResponse closeFiscalDay(CloseFiscalDayRequest request) {

// Initialize the fiscal day service

FdmsCloseFiscalDay closeFiscalDayService = new FdmsCloseFiscalDay(TEST_SERVER_BASE_URL);

try {

// Close the fiscal day and return the response

CloseFiscalDayResponse response = closeFiscalDayService.closeFiscalDay(request);

// Additional validation if needed

if (response == null) {

throw new CloseFiscalDayException("Received null response from fiscal day service");

}

return response;

} catch (CloseFiscalDayException e) {

LOGGER.log(Level.SEVERE, "Error closing fiscal day: " + e.getMessage(), e);

throw new RuntimeException("Failed to close fiscal day: " + e.getMessage(), e);

}

}

}

}

### 2. Call the close fiscal day service:

public CloseFiscalDayResponse closeFiscalDay(CloseFiscalDayRequest request) {

// Initialize the close fiscal day service

FdmsCloseFiscalDay closeService = new FdmsCloseFiscalDay(TEST_SERVER_BASE_URL);

try {

// Close the fiscal day and return the response

return closeService.closeFiscalDay(request);

} catch (CloseFiscalDayException e) {

throw new RuntimeException("Failed to close fiscal day: " + e.getMessage(), e);

}

}

### Important: Before closing the fiscal day, ensure that:

All transactions for the day have been processed

All invoices have been successfully transmitted to ZIMRA

You have a backup of all transaction data

Once a fiscal day is closed, no more transactions can be added to it.

Contact & Support

For any questions or issues regarding the FRAME Virtual Fiscalisation Library, please contact our support team:

### Technical Support:

support@frame.co.zw

### Sales Inquiries:

sales@frame.co.zw

### Phone:

+263 86 7718 6045

### Address:

1 Napier Ave. , Hillside, Bulawayo,

Zimbabwe

### Website:

frame.co.zw

Support Hours

### Our support team is available during the following hours (Harare Time):

Monday - Friday: 8:00 AM - 5:00 PM

Saturday: 9:00 AM - 1:00 PM

Sunday: Closed

### For faster resolution, please include the following information in your support request:

Library version

Java version

Detailed description of the issue

Steps to reproduce the issue

Any error messages or logs

Device ID (if applicable)

Emergency Support

For critical issues outside of normal business hours, please call our emergency support line at

+263 77 123 4567

.

Please note that emergency support is only available for critical production issues that are preventing business operations.

API v1.1.4

Developer

Hub

Integrate FRAME's Virtual Fiscalisation Library into your application with our comprehensive documentation and guides.

Get Started

View on GitHub

100%

ZIMRA Compliant

24/7

Support

v1.1.4

Latest Version

FiscalService.java

// Initialize FRAME Client

FrameClient client = new FrameClient.Builder()

.setApiKey("your_api_key")

.setEnvironment(Environment.PRODUCTION)

.build();

// Register device

DeviceRegistration registration = new DeviceRegistration(

## "YOUR_DEVICE_ID",

## "YOUR_SERIAL_NUMBER",

## "YOUR_ACTIVATION_KEY"

);

// Execute registration

DeviceResponse response = client.registerDevice(registration);

Table of Contents

Getting Started

Overview

Setup

1. Register a Device

2. Setup the Library

Maven Configuration

Maven Settings

Installation

Workflows

Registering Fiscal Device

Build Registration Request

Call Registration Service

Getting Device Configurations

Getting Fiscal Day Status

Opening a Fiscal Day

Date Formatting

Open Day Request

Processing Invoices

Prepare Invoice Items

Closing a Fiscal Day

Support

Contact & Support

Frame Library Developer Guide

In this guide

Overview

Steps to Get Started

Register a Device on the ZIMRA Portal

Setting up the Library

Developing the Workflows

Registering Your Fiscal Device

Getting Device Configurations

Getting the Current Fiscal Day Status

Opening a Fiscal Day

Contact & Support

Overview

This guide provides a comprehensive overview of how to integrate and utilize the Virtual Fiscalisation Library. It assists developers in registering fiscal devices, managing fiscal-related operations such as processing invoices and credit/debit notes, and ensuring compliance with fiscal requirements. The library simplifies communication with ZIMRA by abstracting complex processes into user-friendly APIs, while ensuring adherence to key rules and guidelines for handling fiscal data.

Steps to Get Started

1. Register a Device on the ZIMRA Portal

Before using the API, you need to register a fiscal device with the Zimbabwe Revenue Authority (ZIMRA). This process provides you with:

Device ID

– A unique identifier for your device.

Serial Number

– The serial number of the device.

Activation Key

– A key required to activate the device.

2. Setting up the library

### Contact FRAME sales team to acquire a API key, email:

sales@frame.co.zw

You will be provided with a username and a key, which you can use as password.

<dependency>

<groupId>inc.frame</groupId>

<artifactId>Frame-Virtual-Fiscalisation-Library</artifactId>

<version>1.1.4</version>

</dependency>

Once the dependency is in place, copy the settings.xml file below and place it in your maven .m2 directory, making sure to replace the library credentials with those provided to you by FRAME.

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"

xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0

https://maven.apache.org/xsd/settings-1.0.0.xsd">

<servers>

<server>

<id>frame-library-releases</id>

<username>library_username</username>

<password>API_KEY</password>

</server>

</servers>

<profiles>

<profile>

<id>allow-insecure-repositories</id>

<activation>

<activeByDefault>true</activeByDefault>

</activation>

<repositories>

<repository>

<id>frame-library-releases</id>

<url>https://framernd.tech/repository/frame-library-releases/</url>

<releases>

<enabled>true</enabled>

</releases>

<snapshots>

<enabled>false</enabled>

</snapshots>

</repository>

</repositories>

</profile>

</profiles>

</settings>

With the library placed in the pom file, and the settings.xml updated accordingly, you may proceed to test. In order to pull the library from the Nexus repository, you now need to run:

mvn clean install

Depending on the version of library being downloaded. Expect output similar to the below for the library download stacktrace:

[INFO]   from pom.xml

[INFO] --------------------------------[ jar ]---------------------------------

Downloading from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.pom

Downloaded from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.pom (3.1 kB at 1.3 kB/s)

Downloading from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.jar

Downloaded from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.jar (119 kB at 71 kB/s)

## [INFO]

This should pull the library without errors. If any errors are encountered you may reach out to FRAME support for assistance at

support@frame.co.zw

. Please note that while we are committed to assisting our clients with their integration of the library into the codebase, the base package for this will only include assistance in setting up the library. Development of the solution is left to the client's discretion, unless further arrangements are made for a higher tier service agreement.

Developing the workflows

In this section we will go over the key APIs ZIMRA require for fiscalisation and how to use these with the library. The sections will be divided into:

Registering your Fiscal Device

Getting device configurations

Getting the current fiscal day status

Open Fiscal Day

Pinging the ZIMRA FDMS server

Processing invoices

Closing the Fiscal Day

Registering your Fiscal Device

### Build the device registration request:

public void registerDevice() {

// Create a RegisterDeviceRequest object using the builder pattern

RegisterDeviceRequest request = RegisterDeviceRequest.builder()

.deviceId(DEVICE_ID)

.serialNumber(DEVICE_SERIAL_NUMBER)

.activationKey(DEVICE_ACTIVATION_KEY)

.build();

// Register the device and retrieve the registration response

RegisterDeviceResponse registrationResponse = registerDevice(request);

// Log the registration response

LOGGER.log(Level.INFO,

"FDMS Registration request log, whatever logic you'd like to invoke here: {0}",

registrationResponse.getSomeProperty()

);

}

Make a call to the registration service using the RDMSDeviceRegistration class provided, as shown below:

public RegisterDeviceResponse registerDevice(RegisterDeviceRequest request) {

// Initialize the device registration service with the base URL

FdmsDeviceRegistration registrationService = new FdmsDeviceRegistration(TEST_SERVER_BASE_URL);

try {

// Attempt to register the device and return the response

return registrationService.registerDevice(request);

} catch (DeviceRegistrationException e) {

// Handle exceptions and wrap them in a RuntimeException for better error reporting

throw new RuntimeException("Failed to register the device: " + e.getMessage(), e);

}

}

Getting the device configurations

Once the device is registered, you will need to get the device configurations. This will provide you with the device's configurations as well as the fiscalisation details.

### 1. Build the device configuration request:

public void getDeviceConfigurations() {

// Create a DeviceConfigurationRequest object

DeviceConfigurationRequest request = DeviceConfigurationRequest.builder()

.deviceId(DEVICE_ID)

.build();

// Get the device configurations

DeviceConfigurationResponse configResponse = getDeviceConfigurations(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Device Configuration: {0}",

configResponse.getSomeProperty()

);

}

### 2. Call the device configuration service:

public DeviceConfigurationResponse getDeviceConfigurations(DeviceConfigurationRequest request) {

// Initialize the device configuration service

FdmsDeviceConfigurations configService = new FdmsDeviceConfigurations(TEST_SERVER_BASE_URL);

try {

// Fetch and return the device configurations

return configService.getDeviceConfigurations(request);

} catch (DeviceConfigurationException e) {

throw new RuntimeException("Failed to get device configurations: " + e.getMessage(), e);

}

}

Getting the current fiscal day status

Once the device is registered and configured, you will need to check the current fiscal day status. This will let you know if the device is ready to process invoices or if you need to open a new fiscal day.

### 1. Build the fiscal day status request:

public void getFiscalDayStatus() {

// Create a FiscalDayStatusRequest object

FiscalDayStatusRequest request = FiscalDayStatusRequest.builder()

.deviceId(DEVICE_ID)

.build();

// Get the fiscal day status

FiscalDayStatusResponse statusResponse = getFiscalDayStatus(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Fiscal Day Status: {0}",

statusResponse.getStatus()

);

}

### 2. Call the fiscal day status service:

public FiscalDayStatusResponse getFiscalDayStatus(FiscalDayStatusRequest request) {

// Initialize the fiscal day status service

FdmsFiscalDayStatus statusService = new FdmsFiscalDayStatus(TEST_SERVER_BASE_URL);

try {

// Fetch and return the fiscal day status

return statusService.getFiscalDayStatus(request);

} catch (FiscalDayStatusException e) {

throw new RuntimeException("Failed to get fiscal day status: " + e.getMessage(), e);

}

}

Opening a Fiscal Day

Before processing any invoices, you need to ensure that a fiscal day is open. If the fiscal day status indicates that no day is open, you'll need to open one.

### 1. Build the open fiscal day request:

public void openFiscalDay() {

// Create an OpenFiscalDayRequest object

OpenFiscalDayRequest request = OpenFiscalDayRequest.builder()

.deviceId(DEVICE_ID)

.fiscalDay(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))

.build();

// Open the fiscal day

OpenFiscalDayResponse openResponse = openFiscalDay(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Open Fiscal Day: {0}",

openResponse.isSuccess() ? "Success" : "Failed"

);

}

### 2. Call the open fiscal day service:

public OpenFiscalDayResponse openFiscalDay(OpenFiscalDayRequest request) {

// Initialize the open fiscal day service

FdmsOpenFiscalDay openService = new FdmsOpenFiscalDay(TEST_SERVER_BASE_URL);

try {

// Open the fiscal day and return the response

return openService.openFiscalDay(request);

} catch (OpenFiscalDayException e) {

throw new RuntimeException("Failed to open fiscal day: " + e.getMessage(), e);

}

}

Processing Invoices

Once you have an open fiscal day, you can start processing invoices. Each invoice must include the necessary details such as the invoice number, date, customer information, and line items.

### 1. Build the invoice request:

public void processInvoice() {

// Create line items for the invoice

List

invoiceLines = Arrays.asList(

InvoiceLine.builder()

.itemCode("ITEM001")

.description("Product 1")

.quantity(2)

.unitPrice(BigDecimal.valueOf(100.00))

.taxRate(BigDecimal.valueOf(15.00))

.discount(BigDecimal.ZERO)

.build(),

InvoiceLine.builder()

.itemCode("ITEM002")

.description("Product 2")

.quantity(1)

.unitPrice(BigDecimal.valueOf(200.00))

.taxRate(BigDecimal.valueOf(15.00))

.discount(BigDecimal.ZERO)

.build()

);

// Create the invoice request

ProcessInvoiceRequest request = ProcessInvoiceRequest.builder()

.deviceId(DEVICE_ID)

.invoiceNumber("INV-001")

.invoiceDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))

.customerName("John Doe")

.customerTin("123456789")

.lines(invoiceLines)

.build();

// Process the invoice

ProcessInvoiceResponse invoiceResponse = processInvoice(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Invoice Processed: {0}",

invoiceResponse.isSuccess() ? "Success" : "Failed"

);

}

### 2. Call the invoice processing service:

public ProcessInvoiceResponse processInvoice(ProcessInvoiceRequest request) {

// Initialize the invoice service

FdmsProcessInvoice invoiceService = new FdmsProcessInvoice(TEST_SERVER_BASE_URL);

try {

// Process the invoice and return the response

return invoiceService.processInvoice(request);

} catch (ProcessInvoiceException e) {

throw new RuntimeException("Failed to process invoice: " + e.getMessage(), e);

}

}

Closing a Fiscal Day

At the end of the business day, you need to close the fiscal day. This operation finalizes all transactions for the day and generates the required fiscal reports.

### 1. Build the close fiscal day request:

public void closeFiscalDay() {

// Create a CloseFiscalDayRequest object

CloseFiscalDayRequest request = CloseFiscalDayRequest.builder()

.deviceId(DEVICE_ID)

.fiscalDay(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))

.build();

// Close the fiscal day

CloseFiscalDayResponse closeResponse = closeFiscalDay(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Close Fiscal Day: {0}",

closeResponse.isSuccess() ? "Success" : "Failed"

);

if (closeResponse.isSuccess()) {

LOGGER.log(Level.INFO, "Fiscal Report Number: {0}", closeResponse.getReportNumber());

LOGGER.log(Level.INFO, "Fiscal Receipt Count: {0}", closeResponse.getReceiptCount());

LOGGER.log(Level.INFO, "Fiscal Day Total: {0}", closeResponse.getFiscalDayTotal());

}

}

### 2. Call the close fiscal day service:

public CloseFiscalDayResponse closeFiscalDay(CloseFiscalDayRequest request) {

// Initialize the fiscal day service

FdmsCloseFiscalDay closeFiscalDayService = new FdmsCloseFiscalDay(TEST_SERVER_BASE_URL);

try {

// Close the fiscal day and return the response

CloseFiscalDayResponse response = closeFiscalDayService.closeFiscalDay(request);

// Additional validation if needed

if (response == null) {

throw new CloseFiscalDayException("Received null response from fiscal day service");

}

return response;

} catch (CloseFiscalDayException e) {

LOGGER.log(Level.SEVERE, "Error closing fiscal day: " + e.getMessage(), e);

throw new RuntimeException("Failed to close fiscal day: " + e.getMessage(), e);

}

}

}

}

### 2. Call the close fiscal day service:

public CloseFiscalDayResponse closeFiscalDay(CloseFiscalDayRequest request) {

// Initialize the close fiscal day service

FdmsCloseFiscalDay closeService = new FdmsCloseFiscalDay(TEST_SERVER_BASE_URL);

try {

// Close the fiscal day and return the response

return closeService.closeFiscalDay(request);

} catch (CloseFiscalDayException e) {

throw new RuntimeException("Failed to close fiscal day: " + e.getMessage(), e);

}

}

### Important: Before closing the fiscal day, ensure that:

All transactions for the day have been processed

All invoices have been successfully transmitted to ZIMRA

You have a backup of all transaction data

Once a fiscal day is closed, no more transactions can be added to it.

Contact & Support

For any questions or issues regarding the FRAME Virtual Fiscalisation Library, please contact our support team:

### Technical Support:

support@frame.co.zw

### Sales Inquiries:

sales@frame.co.zw

### Phone:

+263 86 7718 6045

### Address:

1 Napier Ave. , Hillside, Bulawayo,

Zimbabwe

### Website:

frame.co.zw

Support Hours

### Our support team is available during the following hours (Harare Time):

Monday - Friday: 8:00 AM - 5:00 PM

Saturday: 9:00 AM - 1:00 PM

Sunday: Closed

### For faster resolution, please include the following information in your support request:

Library version

Java version

Detailed description of the issue

Steps to reproduce the issue

Any error messages or logs

Device ID (if applicable)

Emergency Support

For critical issues outside of normal business hours, please call our emergency support line at

+263 77 123 4567

.

Please note that emergency support is only available for critical production issues that are preventing business operations.

API v1.1.4

Developer

Hub

Integrate FRAME's Virtual Fiscalisation Library into your application with our comprehensive documentation and guides.

Get Started

View on GitHub

100%

ZIMRA Compliant

24/7

Support

v1.1.4

Latest Version

FiscalService.java

// Initialize FRAME Client

FrameClient client = new FrameClient.Builder()

.setApiKey("your_api_key")

.setEnvironment(Environment.PRODUCTION)

.build();

// Register device

DeviceRegistration registration = new DeviceRegistration(

## "YOUR_DEVICE_ID",

## "YOUR_SERIAL_NUMBER",

## "YOUR_ACTIVATION_KEY"

);

// Execute registration

DeviceResponse response = client.registerDevice(registration);

Scroll to explore

Frame Library Developer Guide

In this guide

Overview

Steps to Get Started

Register a Device on the ZIMRA Portal

Setting up the Library

Developing the Workflows

Registering Your Fiscal Device

Getting Device Configurations

Getting the Current Fiscal Day Status

Opening a Fiscal Day

Contact & Support

Overview

This guide provides a comprehensive overview of how to integrate and utilize the Virtual Fiscalisation Library. It assists developers in registering fiscal devices, managing fiscal-related operations such as processing invoices and credit/debit notes, and ensuring compliance with fiscal requirements. The library simplifies communication with ZIMRA by abstracting complex processes into user-friendly APIs, while ensuring adherence to key rules and guidelines for handling fiscal data.

Steps to Get Started

1. Register a Device on the ZIMRA Portal

Before using the API, you need to register a fiscal device with the Zimbabwe Revenue Authority (ZIMRA). This process provides you with:

Device ID

– A unique identifier for your device.

Serial Number

– The serial number of the device.

Activation Key

– A key required to activate the device.

2. Setting up the library

### Contact FRAME sales team to acquire a API key, email:

sales@frame.co.zw

You will be provided with a username and a key, which you can use as password.

<dependency>

<groupId>inc.frame</groupId>

<artifactId>Frame-Virtual-Fiscalisation-Library</artifactId>

<version>1.1.4</version>

</dependency>

Once the dependency is in place, copy the settings.xml file below and place it in your maven .m2 directory, making sure to replace the library credentials with those provided to you by FRAME.

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"

xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0

https://maven.apache.org/xsd/settings-1.0.0.xsd">

<servers>

<server>

<id>frame-library-releases</id>

<username>library_username</username>

<password>API_KEY</password>

</server>

</servers>

<profiles>

<profile>

<id>allow-insecure-repositories</id>

<activation>

<activeByDefault>true</activeByDefault>

</activation>

<repositories>

<repository>

<id>frame-library-releases</id>

<url>https://framernd.tech/repository/frame-library-releases/</url>

<releases>

<enabled>true</enabled>

</releases>

<snapshots>

<enabled>false</enabled>

</snapshots>

</repository>

</repositories>

</profile>

</profiles>

</settings>

With the library placed in the pom file, and the settings.xml updated accordingly, you may proceed to test. In order to pull the library from the Nexus repository, you now need to run:

mvn clean install

Depending on the version of library being downloaded. Expect output similar to the below for the library download stacktrace:

[INFO]   from pom.xml

[INFO] --------------------------------[ jar ]---------------------------------

Downloading from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.pom

Downloaded from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.pom (3.1 kB at 1.3 kB/s)

Downloading from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.jar

Downloaded from frame-library-releases: https://framernd.tech/repository/frame-library-releases/inc/frame/Frame-Virtual-Fiscalisation-Library/1.1.1/Frame-Virtual-Fiscalisation-Library-1.1.1.jar (119 kB at 71 kB/s)

## [INFO]

This should pull the library without errors. If any errors are encountered you may reach out to FRAME support for assistance at

support@frame.co.zw

. Please note that while we are committed to assisting our clients with their integration of the library into the codebase, the base package for this will only include assistance in setting up the library. Development of the solution is left to the client's discretion, unless further arrangements are made for a higher tier service agreement.

Developing the workflows

In this section we will go over the key APIs ZIMRA require for fiscalisation and how to use these with the library. The sections will be divided into:

Registering your Fiscal Device

Getting device configurations

Getting the current fiscal day status

Open Fiscal Day

Pinging the ZIMRA FDMS server

Processing invoices

Closing the Fiscal Day

Registering your Fiscal Device

### Build the device registration request:

public void registerDevice() {

// Create a RegisterDeviceRequest object using the builder pattern

RegisterDeviceRequest request = RegisterDeviceRequest.builder()

.deviceId(DEVICE_ID)

.serialNumber(DEVICE_SERIAL_NUMBER)

.activationKey(DEVICE_ACTIVATION_KEY)

.build();

// Register the device and retrieve the registration response

RegisterDeviceResponse registrationResponse = registerDevice(request);

// Log the registration response

LOGGER.log(Level.INFO,

"FDMS Registration request log, whatever logic you'd like to invoke here: {0}",

registrationResponse.getSomeProperty()

);

}

Make a call to the registration service using the RDMSDeviceRegistration class provided, as shown below:

public RegisterDeviceResponse registerDevice(RegisterDeviceRequest request) {

// Initialize the device registration service with the base URL

FdmsDeviceRegistration registrationService = new FdmsDeviceRegistration(TEST_SERVER_BASE_URL);

try {

// Attempt to register the device and return the response

return registrationService.registerDevice(request);

} catch (DeviceRegistrationException e) {

// Handle exceptions and wrap them in a RuntimeException for better error reporting

throw new RuntimeException("Failed to register the device: " + e.getMessage(), e);

}

}

Getting the device configurations

Once the device is registered, you will need to get the device configurations. This will provide you with the device's configurations as well as the fiscalisation details.

### 1. Build the device configuration request:

public void getDeviceConfigurations() {

// Create a DeviceConfigurationRequest object

DeviceConfigurationRequest request = DeviceConfigurationRequest.builder()

.deviceId(DEVICE_ID)

.build();

// Get the device configurations

DeviceConfigurationResponse configResponse = getDeviceConfigurations(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Device Configuration: {0}",

configResponse.getSomeProperty()

);

}

### 2. Call the device configuration service:

public DeviceConfigurationResponse getDeviceConfigurations(DeviceConfigurationRequest request) {

// Initialize the device configuration service

FdmsDeviceConfigurations configService = new FdmsDeviceConfigurations(TEST_SERVER_BASE_URL);

try {

// Fetch and return the device configurations

return configService.getDeviceConfigurations(request);

} catch (DeviceConfigurationException e) {

throw new RuntimeException("Failed to get device configurations: " + e.getMessage(), e);

}

}

Getting the current fiscal day status

Once the device is registered and configured, you will need to check the current fiscal day status. This will let you know if the device is ready to process invoices or if you need to open a new fiscal day.

### 1. Build the fiscal day status request:

public void getFiscalDayStatus() {

// Create a FiscalDayStatusRequest object

FiscalDayStatusRequest request = FiscalDayStatusRequest.builder()

.deviceId(DEVICE_ID)

.build();

// Get the fiscal day status

FiscalDayStatusResponse statusResponse = getFiscalDayStatus(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Fiscal Day Status: {0}",

statusResponse.getStatus()

);

}

### 2. Call the fiscal day status service:

public FiscalDayStatusResponse getFiscalDayStatus(FiscalDayStatusRequest request) {

// Initialize the fiscal day status service

FdmsFiscalDayStatus statusService = new FdmsFiscalDayStatus(TEST_SERVER_BASE_URL);

try {

// Fetch and return the fiscal day status

return statusService.getFiscalDayStatus(request);

} catch (FiscalDayStatusException e) {

throw new RuntimeException("Failed to get fiscal day status: " + e.getMessage(), e);

}

}

Opening a Fiscal Day

Before processing any invoices, you need to ensure that a fiscal day is open. If the fiscal day status indicates that no day is open, you'll need to open one.

### 1. Build the open fiscal day request:

public void openFiscalDay() {

// Create an OpenFiscalDayRequest object

OpenFiscalDayRequest request = OpenFiscalDayRequest.builder()

.deviceId(DEVICE_ID)

.fiscalDay(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))

.build();

// Open the fiscal day

OpenFiscalDayResponse openResponse = openFiscalDay(request);

// Log the response

LOGGER.log(Level.INFO,

"FDMS Open Fiscal Day: {0}",

openResponse.isSuccess() ? "Success" : "Failed"

);

}

### 2. Call the open fiscal day service:

public OpenFiscalDayResponse openFiscalDay(OpenFiscalDayRequest request) {

// Initialize the open fiscal day service

FdmsOpenFiscalDay openService = new FdmsOpenFiscalDay(TEST_SERVER_BASE_URL);

try {

// Open the fiscal day and return the response

return openService.openFiscalDay(request);

} catch (OpenFiscalDayException e) {

throw new RuntimeException("Failed to open fiscal day: " + e.getMessage(), e);

}

}

Contact & Support

For any questions or issues regarding the FRAME Virtual Fiscalisation Library, please contact our support team:

### Technical Support:

support@frame.co.zw

### Sales Inquiries:

sales@frame.co.zw

### Phone:

+263 86 7718 6045

### Address:

1 Napier Ave. , Hillside, Bulawayo,

Zimbabwe

### Website:

frame.co.zw

Support Hours

### Our support team is available during the following hours (Harare Time):

Monday - Friday: 8:00 AM - 5:00 PM

Saturday: 9:00 AM - 1:00 PM

Sunday: Closed

### For faster resolution, please include the following information in your support request:

Library version

Java version

Detailed description of the issue

Steps to reproduce the issue

Any error messages or logs

Device ID (if applicable)

Emergency Support

For critical issues outside of normal business hours, please call our emergency support line at

+263 77 123 4567

.

Please note that emergency support is only available for critical production issues that are preventing business operations.

