const cloudinary = require('cloudinary').v2;
const uploadImageToCloudinary= async (req) => {
    console.log("i am inside cloudinary")
    console.log("the file is ")
    console.log(req)
	if (!req ) {
	  return res.status(400).json({ error: 'No file uploaded' });
	}
  
	const image = req;
  
	
        console.log("the image file path is ",image.tempFilePath)
	  // Upload the image file to Cloudinary
	  const result = await cloudinary.uploader.upload(image.tempFilePath);
      console.log("the result is ",result)
  
	  // Respond with the Cloudinary URL
	  return  result.secure_url;
	
  }

  module.exports={uploadImageToCloudinary}