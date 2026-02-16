"use client";

import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import BasicLayout from "@/components/layout/basic_layout";
import axios from "axios";
import { useRouter } from "next/router";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ProfilePicture() {

    const router = useRouter();
    const { id, tipe } = router.query;
    const editorRef = useRef(null);

    const [image, setImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!editorRef.current) return;

        const canvas = editorRef.current.getImageScaledToCanvas();

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('foto', blob, 'profile.png');

            try {
                const result = await axios.patch(
                    `${BASE_URL}penguji/profile_picture/${id}`, // make sure ID exists
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if(tipe === 'penguji'){
                    alert('Profile picture updated successfully!');
                    const foto = result.data.foto;
                    const updatedAdmin = JSON.parse(localStorage.getItem('penguji'));
                    const updated = {
                        ...updatedAdmin,
                        foto: foto,
                    }
    
                    localStorage.setItem('penguji', JSON.stringify(updated));
                    router.push('/penguji/edit_profile');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to update profile picture.');
            }
        }, 'image/png');
    };


    useEffect(() => {
    }, [id, tipe])

    return (
        <BasicLayout>
            <div className="bg-navy p-6 space-y-4 uppercase text-white rounded-md flex flex-col items-center">
                <h1 className="text-xl font-semibold">Profile Picture {tipe}</h1>

                {/* Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                {/* Avatar Editor */}
                {image && (
                    <AvatarEditor
                        ref={editorRef}
                        image={image}
                        width={250}
                        height={250}
                        border={50}
                        borderRadius={125}
                        color={[0, 0, 0, 0.6]} // RGBA
                        scale={scale}
                        rotate={rotate}
                    />
                )}

                {/* Controls */}
                {image && (
                    <div className="space-y-2 w-full">
                        <div className="flex justify-end">
                            <label>Zoom</label>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.01"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="flex justify-end">
                            <label>Rotate</label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                step="1"
                                value={rotate}
                                onChange={(e) => setRotate(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </BasicLayout>
    );
}
