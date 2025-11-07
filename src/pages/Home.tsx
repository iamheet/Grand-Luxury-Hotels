import BookingForm from '../components/BookingForm'
import FeaturedDestinations from '../components/FeaturedDestinations'
import ImageWithFallback from '../components/ImageWithFallback'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[100vh] md:h-[100vh] w-full overflow-hidden"
      >
        <ImageWithFallback
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/439398432.jpg?k=88ec7552eb86f90272d04afc7fdc64b672eb9f1c630a9dbe53453efddd7cce6c&o="
          alt="Grand luxury hotel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-end md:items-center justify-center text-center px-6 pb-10 md:pb-0">
          <div className="w-full max-w-6xl">
            <div className="text-white">
              <h1 className="font-display text-5xl md:text-7xl leading-tight">Unique Experience</h1>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="block h-[1px] w-12 bg-white/70" />
                <p className="uppercase tracking-[0.25em] text-sm text-white/90">Enjoy with us</p>
                <span className="block h-[1px] w-12 bg-white/70" />
              </div>
            </div>
            <div className="mt-6 md:mt-10">
              <BookingForm variant="bar" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Featured Destinations</h2>
            <a className="text-[var(--color-brand-navy)] hover:text-[var(--color-brand-gold)] text-sm" href="#">View all</a>
          </div>
          <div className="mt-8">
            <FeaturedDestinations />
          </div>
        </div>
      </section>

      {/* Amenities / Value Proposition */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard title="Best Price Guarantee" icon="💎" desc="Exclusive rates and member-only offers." />
            <ValueCard title="24/7 Concierge" icon="🛎️" desc="Round-the-clock assistance for your stay." />
            <ValueCard title="Curated Collection" icon="🏨" desc="Handpicked hotels meeting our luxury standards." />
          </div>
        </div>
      </section>
    </div>
  )
}

function ValueCard({ title, icon, desc }: { title: string; icon: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-gray-600 text-sm">{desc}</div>
    </div>
  )
}


