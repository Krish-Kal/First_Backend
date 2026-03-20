import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (localfilePath) => {
    try{
        if(!localfilePath) return null;
        //upload file to cloudinary
       const response = await cloudinary.uploader.upload(localfilePath,{
            resource_type: "auto",
        })
        console.log("File uploaded to cloudinary successfully", response.url);
        return response;
    }
    catch(error)
    {
        fs.unlinkSync(localfilePath) // unlink the file from local storage
        return null;
    }
}
export { UploadOnCloudinary };