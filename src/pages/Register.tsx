import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Register() {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider)
			const user = result.user
			const newUser = {
				id: Date.now(),
				name: user.displayName || '',
				email: user.email || '',
				provider: 'google'
			}
			localStorage.setItem('user', JSON.stringify(newUser))
			navigate('/')
		} catch (error: any) {
			setError(error.message || 'Google sign-in failed')
		}
	}

	const handleAppleSignIn = () => {
		setError('Apple Sign-In coming soon!')
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)

		if (!name || !email || !password || !confirmPassword) {
			setError('Please fill in all fields.')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email.trim())) {
			setError('Please enter a valid email address.')
			return
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters long.')
			return
		}

		if (password.includes(' ')) {
			setError('Password cannot contain spaces.')
			return
		}

		const alphanumericRegex = /^[a-zA-Z0-9]+$/
		if (!alphanumericRegex.test(password)) {
			setError('Password must contain only letters and numbers (no special characters).')
			return
		}

		const hasLetter = /[a-zA-Z]/.test(password)
		const hasNumber = /[0-9]/.test(password)
		if (!hasLetter || !hasNumber) {
			setError('Password must contain both letters and numbers.')
			return
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		const users = JSON.parse(localStorage.getItem('users') || '[]')
		const normalizedEmail = email.trim().toLowerCase()
		
		if (users.some((user: any) => user.email.toLowerCase() === normalizedEmail)) {
			setError('This email is already registered.')
			return
		}

		const newUser = { 
			id: Date.now(),
			name: name.trim(), 
			email: normalizedEmail, 
			password 
		}
		
		users.push(newUser)
		localStorage.setItem('users', JSON.stringify(users))
		localStorage.setItem('user', JSON.stringify(newUser))
		
		navigate('/')
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

							<button
								type="button"
								onClick={handleAppleSignIn}
								className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-black text-white px-4 py-2.5 font-medium hover:bg-gray-900 transition-colors"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
									<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
								</svg>
								Sign up with Apple
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
									Minimum 8 characters, letters and numbers only, no spaces
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
								Create Account
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
		</section>
	)
}
