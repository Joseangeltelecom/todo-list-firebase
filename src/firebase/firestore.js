import {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

import { db } from "../firebase/firebase-config"

export const savePersonName = async (name) => {
  try {
    const response = await addDoc(collection(db, "people"), { name })
    return response
  } catch (error) {
    throw new Error(error)
  }
}

export const getPeople = async () => {
  const result = await getDocs(query(collection(db, "people")))
  return result
}

export const deletePersonName = async (id) => {
  await deleteDoc(doc(db, "people", id))
}

export const updatePerson = async (id, name) => {
  await updateDoc(doc(db, "people", id), { name: name })
}
