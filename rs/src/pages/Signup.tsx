/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function SignupLoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login with:', email, password);
            // Add your login logic here
        } else {
            console.log('Signup with:', name, email, password);
            // Add your signup logic here
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#D7E2EA] mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-[#D7E2EA]/60">
                        {isLogin ? 'Login to your account' : 'Sign up to get started'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 text-[#D7E2EA] placeholder:text-[#D7E2EA]/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 text-[#D7E2EA] placeholder:text-[#D7E2EA]/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 text-[#D7E2EA] placeholder:text-[#D7E2EA]/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-[#D7E2EA] text-[#0C0C0C] font-semibold hover:opacity-90 transition-opacity"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#D7E2EA]/70 hover:text-[#D7E2EA] transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-[#D7E2EA]/50 hover:text-[#D7E2EA] text-sm transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}