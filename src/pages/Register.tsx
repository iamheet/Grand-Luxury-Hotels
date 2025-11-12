import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)

		if (!name || !email || !password || !confirmPassword) {
			setError('Please fill in all fields.')
			return
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email.trim())) {
			setError('Please enter a valid email address.')
			return
		}

		// Password validation
		if (password.length < 8) {
			setError('Password must be at least 8 characters long.')
			return
		}

		if (password.includes(' ')) {
			setError('Password cannot contain spaces.')
			return
		}

		// Check if password contains only letters and numbers
		const alphanumericRegex = /^[a-zA-Z0-9]+$/
		if (!alphanumericRegex.test(password)) {
			setError('Password must contain only letters and numbers (no special characters).')
			return
		}

		// Ensure password has both letters and numbers
		const hasLetter = /[a-zA-Z]/.test(password)
		const hasNumber = /[0-9]/.test(password)
		if (!hasLetter || !hasNumber) {
			setError('Password must contain both letters and numbers.')
			return
		}

		// Confirm password validation
		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		// Check existing users in localStorage
		const users = JSON.parse(localStorage.getItem('users') || '[]')
		const normalizedEmail = email.trim().toLowerCase()
		
		if (users.some((user: any) => user.email.toLowerCase() === normalizedEmail)) {
			setError('This email is already registered.')
			return
		}

		// Add new user to users array
		const newUser = { 
			id: Date.now(),
			name: name.trim(), 
			email: normalizedEmail, 
			password 
		}
		
		users.push(newUser)
		localStorage.setItem('users', JSON.stringify(users))
		
		// Set current user
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
							{error && (
								<div className="space-y-2">
									<p className="text-sm text-red-600">{error}</p>
									{error.includes('already registered') && (
										<Link 
											to="/login" 
											className="block w-full text-center bg-[var(--color-brand-navy)] text-white font-medium rounded-lg py-2 hover:bg-opacity-90 transition shadow-md"
										>
											Go to Login
										</Link>
									)}
								</div>
							)}
							<button
								type="submit"
								className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-medium rounded-lg py-2 hover:brightness-95 transition shadow-md"
							>
								Register
							</button>
						</form>

						<p className="mt-4 text-sm text-center text-gray-600">
							Already have an account?{' '}
							<Link to="/login" className="text-[var(--color-brand-gold)] hover:underline">
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}


