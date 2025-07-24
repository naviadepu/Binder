"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

const SignUpPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Store additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                firstName,
                lastName,
                email,
                createdAt: new Date().toISOString()
            });

            console.log('Account created and data stored');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 border border-white/20 text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                    <p className="text-sm text-purple-100">Join us to manage your learning journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-md border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-1/2 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-1/2 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center text-sm text-white/80 mt-4">
                    Already have an account?{' '}
                    <a href="/signin" className="text-white font-medium underline hover:text-purple-200 transition duration-150">
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
