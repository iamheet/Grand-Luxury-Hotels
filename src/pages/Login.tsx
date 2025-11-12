import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const existing = localStorage.getItem('user')
		if (existing) {
			navigate('/')
		}
	}, [navigate])

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)

		if (!email || !password) {
			setError('Please enter both email and password.')
			return
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email.trim())) {
			setError('Please enter a valid email address.')
			return
		}

		try {
			// Get all registered users
			const users = JSON.parse(localStorage.getItem('users') || '[]')
			const inputEmail = email.trim().toLowerCase()
			
			// Find user with matching email
			const user = users.find((u: any) => u.email.toLowerCase() === inputEmail)
			
			if (!user) {
				setError('User not found. Please register first.')
				return
			}

			// Check password
			if (user.password === password) {
				// Set current user and redirect
				localStorage.setItem('user', JSON.stringify(user))
				navigate('/')
			} else {
				setError('Invalid password.')
			}
		} catch (err) {
			setError('Something went wrong. Please try again.')
			console.error('Login error:', err)
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
						<h2 className="text-xl font-semibold text-center mb-4 text-[var(--color-brand-navy)]">Member Login</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
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
								className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-medium rounded-lg py-2 hover:brightness-95 transition shadow-md"
							>
								Login
							</button>
						</form>
						<p className="mt-4 text-sm text-center text-gray-600">
							Don't have an account?{' '}
							<Link to="/register" className="text-[var(--color-brand-gold)] hover:underline">Register</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}