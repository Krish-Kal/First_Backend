import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (filePath) => {
    try{
        if(!filePath) return null;
        //upload file to cloudinary
       const response = await cloudinary.uploader.upload(filePath,{
            resource_type: "auto",
        })
        console.log("File uploaded to cloudinary successfully", response.url);
        return response;
    }
    catch(error)
    {
        fs.unlinkSync(filePath) // unlink the file from local storage
        return null;
    }
}
export default UploadOnCloudinary;