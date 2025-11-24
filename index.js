const path = require('path');
const os = require('os');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const generateMHTML = require('./playwright-script');

const S3_BUCKET = 'mhtml-snapshots-demo'; // your bucket name
const REGION = 'eu-north-1'; // your bucket region

exports.handler = async (event) => {
  const url = event.queryStringParameters?.url || event.url || 'https://example.com';
  const outputPath = path.join(os.tmpdir(), 'page.mhtml');

  try {
    await generateMHTML(url, outputPath);

    // Read the file content
    const fileContent = fs.readFileSync(outputPath);

    // Initialize S3 client
    const s3Client = new S3Client({ region: REGION });

    // Prepare upload parameters
    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: `snapshots/${Date.now()}-snapshot.mhtml`, // unique filename with timestamp
      Body: fileContent,
      ContentType: 'multipart/related',
    };

    // Upload to S3
    await s3Client.send(new PutObjectCommand(uploadParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'MHTML file uploaded successfully', key: uploadParams.Key }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error generating or uploading MHTML: ${error.message}`,
    };
  }
};