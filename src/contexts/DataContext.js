import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const DataContext = createContext();
const STORAGE_KEY = 'portfolio-admin-data';
const PORTFOLIO_DOC = ['siteContent', 'portfolio'];

export const useData = () => useContext(DataContext);

function getFriendlyError(error) {
    if (error?.code === 'permission-denied') {
        return 'Firestore permission denied. Please update your Firestore rules for this signed-in user.';
    }

    if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/invalid-login-credentials') {
        return 'Invalid email or password.';
    }

    if (error?.code === 'auth/user-not-found') {
        return 'No account found for this email.';
    }

    if (error?.code === 'auth/wrong-password') {
        return 'Incorrect password.';
    }

    return error?.message || 'Something went wrong.';
}

const DEFAULT_DATA = {
    projects: [],
    technicalExplorations: [],
    skills: [],
    roles: [],
    headlines: [],
    links: {},
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setIsAuthenticated(Boolean(user));
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                setData(JSON.parse(storedData));
            }
        } catch (storageError) {
            console.error('Failed to read cached portfolio data:', storageError);
        }

        const [collectionName, documentId] = PORTFOLIO_DOC;
        const portfolioRef = doc(db, collectionName, documentId);

        const unsubscribe = onSnapshot(
            portfolioRef,
            (snapshot) => {
                const nextData = snapshot.exists() ? { ...DEFAULT_DATA, ...snapshot.data() } : DEFAULT_DATA;
                setData(nextData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
                setError(null);
                setLoading(false);
            },
            (firestoreError) => {
                console.error(firestoreError);
                setError(getFriendlyError(firestoreError));
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    const updateData = async (newData) => {
        const [collectionName, documentId] = PORTFOLIO_DOC;
        const portfolioRef = doc(db, collectionName, documentId);

        try {
            await setDoc(
                portfolioRef,
                {
                    ...DEFAULT_DATA,
                    ...newData,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setError(null);
            return { success: true };
        } catch (updateError) {
            console.error('FULL FIRESTORE ERROR:', updateError); // Detailed log
            const message = getFriendlyError(updateError);
            setError(message);
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError(null);
            return { success: true };
        } catch (authError) {
            const message = getFriendlyError(authError);
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        await signOut(auth);
        setIsAuthenticated(false);
    };

    return (
        <DataContext.Provider
            value={{ data, loading, error, updateData, isAuthenticated, login, logout, authUser }}
        >
            {children}
        </DataContext.Provider>
    );
};
