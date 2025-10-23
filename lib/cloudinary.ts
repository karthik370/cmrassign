import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' = 'raw'
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(buffer)
  })
}

export const deleteFromCloudinary = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId)
}

export const getSignedUrl = (publicId: string, expiresIn: number = 3600) => {
  return cloudinary.url(publicId, {
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
  })
}
