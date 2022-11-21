import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";

export default function useUploadImage(setValue, getValues, image_name = null , callback=null ,uploadDatabase = null) {
  const [progress, setprogress] = useState(0);
  const [image, setimage] = useState("");
  if (!setValue || !getValues) return;
  const handleDeleteImage = () => {
    const storage = getStorage();
    // Create a reference to the file to delete
    const desertRef = ref(
      storage,
      "images/" + (image_name || getValues("image_name")?.name)
    );
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        toast.success("Xoa image thanh cong");
        setprogress(0);
        setimage("");
        callback && callback();
      })
      .catch((error) => {
        toast.success("Xoa image khong thanh cong");
      });
  };
  const selectValueImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image_name", file.name);
    handleFileOnchane(file);
  };
  const handleFileOnchane = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progressPercen =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setprogress(progressPercen);
        console.log("Upload is " + progressPercen + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        toast.error("upload hinh anh khong thanh cong");
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimage(downloadURL);
          uploadDatabase && uploadDatabase(downloadURL);
        });
      }
    );
  };
  const handlereset = () => {
    setimage("");
    setprogress(0);
  };
  return {
    progress,
    image,
    setimage,
    handlereset,
    selectValueImage,
    handleDeleteImage,
  };
}
