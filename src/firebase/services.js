import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Thêm document vào collection, loại bỏ các trường undefined, thêm timestamp
export const addDocument = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName);

    // Loại bỏ các trường có giá trị undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(colRef, {
      ...cleanData,
      createdAt: serverTimestamp(), // Thời gian tạo document
    });

    return docRef;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// Tạo keywords tìm kiếm từ displayName để dùng filter, search nhanh
export const generateKeywords = (displayName) => {
  // Tách tên thành từng từ
  const name = displayName.split(' ').filter((word) => word);
  const length = name.length;

  let flagArray = new Array(length).fill(false);
  let result = [];
  let stringArray = [];

  // Tạo chuỗi con dạng prefix từ tên
  const createKeywords = (name) => {
    const arrName = [];
    let curName = '';
    name.split('').forEach((letter) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  // Tìm hoán vị các từ trong tên, lưu thành chuỗi cách nhau bởi space
  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(' '));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  // Tạo mảng keywords dạng prefix cho tất cả các hoán vị
  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};
