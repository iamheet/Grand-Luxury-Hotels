import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import { checkExclusiveMembership } from '../utils/membershipCheck'

export default function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [membershipId, setMembershipId] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isExclusiveLogin, setIsExclusiveLogin] = useState(false)

	useEffect(() => {
		const existing = localStorage.getItem('user')
		if (existing) {
			navigate('/')
		}
	}, [navigate])

	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider)
			const user = result.user
			
			// Check if user is exclusive member
			const isExclusive = await checkExclusiveMembership(user.email || '')
			
			if (isExclusive) {
				// Automatically login as exclusive member
				const memberResponse = await axios.post('http://localhost:5000/api/auth/get-member-by-email', {
					email: user.email
				})
				
				if (memberResponse.data.member) {
					localStorage.setItem('member', JSON.stringify(memberResponse.data.member))
					localStorage.setItem('memberCheckout', JSON.stringify(memberResponse.data.member))
					localStorage.setItem('token', memberResponse.data.token)
					localStorage.setItem('isExclusiveMember', 'true')
					navigate('/member-dashboard')
					return
				}
			}
			
			// Sync user to backend database
			const response = await axios.post('http://localhost:5000/api/auth/sync-firebase-user', {
				firebaseUid: user.uid,
				email: user.email,
				name: user.displayName,
				phone: user.phoneNumber || ''
			})
			
			if (response.data.token) {
				localStorage.setItem('token', response.data.token)
				localStorage.setItem('user', JSON.stringify(response.data.user))
				navigate('/')
			}
		} catch (error: any) {
			console.error('Google sign-in error:', error)
			setError(error.response?.data?.message || error.message || 'Google sign-in failed')
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)

		if (isExclusiveLogin && (!membershipId || !password)) {
			setError('Please enter membership ID and password.')
			return
		}

		if (!isExclusiveLogin) {
			if (!email || !password) {
				setError('Please enter both email and password.')
				return
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(email.trim())) {
				setError('Please enter a valid email address.')
				return
			}

			// Check if user is exclusive member before proceeding with regular login
			const isExclusive = await checkExclusiveMembership(email)
			
			if (isExclusive) {
				setError('🌟 You are an exclusive member! Please use the "Exclusive Member" login tab above.')
				return
			}
		}

		try {
			const response = await axios.post('http://localhost:5000/api/auth/login', {
				...(isExclusiveLogin ? { membershipId, password, isExclusive: true } : { email, password }),
			}, {
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.data) {
				if (response.data.isExclusive && response.data.member) {
					localStorage.setItem('member', JSON.stringify(response.data.member));
					localStorage.setItem('memberCheckout', JSON.stringify(response.data.member));
					localStorage.setItem('token', response.data.token);
					localStorage.setItem('isExclusiveMember', 'true');
					navigate('/member-dashboard');
				} else if (response.data.user) {
					localStorage.setItem('user', JSON.stringify(response.data.user));
					localStorage.setItem('token', response.data.token);
					navigate('/');
				}
			}
		} catch (err: any) {
			setError(err.response?.data?.message || 'Login failed. Please try again.');
			console.error('Login error:', err);
		}
	}

	return (
		<section className="relative min-h-screen flex items-center justify-center px-6 py-16">
			<div
				className="absolute inset-0 -z-10 bg-center bg-cover"
				style={{ backgroundImage: "url('https://cf.bstatic.com/xdata/images/hotel/max1024x768/763590431.jpg?k=f87898a89d4364be4a52fdadf9c8775f801ac2cca5e74c536c21aea1bf61ee83&o=')" }}
			/>
			<div className="absolute inset-0 -z-10 bg-black/50" />

			<div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
				<div className="text-center lg:text-left text-white/90 space-y-4">
					<div className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs tracking-wider uppercase">Luxury Stays • Since 2025</div>
					<h1 className="text-3xl md:text-4xl font-semibold">
						Welcome to <span className="text-[var(--color-brand-gold)]">The Grand Stay</span>
					</h1>
					<div className="text-white/90 max-w-lg mx-auto lg:mx-0 flex flex-wrap items-center gap-2">
						<span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">Member‑only rates</span>
						<span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">Flexible cancellation</span>
						<span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">24/7 concierge</span>
					</div>
				</div>

				<div className="w-full max-w-md mx-auto lg:ml-auto">
					<div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-7">
						{/* Login Type Toggle */}
						<div className="flex bg-gray-100 rounded-lg p-1 mb-6">
							<button
								type="button"
								onClick={() => setIsExclusiveLogin(false)}
								className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isExclusiveLogin
									? 'bg-white text-[var(--color-brand-navy)] shadow-sm'
									: 'text-gray-600 hover:text-gray-800'
									}`}
							>
								Member Login
							</button>
							<button
								type="button"
								onClick={() => setIsExclusiveLogin(true)}
								className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isExclusiveLogin
									? 'bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] shadow-sm'
									: 'text-gray-600 hover:text-gray-800'
									}`}
							>
								✨ Exclusive Member
							</button>
						</div>
						<h2 className="text-xl font-semibold text-center mb-4 text-[var(--color-brand-navy)]">
							{isExclusiveLogin ? 'Exclusive Member Login' : 'Member Login'}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							{isExclusiveLogin && (
								<div>
									<label htmlFor="membershipId" className="block text-sm font-medium text-gray-700 mb-1">Membership ID</label>
									<input
										id="membershipId"
										type="text"
										value={membershipId}
										onChange={(e) => setMembershipId(e.target.value)}
										className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
										placeholder="Enter your membership ID"
										autoComplete="off"
									/>
								</div>
							)}
							{!isExclusiveLogin && (
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
										placeholder="you@example.com"
										autoComplete="off"
									/>
								</div>
							)}
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
										placeholder="••••••••"
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
											</svg>
										) : (
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
								{/* ADDED: Forgot Password link */}
								<div className="text-right mt-1">
									<Link to="/forgot-password" className="text-xs text-[var(--color-brand-gold)] hover:underline">
										Forgot Password?
									</Link>
								</div>
							</div>
							{error && (
								<p className="text-sm text-red-600">{error}</p>
							)}
							<button
								type="submit"
								className={`w-full font-medium rounded-lg py-2 hover:brightness-95 transition shadow-md ${isExclusiveLogin
									? 'bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)]'
									: 'bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]'
									}`}
							>
								{isExclusiveLogin ? 'Access Member Portal' : 'Login'}
							</button>
						</form>
						{isExclusiveLogin && (
							<p className="mt-4 text-xs text-center text-gray-500">
								Demo ID: GRAND2024
							</p>
						)}
						<p className="mt-4 text-sm text-center text-gray-600">
							{isExclusiveLogin ? (
								<>
									Not a member?{' '}
									<Link to="/membership" className="text-[var(--color-brand-gold)] hover:underline">Join our exclusive program</Link>
								</>
							) : (
								<>
									Don't have an account?{' '}
									<Link to="/register" className="text-[var(--color-brand-gold)] hover:underline">Register</Link>
								</>
							)}
						</p>

						<div className="relative my-4">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="px-2 bg-white/90 text-gray-500">Or</span>
							</div>
						</div>

						<button
							type="button"
							onClick={handleGoogleSignIn}
							className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium hover:bg-gray-50 transition-colors"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							Continue with Google
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}