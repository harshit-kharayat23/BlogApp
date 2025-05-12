const supportedFile = (file) => {
    const supportedTypes = ["jpg", "png", "jpeg"];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return supportedTypes.includes(fileExtension);
};
const supportedVideoFile=(file)=>{
    const supportedTypes=["mp4","mov"];
    const fileExtension=file.name.split(".").pop().toLowerCase();
     return supportedTypes.includes(fileExtension);
}


module.exports = {
    supportedFile,
    supportedVideoFile
};
