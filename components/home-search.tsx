"use client"

import { Camera, Search, Upload } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomeSearch = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isImageSearchActive, setIsImageSearchActive] = useState(false)
    const [searchImage, setSearchImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.error("Please enter a search term");
            return;
        }

        router.push(`/cars?search=${encodeURIComponent(searchTerm)}`)
    }

    const handleImageSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchImage) {
            toast.error("Please upload an image first");
            return;
        }
    }

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }

            setIsUploading(true);
            setSearchImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setImagePreview(reader.result);
                    toast.success("Image uploaded successfully");
                } else {
                    toast.error("Failed to preview the image");
                }
                setIsUploading(false);
            };
            reader.onerror = () => {
                setIsUploading(false);
                toast.error("Failed to read the image");
            };
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            accept: {
                "image/*": [".jpeg", ".jpg", ".png"],
            },
            maxFiles: 1,
        });


    return (
        <div>
            <form onSubmit={handleTextSubmit}>
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Enter make, model, or use our AI Image Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm"
                    />

                    {/* Image Search Button */}
                    <div className="absolute right-[100px]">
                        <Camera
                            size={35}
                            onClick={() => setIsImageSearchActive(!isImageSearchActive)}
                            className="cursor-pointer rounded-xl p-1.5"
                            style={{
                                background: isImageSearchActive ? "black" : "",
                                color: isImageSearchActive ? "white" : "",
                            }}
                        />
                    </div>
                    <Button type="submit" className="absolute right-2 rounded-full">
                        Search
                    </Button>
                </div>
            </form>

            {isImageSearchActive && (
                <div className="mt-4">
                    <form onSubmit={handleImageSearch} className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
                            {imagePreview ? (
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={imagePreview}
                                        alt="Car preview"
                                        className="object-contain mb-4 rounded-xl"
                                        width={300}
                                        height={160}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchImage(null);
                                            setImagePreview("");
                                            toast.info("Image removed");
                                        }}
                                    >
                                        Remove Image
                                    </Button>
                                </div>
                            ) : (
                                <div {...getRootProps()} className="cursor-pointer">
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center">
                                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                                        <p className="text-gray-500 mb-2">
                                            {isDragActive && !isDragReject
                                                ? "Leave the file here to upload"
                                                : "Drag & drop a car image or click to select"}
                                        </p>
                                        {isDragReject && (
                                            <p className="text-red-500 mb-2">Invalid image type</p>
                                        )}
                                        <p className="text-gray-400 text-sm">
                                            Supports: JPG, PNG (max 5MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {imagePreview && (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isUploading}
                            >
                                {isUploading
                                    ? "Uploading..."
                                    : "Search with this Image"}
                            </Button>

                        )}
                    </form>
                </div>
            )}
        </div>
    )
}

export default HomeSearch