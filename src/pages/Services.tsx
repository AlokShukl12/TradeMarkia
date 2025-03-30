import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'Trademark Registration',
      description: 'Our comprehensive trademark registration service includes thorough search, application preparation, and filing with the appropriate authorities. We ensure your brand is properly protected.',
      features: [
        'Trademark availability search',
        'Application preparation and filing',
        'Office action responses',
        'Registration maintenance',
      ],
      icon: '📝',
    },
    {
      title: 'Trademark Search',
      description: 'Before filing your trademark application, we conduct a thorough search to identify potential conflicts and ensure your mark is available for registration.',
      features: [
        'Comprehensive database search',
        'Similar mark analysis',
        'Risk assessment report',
        'Recommendations for modifications',
      ],
      icon: '🔍',
    },
    {
      title: 'IP Protection Strategy',
      description: 'We develop comprehensive intellectual property protection strategies tailored to your business needs, including trademark, copyright, and patent considerations.',
      features: [
        'IP portfolio analysis',
        'Protection strategy development',
        'Enforcement planning',
        'International IP considerations',
      ],
      icon: '🛡️',
    },
    {
      title: 'Legal Consultation',
      description: 'Our experienced IP attorneys provide expert legal advice on all aspects of intellectual property law and protection.',
      features: [
        'One-on-one consultation',
        'Legal document review',
        'Infringement analysis',
        'Licensing guidance',
      ],
      icon: '⚖️',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Comprehensive intellectual property solutions to protect and grow your business
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-700">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your intellectual property needs and get expert guidance.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors">
            Schedule a Consultation
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Services; 