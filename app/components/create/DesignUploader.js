"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useAccount, useWalletClient } from "wagmi"
import { PINATA_JWT } from "../../../contract_data/constants"

export default function DesignUploader({ designData, setDesignData, onNext }) {
  const { address } = useAccount()
  const { data: wallet } = useWalletClient()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setDesignData({ ...designData, file })
      }
    },
    [designData, setDesignData],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const uploadToPinata = async (file) => {
    setUploadProgress(25)
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload to IPFS")
    }

    const result = await response.json()
    setUploadProgress(50)
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  }

  const uploadMetadata = async (imageUrl) => {
    setUploadProgress(75)
    const metadata = {
      name: designData.title || "Untitled Design",
      description: designData.description || "Fashion design created on Vogue",
      image: imageUrl,
      attributes: [
        { trait_type: "Creator", value: address },
        { trait_type: "Category", value: designData.category || "fashion" },
        { trait_type: "Created", value: new Date().toISOString() },
        { trait_type: "Platform", value: "Vogue" },
      ],
      external_url: `https://vogue.fashion/design/${Date.now()}`,
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    })

    if (!response.ok) {
      throw new Error("Failed to upload metadata to IPFS")
    }

    const result = await response.json()
    setUploadProgress(100)
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  }

  const handleQuickUpload = async () => {
    if (!designData.file || !wallet) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Upload image to IPFS
      const imageUrl = await uploadToPinata(designData.file)

      // Create metadata and upload to IPFS
      const metadataUrl = await uploadMetadata(imageUrl)

      // Update design data with IPFS URLs
      setDesignData({
        ...designData,
        imageUrl,
        metadataUrl,
        uploadComplete: true,
      })

      // Show success message
      alert("✅ Design uploaded to IPFS successfully!")
    } catch (error) {
      console.error("Upload failed:", error)
      alert("❌ Upload failed: " + error.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = () => {
    setDesignData({ ...designData, file: null, imageUrl: null, metadataUrl: null, uploadComplete: false })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Design</h2>
        <p className="text-gray-600">
          Upload your original fashion design. It will be stored on IPFS for decentralized access.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-purple-500 bg-purple-50"
            : designData.file
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
        }`}
      >
        <input {...getInputProps()} />

        {designData.file ? (
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-lg">
              <img
                src={URL.createObjectURL(designData.file) || "/placeholder.svg"}
                alt="Uploaded design"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{designData.file.name}</p>
              <p className="text-sm text-gray-500">{(designData.file.size / 1024 / 1024).toFixed(2)} MB</p>
              {designData.uploadComplete && (
                <div className="flex items-center justify-center mt-2">
                  <span className="text-green-600 text-sm font-medium">✅ Uploaded to IPFS</span>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              {!designData.uploadComplete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleQuickUpload()
                  }}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                >
                  {uploading ? `Uploading... ${uploadProgress}%` : "📤 Upload to IPFS"}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove File
              </button>
            </div>

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📁</div>
            <div>
              <p className="text-xl font-medium text-gray-800 mb-2">
                {isDragActive ? "Drop your design here" : "Drag & drop your design here"}
              </p>
              <p className="text-gray-500">or click to browse files</p>
            </div>
          </div>
        )}
      </div>

      {/* IPFS Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">🌐 Decentralized Storage</h4>
        <p className="text-sm text-blue-700">
          Your design will be stored on IPFS (InterPlanetary File System) ensuring permanent, decentralized access. This
          creates an immutable record of your creative work.
        </p>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!designData.file}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Add Details →
        </button>
      </div>
    </div>
  )
}
