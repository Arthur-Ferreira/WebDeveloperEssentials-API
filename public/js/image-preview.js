const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');


function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.computedStyleMap.display = 'none';
    return;
  }
  
  const pickedFile = files[0];
  
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.computedStyleMap.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);