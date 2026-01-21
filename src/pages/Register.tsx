import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import RegistrationOTPVerification from '../components/RegistrationOTPVerification'

export default function Register() {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showOTPVerification, setShowOTPVerification] = useState(false)
	const [formSubmitted, setFormSubmitted] = useState(false)
	const [showExistingAccountPopup, setShowExistingAccountPopup] = useState(false)
	const [emailCheckLoading, setEmailCheckLoading] = useState(false)

	// Real-time email check on every keystroke
	useEffect(() => {
		if (!email || email.length < 5) {
			setShowExistingAccountPopup(false)
			return
		}
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email.trim())) {
			setShowExistingAccountPopup(false)
			return
		}
		
		// Hit API immediately on every keystroke
		const checkEmail = async () => {
			setEmailCheckLoading(true)
			try {
				const exists = await checkUserExists(email)
				if (exists) {
					setShowExistingAccountPopup(true)
				} else {
					setShowExistingAccountPopup(false)
				}
			} catch (error) {
				console.error('Email check failed:', error)
				setShowExistingAccountPopup(false)
			} finally {
				setEmailCheckLoading(false)
			}
		}
		
		checkEmail()
	}, [email])

	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider)
			const user = result.user
			
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

	const handleExistingUser = async () => {
		try {
			const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
				email: email.trim().toLowerCase(),
				password
			})
			
			if (loginResponse.data.user) {
				localStorage.setItem('user', JSON.stringify(loginResponse.data.user))
				localStorage.setItem('token', loginResponse.data.token)
				navigate('/')
				return true
			}
		} catch (error) {
			console.error('Login failed:', error)
		}
		return false
	}

	const checkUserExists = async (email: string) => {
		try {
			const response = await axios.post('http://localhost:5000/api/auth/check-user', {
				email: email.trim().toLowerCase()
			}, {
				headers: {
					'Cache-Control': 'no-cache'
				}
			})
			return response.data.exists
		} catch (error) {
			console.error('Email check error:', error)
			return false
		}
	}

	const registerUser = async (emailVerified: boolean, phoneVerified: boolean) => {
		try {
			const response = await axios.post('http://localhost:5000/api/auth/register', {
				name: name.trim(),
				email: email.trim().toLowerCase(),
				password,
				phone: phone.trim(),
				emailVerified,
				phoneVerified
			})

			if (response.data.success) {
				localStorage.setItem('token', response.data.token)
				localStorage.setItem('user', JSON.stringify(response.data.user))
				navigate('/')
			}
		} catch (error: any) {
			console.error('Registration error:', error)
			setError(error.response?.data?.message || 'Registration failed. Please try again.')
			setShowOTPVerification(false)
			setFormSubmitted(false)
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)

		if (!name || !email || !password || !confirmPassword || !phone) {
			setError('Please fill in all fields including phone number.')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email.trim())) {
			setError('Please enter a valid email address.')
			return
		}

		if (phone.length < 10) {
			setError('Please enter a valid phone number.')
			return
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters long.')
			return
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		// Check if user already exists
		const exists = await checkUserExists(email)
		if (exists) {
			setError('Account already exists with this email. Please use the login page instead.')
			return
		}

		// Show OTP verification for new users
		setFormSubmitted(true)
		setShowOTPVerification(true)
	}

	return (
		<section className="relative min-h-screen flex items-center justify-center px-6 py-16">
			<div
				className="absolute inset-0 -z-10 bg-center bg-cover"
				style={{ backgroundImage: "url('https://cf.bstatic.com/xdata/images/hotel/max1024x768/420225480.jpg?k=76b94b8fc9af3f8128966b4ad32c0254164a90d507f165ebb3f11184133c9def&o=')" }}
			/>
			<div className="absolute inset-0 -z-10 bg-black/50" />

			<div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
				<div className="text-center lg:text-left text-white/90 space-y-4">
					<div className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs tracking-wider uppercase">Exclusive Membership</div>
					<h1 className="text-3xl md:text-4xl font-semibold">
						Join <span className="text-[var(--color-brand-gold)]">The Grand Stay</span>
					</h1>
					<div className="text-white/90 max-w-lg mx-auto lg:mx-0 flex flex-wrap items-center gap-2">
						<span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">Member‑only rates</span>
						<span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">Flexible cancellation</span>
						<span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">VIP welcome</span>
					</div>
				</div>

				<div className="w-full max-w-md mx-auto lg:ml-auto">
					<div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-7">
						<h2 className="text-xl font-semibold text-center mb-4 text-[var(--color-brand-navy)]">
							Create your account
						</h2>

						<div className="space-y-3 mb-4">
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

						<div className="relative mb-4">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white/90 text-gray-500">Or continue with email</span>
							</div>
						</div>

						{error && (
							<div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
								<input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
									placeholder="John Doe"
									autoComplete="off"
								/>
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
								<div className="relative">
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value)
											setShowExistingAccountPopup(false)
										}}
										className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
										placeholder="you@example.com"
										autoComplete="off"
									/>
									{emailCheckLoading && (
										<div className="absolute inset-y-0 right-0 flex items-center pr-3">
											<div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--color-brand-gold)] rounded-full animate-spin"></div>
										</div>
									)}
								</div>
							</div>
							<div>
								<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
								<input
									id="phone"
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
									placeholder="Enter your phone number"
									autoComplete="tel"
									required
								/>
								<div className="text-xs text-gray-500 mt-1">
									Required for account verification
								</div>
							</div>
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
								<div className="text-xs text-gray-500 mt-1">
									Minimum 8 characters
								</div>
							</div>
							{confirmPassword && (
								<div className="text-xs mb-2 text-right">
									{password === confirmPassword ? (
										<span className="text-green-600 font-medium">✓ Matched</span>
									) : (
										<span className="text-red-600 font-medium">✗ Not matched</span>
									)}
								</div>
							)}
							<div>
								<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
								<div className="relative">
									<input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
										placeholder="••••••••"
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
									>
										{showConfirmPassword ? (
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
							</div>
							<button
								type="submit"
								className="w-full rounded-lg bg-[var(--color-brand-gold)] px-4 py-2.5 font-semibold text-white hover:bg-[var(--color-brand-gold)]/90 transition-colors"
							>
								{formSubmitted ? 'Verify Account' : 'Verify & Create Account'}
							</button>
						</form>

						<p className="mt-4 text-center text-sm text-gray-600">
							Already have an account?{' '}
							<Link to="/login" className="font-medium text-[var(--color-brand-gold)] hover:underline">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>

			{showOTPVerification && (
				<RegistrationOTPVerification
					email={email}
					phone={phone}
					onVerified={(emailVerified, phoneVerified) => {
						setShowOTPVerification(false)
						registerUser(emailVerified, phoneVerified)
					}}
					onCancel={() => {
						setShowOTPVerification(false)
						setFormSubmitted(false)
					}}
					requirePhoneVerification={true}
				/>
			)}

			{/* Existing Account Popup */}
			{showExistingAccountPopup && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
						<div className="text-center">
							<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
								</svg>
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">Account Already Exists! 🎉</h3>
							<p className="text-gray-600 mb-6">Great news! You already have an account with <strong>{email}</strong>. Please sign in to continue your luxury experience.</p>
							<div className="flex gap-3">
								<button
									onClick={() => navigate('/login')}
									className="flex-1 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-4 py-2.5 rounded-lg font-semibold hover:brightness-95 transition-all"
								>
									Sign In
								</button>
								<button
									onClick={() => setShowExistingAccountPopup(false)}
									className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Continue Here
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}
