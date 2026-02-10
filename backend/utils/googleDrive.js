const convertGoogleDriveLink = (shareUrl) => {
  if (!shareUrl) return null;
  
  const fileIdMatch = shareUrl.match(/[-\w]{25,}/);
  
  if (fileIdMatch) {
    const fileId = fileIdMatch[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  return shareUrl;
};

module.exports = { convertGoogleDriveLink };
