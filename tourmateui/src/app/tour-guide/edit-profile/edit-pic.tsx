
import React, { useState } from 'react'
import { ImageUpload } from './image-upload'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";


interface Props {
    onConfirm: (imageUrl: string) => void,
    isOpen: boolean,
    onClose: () => void,
    type: string
}

function EditPic({ onConfirm, isOpen, onClose, type }: Props) {
    const [pic, setPic] = useState('')
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const storageRef = ref(storage, `customers/profile-images/${Date.now()}-${file.name}`)
            const snapshot = await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(snapshot.ref)
            setPic(downloadURL)
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Tải ảnh lên thất bại. Vui lòng thử lại.")
        }
    }
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
        >
            <div
                className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"}`}
                onClick={onClose}
            ></div>

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[900px] overflow-y-auto">
                <div className="relative justify-between items-center">
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <h3 className='text-center font-bold text-2xl mb-5'>Cập nhật {type === 'Image' ? 'ảnh đại diện' : 'ảnh bìa'}</h3>
                <ImageUpload
                    onImageUpload={handleImageUpload}
                    label='Tải ảnh lên'
                    imageUrl={pic}
                />
                <div className="flex justify-center mt-5">
                    <button
                        onClick={() => {
                            onConfirm(pic)
                            onClose()
                        }}
                        type="submit"
                        disabled={pic.length === 0}
                        className="text-white inline-flex items-center bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-700 disabled:hover:bg-gray-600"
                    >
                        Đổi ảnh đại diện
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditPic
