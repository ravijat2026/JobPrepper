"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

type ContentType = {
    content? : string;
};

const CoverLetterPreview = ({ content } : ContentType) => {
  return (
    <div className="py-4 m-2">
      <MDEditor value={content} preview="preview" height={700} />
    </div>
  );
};

export default CoverLetterPreview;