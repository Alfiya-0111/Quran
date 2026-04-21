import { useState, useEffect } from 'react';
import { db, auth, loginAnonymous, onAuthStateChanged, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from '../firebase';

export function useFirebaseUser() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Anonymous login
        const cred = await loginAnonymous();
        setUserId(cred.user.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save bookmarks
  const saveBookmarks = async (bookmarks) => {
    if (!userId) return;
    await setDoc(doc(db, 'users', userId), { bookmarks }, { merge: true });
  };

  // Load bookmarks
  const loadBookmarks = async () => {
    if (!userId) return [];
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data().bookmarks || [] : [];
  };

  // Save vocabulary words
  const saveVocab = async (words) => {
    if (!userId) return;
    await setDoc(doc(db, 'users', userId), { savedWords: words }, { merge: true });
  };

  // Load vocabulary
  const loadVocab = async () => {
    if (!userId) return [];
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data().savedWords || [] : [];
  };

  // Add single bookmark
  const addBookmark = async (bookmark) => {
    if (!userId) return;
    await updateDoc(doc(db, 'users', userId), {
      bookmarks: arrayUnion(bookmark)
    });
  };

  // Remove single bookmark
  const removeBookmark = async (bookmark) => {
    if (!userId) return;
    await updateDoc(doc(db, 'users', userId), {
      bookmarks: arrayRemove(bookmark)
    });
  };

  return {
    userId,
    loading,
    saveBookmarks,
    loadBookmarks,
    saveVocab,
    loadVocab,
    addBookmark,
    removeBookmark,
  };
}