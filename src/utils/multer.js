// import { mkdir } from "fs";
// import path from 'path';
// const categoryStorage = diskStorage({
//     destination: function (req, file, cb) {
//         const dir = './public/category';
//         mkdir(dir, { recursive: true }, (error) => cb(error, dir));
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const first4Chars = file.originalname.slice(0, 4);
//         cb(null, Date.now() + 'category-image' + first4Chars + ext);
//     },
// });

// export const categoryImageUpload = multer({
//     storage: categoryStorage,
//     limits: { fileSize: 1 * 1024 * 1024 },
// }).single('image');

 import multer from 'multer';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
const isProduction = process.env.ENVIRONMENT === 'production';
export const s3 = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const saveLocally = async (file, folderName, filePrefix, fieldname) => {
    console.log(file)
    const timestamp = Date.now();
    const first4Chars = file.originalname.slice(0, 4);
    const ext = file.originalname.includes('.') ? file.originalname.slice(file.originalname.lastIndexOf('.')) : '.jpg';
    const filename = `${filePrefix}-${timestamp}-${first4Chars}${ext}`;
    const localFolder = `${process.cwd()}/public/${folderName}`;
    if (!fs.existsSync(localFolder)) {
        fs.mkdirSync(localFolder, { recursive: true });
    }
    const filePath = `${localFolder}/${filename}`;
    fs.writeFileSync(filePath, file.buffer);
    console.log('s3Url', `http://localhost:${process.env.PORT}/${folderName}/${filename}`, '::::', 'field:', fieldname);
    return {
        field: fieldname,
        fileName: filename,
        originalName: file.originalname,
        s3Url: `http://localhost:${process.env.PORT}/${folderName}/${filename}`,
        // s3Url: `https://molimornode-production.up.railway.app/${folderName}/${filename}`,
    };
};
const storage = multer.memoryStorage();
export const createS3Uploader = ({ folderName, filePrefix = '', fieldType = 'single', fieldName, customFields = [], fileSizeMB, } = {}) => {
    const limits = {
        fileSize: fileSizeMB * 1024 * 1024,
    };
    const upload = multer({
        storage,
        limits,
    });
    let multerUpload;
    if (fieldType === 'single') {
        multerUpload = upload.single(fieldName);
    } else if (fieldType === 'array') {
        multerUpload = upload.array(fieldName, customFields?.[0]?.maxCount || 1);
    } else if (fieldType === 'fields') {
        multerUpload = upload.fields(customFields);
    } else {
        throw new Error("Invalid fieldType for uploader");
    };
    return [
        multerUpload,
        async (req, res, next) => {
            try {
                const files = req.files || (req.file ? { [fieldName]: [req.file] } : {});
                req.uploadedImages = [];
                for (const [key, fileArray] of Object.entries(files)) {
                    for (const file of fileArray) {
                        if (isProduction) {
                            const timestamp = Date.now();
                            const first4Chars = file.originalname.slice(0, 4);
                            const ext = path.extname(file.originalname);
                            const isBlob = ext === '.blob'; // or use mimetype check if needed
                            const finalExt = isBlob ? '.jpg' : ext; // Default to .jpg if it's a blob
                            const finalMime = isBlob ? 'image/jpeg' : file.mimetype; // Default to image/jpeg if it's a blob
                            const filename = `${filePrefix}-${timestamp}-${first4Chars}${finalExt}`;
                            const s3Key = `${folderName}/${filename}`;
                            const command = new PutObjectCommand({
                                Bucket: process.env.AWS_BUCKET_NAME,
                                Key: s3Key,
                                Body: file.buffer,
                                ContentType: finalMime,//file.mimetype,//ext,
                                ContentDisposition: "inline",
                            });
                            await s3.send(command);
                            const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
                            req.uploadedImages.push({
                                field: key,
                                fileName: filename,
                                originalName: file.originalname,
                                s3Url,
                            });
                            console.log('[S3 Upload] uploadedImages =>', req.uploadedImages);
                        } else {
                            console.log(file)
                            const localFile = await saveLocally(file, folderName, filePrefix, file.fieldname);
                            req.uploadedImages.push({
                                field: key,
                                ...localFile,
                            });
                        };
                    }
                };
                next();
            } catch (error) {
                console.error('[S3 Upload] Error occurred during file upload:', error);
                next(error);
            };
        },
    ];
};


export const categoryImageUpload = createS3Uploader({
    folderName: 'category',
    filePrefix: 'category',
    fieldType: 'single',
    fieldName: 'image',
    fileSizeMB: 1,
});