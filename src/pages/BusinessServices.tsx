import { useNavigate } from 'react-router-dom'

export default function BusinessServices() {
  const navigate = useNavigate()

  const services = [
    {
      id: 1,
      name: 'Executive Meeting Rooms',
      description: 'Premium boardrooms with state-of-the-art technology and catering',
      price: 500,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      features: ['4K Video Conferencing', 'Premium Catering', 'Executive Assistant'],
      hasForm: true,
      route: '/executive-meeting-rooms'
    },
    {
      id: 2,
      name: 'Corporate Event Planning',
      description: 'Full-service corporate event management',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
      features: ['Event Coordination', 'Venue Management', 'VIP Services'],
      hasForm: true,
      route: '/corporate-event'
    },
    {
      id: 3,
      name: 'Business Travel Concierge',
      description: 'Complete travel arrangements for executives and teams',
      price: 800,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      features: ['Flight Booking', 'Hotel Reservations', '24/7 Support'],
      hasForm: true,
      route: '/business-travel-concierge'
    },
    {
      id: 4,
      name: 'Legal & Consulting Services',
      description: 'Professional legal and business consulting',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      features: ['Legal Consultation', 'Contract Review', 'Business Strategy']
    },
    {
      id: 5,
      name: 'Executive Transportation',
      description: 'Luxury chauffeur services for business executives',
      price: 300,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      features: ['Professional Chauffeur', 'Luxury Vehicles', 'Airport Transfers']
    },
    {
      id: 6,
      name: 'Corporate Hospitality',
      description: 'Premium hospitality services for business clients',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      features: ['Client Entertainment', 'Fine Dining', 'Exclusive Venues']
    }
  ]

  const handleBookService = (service: any) => {
    console.log('Clicked service:', service.name, 'Route:', service.route)
    if (service.hasForm && service.route) {
      navigate(service.route)
    } else {
      localStorage.setItem('memberCheckout', JSON.stringify({
        type: 'business',
        business: service
      }))
      navigate('/member-checkout')
    }
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      minHeight: '100vh',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8, #1e40af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
          }}>
            💼 Business & Professional Services
          </h1>
          <p style={{ fontSize: '20px', color: '#cccccc' }}>
            Executive-level business solutions for discerning professionals
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '30px' 
        }}>
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                background: 'rgba(0,0,0,0.7)',
                borderRadius: '20px',
                padding: '25px',
                border: '2px solid #3b82f6',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <img
                src={service.image}
                alt={service.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  marginBottom: '20px'
                }}
              />
              
              <h3 style={{ 
                fontSize: '24px', 
                color: '#3b82f6', 
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {service.name}
              </h3>
              
              <p style={{ 
                color: '#cccccc', 
                marginBottom: '15px',
                fontSize: '16px'
              }}>
                {service.description}
              </p>

              <div style={{ marginBottom: '20px', flex: '1' }}>
                {service.features.map((feature, index) => (
                  <div key={index} style={{ 
                    color: '#93c5fd', 
                    fontSize: '14px',
                    marginBottom: '5px'
                  }}>
                    • {feature}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    color: '#3b82f6'
                  }}>
                    ${service.price}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Button clicked for:', service.name)
                    if (service.id === 1) {
                      navigate('/executive-meeting-rooms')
                    } else if (service.id === 2) {
                      navigate('/corporate-event')
                    } else if (service.id === 3) {
                      navigate('/business-travel-concierge')
                    } else {
                      localStorage.setItem('memberCheckout', JSON.stringify({
                        type: 'business',
                        business: service
                      }))
                      navigate('/member-checkout')
                    }
                  }}
                  style={{
                    background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '12px 25px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button 
            onClick={() => navigate('/member-dashboard')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '15px 30px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            ← Back to Member Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}