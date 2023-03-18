import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGEKEL9hOXrKJbTbW2CZ4j4xuERWjWdjM",
  authDomain: "todo-project-6cd99.firebaseapp.com",
  projectId: "todo-project-6cd99",
  storageBucket: "todo-project-6cd99.appspot.com",
  messagingSenderId: "1018456167375",
  appId: "1:1018456167375:web:b1663c5d2be2950716b8ba",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const dataDocRef = doc(db, "waldoInfo", "WUu96CPVkblEdShgzgDz");
export const getURL = async (imgLoc) => {
  const url = await getDownloadURL(ref(storage, imgLoc));
  return url;
};
export const getTopDocs = async (leaderboard) => {
  const data = await getDocs(
    query(collection(db, leaderboard), orderBy("seconds"), limit(5))
  );
  return data;
};

//Function to upload coord data to db
// export const uploadData = async () => {
//   await updateDoc(dataDocRef, {
//     coords: {
//       cityCoords: {
//         waldoMinX: 41.8,
//         waldoMaxX: 44.8,
//         waldoMinY: 45,
//         waldoMaxY: 50,
//         whitebeardMinX: 65,
//         whitebeardMaxX: 67.5,
//         whitebeardMinY: 47.2,
//         whitebeardMaxY: 49,
//         odlawMinX: 57.6,
//         odlawMaxX: 59.6,
//         odlawMinY: 58.4,
//         odlawMaxY: 60.8,
//       },
//       deptCoords: {
//         waldoMinX: 40.9,
//         waldoMaxX: 43.2,
//         waldoMinY: 10.35,
//         waldoMaxY: 13.5,
//         whitebeardMinX: 68.05,
//         whitebeardMaxX: 69.65,
//         whitebeardMinY: 2.05,
//         whitebeardMaxY: 4,
//         odlawMinX: 18.95,
//         odlawMaxX: 20.35,
//         odlawMinY: 44.75,
//         odlawMaxY: 48.05,
//       },
//       muskCoords: {
//         waldoMinX: 52.17,
//         waldoMaxX: 53.15,
//         waldoMinY: 49.75,
//         waldoMaxY: 51.2,
//         whitebeardMinX: 93.25,
//         whitebeardMaxX: 94.79,
//         whitebeardMinY: 17.95,
//         whitebeardMaxY: 20.2,
//         odlawMinX: 14.7,
//         odlawMaxX: 15.5,
//         odlawMinY: 22.41,
//         odlawMaxY: 23.95,
//       },
//       snowCoords: {
//         waldoMinX: 83.6,
//         waldoMaxX: 87.5,
//         waldoMinY: 44.8,
//         waldoMaxY: 49.2,
//         whitebeardMinX: 6.0,
//         whitebeardMaxX: 9,
//         whitebeardMinY: 46.75,
//         whitebeardMaxY: 49.5,
//         odlawMinX: 31,
//         odlawMaxX: 32.5,
//         odlawMinY: 39.45,
//         odlawMaxY: 41.5,
//       },
//     },
//   });
// };
