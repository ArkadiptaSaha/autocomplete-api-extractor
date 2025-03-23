# 🚀 Autocomplete API Extractor

## 📌 **Project Description**
This project is designed to systematically **extract all possible names** from an autocomplete API. The challenge lies in the lack of official documentation, requiring an exploratory and adaptive approach. The program queries the API using **single, double, and triple-letter prefixes** (from `a` → `z`, `aa` → `zz`, and `aaa` → `zzz`) to discover and save all potential names. 

The extracted names are saved to a **CSV file** (`names.csv`) in real time to prevent data loss in case of interruptions.

---

## 🌐 **API Endpoint**
The solution interacts with the following API:

- **Base URL:**  
- **Autocomplete Query Format:**  
- **Example Queries:**  

---

## 💡 **Project Approach**

### 1️⃣ **Prefix Generation**
The script generates **all possible prefixes** of lengths:
- **Single-letter**: `a` → `z`  
- **Double-letter**: `aa` → `zz`  
- **Triple-letter**: `aaa` → `zzz`  

These prefixes form the basis for querying the autocomplete API.

---

### 2️⃣ **Data Extraction Process**
For each prefix:
- The script sends an HTTP `GET` request to the `/v1/autocomplete` endpoint.
- It retrieves a JSON response containing:
    - `version`: The API version.
    - `count`: The number of names returned.
    - `results`: An array of names.

✅ **Example API Response:**
```json
{
    "version": "v1",
    "count": 10,
    "results": [
        "aa",
        "aabdknlvkc",
        "aabrkcd",
        "aadgdqrwdy",
        "aagqg",
        "aaiha",
        "aainmxg",
        "aajfebume",
        "aajwv",
        "aakfubvxv"
    ]
}
