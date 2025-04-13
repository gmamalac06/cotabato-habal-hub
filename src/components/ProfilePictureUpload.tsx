
import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  name: string;
  onUpload: (imageUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

export default function ProfilePictureUpload({ 
  currentAvatar, 
  name, 
  onUpload,
  size = "md" 
}: ProfilePictureUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-20 w-20",
    lg: "h-32 w-32"
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // In a real app, upload to cloud storage
    // For this demo, we'll create a local URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully",
        });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          {currentAvatar ? (
            <AvatarImage src={currentAvatar} alt={name} />
          ) : (
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          )}
        </Avatar>
        <label 
          htmlFor="profile-upload" 
          className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
          <input 
            type="file" 
            id="profile-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      <label htmlFor="profile-upload" className="cursor-pointer">
        <Button variant="outline" size="sm" className="text-xs gap-1" disabled={isUploading}>
          <Upload className="h-3 w-3" />
          {isUploading ? "Uploading..." : "Change Picture"}
        </Button>
      </label>
    </div>
  );
}
