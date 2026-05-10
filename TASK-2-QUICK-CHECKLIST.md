# ⚡ TASK 2: SERVICE ACCOUNT KEYS - QUICK CHECKLIST
**UNBLOCKS**: Tasks 3, 4, 5 and all subsequent infrastructure setup

---

## 🎯 WHAT YOU NEED TO DO

Obtain 2 JSON service account keys from GCP and insert them into local files.

**Time Required**: 5-10 minutes  
**Difficulty**: Easy  
**GCP Access Required**: Yes (cosec@arunika2045.com)

---

## 📋 STEP-BY-STEP CHECKLIST

### FOR SERVICE ACCOUNT #1: arunika-central-hub-api

#### Step 1: Get the JSON key from GCP
- [ ] Go to https://console.cloud.google.com/iam-admin/serviceaccounts?project=arunika-central-hub
- [ ] Click on "arunika-central-hub-api" in the list
- [ ] Click the "Keys" tab
- [ ] Click "Add Key" → "Create new key"
- [ ] Select "JSON" format
- [ ] Click "Create"
- [ ] Browser downloads file: `arunika-central-hub-api-XXXXX.json`

#### Step 2: Extract the private key
- [ ] Open the downloaded JSON file in a text editor
- [ ] Find the `"private_key"` field (contains the RSA key)
- [ ] Copy the ENTIRE value (including the escaped `\n` characters)
  - It starts with: `-----BEGIN RSA PRIVATE KEY-----`
  - It ends with: `-----END RSA PRIVATE KEY-----`

#### Step 3: Insert into local file
- [ ] Open: `P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\gcp-service-account.json`
- [ ] Replace the `"private_key"` value with the actual key from Step 2
- [ ] Save the file
- [ ] Verify JSON is valid (test at https://jsonlint.com/ if needed)

---

### FOR SERVICE ACCOUNT #2: arunika-central-hub-gmail

#### Step 1: Get the JSON key from GCP
- [ ] Go back to https://console.cloud.google.com/iam-admin/serviceaccounts?project=arunika-central-hub
- [ ] Click on "arunika-central-hub-gmail" in the list
- [ ] Click the "Keys" tab
- [ ] Click "Add Key" → "Create new key"
- [ ] Select "JSON" format
- [ ] Click "Create"
- [ ] Browser downloads file: `arunika-central-hub-gmail-XXXXX.json`

#### Step 2: Extract the private key
- [ ] Open the downloaded JSON file in a text editor
- [ ] Find the `"private_key"` field
- [ ] Copy the ENTIRE value (including escaped `\n` characters)

#### Step 3: Insert into local file
- [ ] Open: `P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\gcp-gmail-sa.json`
- [ ] Replace the `"private_key"` value with the actual key from Step 2
- [ ] Save the file
- [ ] Verify JSON is valid

---

## ✅ VERIFICATION

After completing all steps:

- [ ] Both JSON files have actual private key material (not placeholder text)
- [ ] Both JSON files are valid JSON syntax
- [ ] Both files are in: `P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\`
- [ ] File names are exactly: `gcp-service-account.json` and `gcp-gmail-sa.json`

---

## 🎉 DONE!

Once you've completed this checklist:
- Task 2 is COMPLETE
- Tasks 3, 4, 5 can proceed
- All downstream infrastructure setup is UNBLOCKED

---

## ⚠️ COMMON ISSUES

**"I can't find the private_key field"**
- It's always in the JSON key file from GCP
- Search for `"private_key":`
- The value is a long string with `\n` in it

**"The key has `\n` in it - is that right?"**
- YES, that's correct!
- The `\n` are literal backslash-n characters (not newlines)
- They're part of the JSON format

**"I got the key but the JSON is invalid"**
- Check: Is the entire private_key value enclosed in quotes?
- Check: Are there any unescaped newlines in the key?
- Paste your JSON into https://jsonlint.com/ to find errors

---

**THIS IS THE ONLY MANUAL STEP BLOCKING ALL REMAINING TASKS**

Once done, the rest is automated.
