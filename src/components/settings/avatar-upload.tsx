"use client";

import { Camera, Trash2 } from "lucide-react";
import { ChangeEvent, useRef } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  name: string;
  image?: string;
  onChange: (image: string | undefined) => void;
}

export function AvatarUpload({
  name,
  image,
  onChange,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelectFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    onChange(preview);
  }

  return (
    <div className="flex flex-col items-center gap-5 border-b border-border pb-8 md:flex-row">

      <Avatar
        name={name}
        src={image}
        size="lg"
      />

      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-card-foreground">
          {name}
        </h2>

        <p className="mt-1 text-muted-foreground">
          Upload a profile picture.
        </p>
      </div>

      <div className="flex gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={handleSelectFile}
        >
          <Camera size={16} />

          Upload
        </Button>

        {image && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => onChange(undefined)}
          >
            <Trash2 size={16} />

            Remove
          </Button>
        )}

      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

    </div>
  );
}