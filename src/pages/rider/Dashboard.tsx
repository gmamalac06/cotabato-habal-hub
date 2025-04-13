
const handleProfilePictureUpload = async (imageUrl: string) => {
  if (user) {
    // Save the avatar URL to Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: imageUrl }) // Use the new avatar_url column
      .eq('id', user.id);
    
    if (error) {
      toast({
        title: "Error updating profile picture",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    updateUserProfile({ 
      ...user, 
      avatar: imageUrl // Keep this for backward compatibility
    });
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been updated successfully",
    });
  }
};
