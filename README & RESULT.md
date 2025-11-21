# File Service API (NestJS)

This README documents the CSV Upload/Download functionality for your
NestJS File Module.

---

## Base URL

    http://localhost:3000

---

## 1. Upload CSV

### **POST** `/file/upload`

Uploads a CSV file and imports records into MongoDB using stream-based
processing.

### **Headers**

    Content-Type: multipart/form-data

### **Body (form-data)**

Key Type Description

---

file File CSV file to upload (with header row)

### **Sample CSV Format**

```csv
name,email,age
arun kumar,test@example.com,28
nithya,alice@example.com,30
```

### **Success Response**

```json
{
  "success": true,
  "inserted": 2
}
```

### **Failure Response**

```json
{
  "success": false,
  "inserted": 0
}
```

## 2. Download CSV

### **GET** `/file/export`

Exports CSV data stored in MongoDB.

### **Success Response (CSV file download)**

name,email,age
arun kumar,test@example.com,28
nithya,alice@example.com,30

### **If No Records**

    CSV export completed. Exported: 0 records.

## Folder Structure

    src/
     └── modules/
         └── file/
             ├── file.controller.ts
             ├── file.service.ts
             ├── dto/
             ├── interfaces/
             └── ...

## Tech Used

- NestJS
- Stream API (Readable, Transform, Writable)
- Mongoose
- pipeline() for async streaming
- CSV import/export

## 🧩 Notes

- Skips header row automatically.
- Skips empty lines.
- Converts invalid/empty age → `null` instead of crashing.
- DB insertion errors do **not** stop the stream; they are logged and
  flow continues.

## Example cURL Command

### Upload:

```bash
curl -X POST http://localhost:3000/file/upload   -F "file=@./sample.csv"
```

### Download:

```bash
curl -X GET http://localhost:3000/file/export --output export.csv
```

---

## © API Documentation Generated Automatically
