# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for a free account
3. After signing in, go to the Dashboard

## Step 2: Get Your Credentials
From your Cloudinary Dashboard, you'll find:
- **Cloud Name**: e.g., `dxyz12abc`
- **API Key**: e.g., `123456789012345`
- **API Secret**: e.g., `abcdefghijklmnopqrstuvwxyz123`

## Step 3: Update application.properties
Replace the placeholder values in:
`Salon_Mgmt_Backend/src/main/resources/application.properties`

```properties
#Cloudinary config
cloudinary.cloud-name=YOUR_CLOUD_NAME_HERE
cloudinary.api-key=YOUR_API_KEY_HERE
cloudinary.api-secret=YOUR_API_SECRET_HERE
```

## Step 4: Restart the Backend
After updating the credentials:
1. Stop the backend server (Ctrl+C)
2. Rebuild: `./mvnw.cmd clean compile`
3. Restart: `./mvnw.cmd spring-boot:run -DskipTests`

## What Changed
✅ Added Cloudinary dependency to pom.xml
✅ Created CloudinaryConfig, CloudinaryService, CloudinaryServiceImpl
✅ Updated OwnerServiceImpl to upload salon logos & gallery images to Cloudinary
✅ Updated UserServiceImpl to upload profile images to Cloudinary
✅ All new uploads will now return Cloudinary URLs (https://res.cloudinary.com/...)
✅ Images will be accessible from anywhere, not just local server

## Note
Existing images in the database are still local file paths. For new uploads after this change, images will be stored on Cloudinary and URLs will be saved in the database.
