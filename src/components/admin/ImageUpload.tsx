
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  label?: string;
}

const ImageUpload = ({ currentImage, onImageUploaded, onImageRemoved, label = "Imagen" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Error al subir la imagen');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      onImageUploaded(urlData.publicUrl);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (currentImage) {
      try {
        const fileName = currentImage.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('product-images')
            .remove([fileName]);
        }
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }
    onImageRemoved();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {currentImage ? (
        <div className="space-y-2">
          <div className="relative w-32 h-32 border rounded overflow-hidden">
            <img 
              src={currentImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              asChild
            >
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Subiendo...' : 'Subir Imagen'}
              </span>
            </Button>
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
