export const saveFileState = (fileState) => {
  sessionStorage.setItem('uploadFileState', JSON.stringify({
    
  }));
};

export const getFileState = () => {
  const state = sessionStorage.getItem('uploadFileState');
  return state ? JSON.parse(state) : null;
};

export const clearFileState = () => {
  sessionStorage.removeItem('uploadFileState');
};