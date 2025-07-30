// src/components/UploadPOP.js
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function UploadPOP() {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    if (!file) return alert("Select a file");

    const path = `POP-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("proof-of-payments")
      .upload(path, file);

    if (error) {
      alert("Upload error");
      console.error(error);
    } else {
      const { publicUrl } = supabase.storage
        .from("proof-of-payments")
        .getPublicUrl(path).data;
      alert("Uploaded! POP URL:\n" + publicUrl);
    }
  };

  return (
    <div>
      <h3>📤 Upload Proof of Payment</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}
