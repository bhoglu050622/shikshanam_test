'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone } from 'lucide-react'

const faqs = [
  {
    question: 'How do I sign up?',
    answer: 'To signup simply click on Login. A popup will appear. Click on signup. The next screen will prompt you to enter your details such as name, email and password, fill all the details and click next. Your account will be created. Alternatively, you can also use your google account to signup on our platform.'
  },
  {
    question: 'What is the validity of the course?',
    answer: 'All of our courses come with lifetime validity. You just have to pay for them once and you can access them as long as you want.'
  },
  {
    question: 'Are there any prerequisites for taking this course?',
    answer: 'No, there are no prerequisites for enrolling in this course. Anyone with a curiosity for the Ancient Hindu Philosophy is welcome to join.'
  },
  {
    question: 'How can I access the courses after purchasing them?',
    answer: 'Courses once purchased can be accessed either through the Dashboard section. You will have to login on the platform first to get access to all your purchased courses. You can also use our android app to access all the courses.'
  },
  {
    question: 'Can I download course content?',
    answer: 'Yes, you can download course lectures on single device using our mobile app. Click here to download our mobile app.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'In case of any difficulties technical or non-technical our team can be reached out at support@shikshanam.in'
  },
  {
    question: 'I am unable to access the Course, what should I do?',
    answer: 'Please check whether you are using the same email, which was used for purchasing the course. Check for the course in your Dashboard section. If the course is still not available, please drop an email to support@shikshanam.in'
  },
  {
    question: 'After payments, can I get a refund?',
    answer: 'You can view our complimentary demo videos and thoroughly review all the provided information and reviews before making a purchase. We do not currently offer refunds.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-background relative overflow-hidden">
      {/* Background Animation - Floating Question Marks & Help Icons */}
      <div className="absolute inset-0 -z-10">
        {/* Floating Question Marks */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center animate-pulse opacity-60">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center animate-pulse opacity-50 animation-delay-1000">
          <HelpCircle className="w-3 h-3 text-secondary" />
        </div>
        <div className="absolute top-60 left-1/3 w-7 h-7 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center animate-pulse opacity-55 animation-delay-2000">
          <HelpCircle className="w-3.5 h-3.5 text-accent" />
        </div>
        <div className="absolute top-80 right-20 w-5 h-5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center animate-pulse opacity-40 animation-delay-3000">
          <HelpCircle className="w-2.5 h-2.5 text-primary" />
        </div>
        <div className="absolute bottom-40 left-32 w-6 h-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center animate-pulse opacity-45 animation-delay-4000">
          <HelpCircle className="w-3 h-3 text-secondary" />
        </div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-gradient-to-br from-muted/20 to-muted/10 rounded-full flex items-center justify-center animate-pulse opacity-35 animation-delay-5000">
          <HelpCircle className="w-2.5 h-2.5 text-muted-foreground" />
        </div>
        
        {/* Subtle gradient overlays */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/4 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary/5 to-accent/4 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our courses, platform, and learning experience.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <div className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border overflow-hidden">
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3 className="font-semibold text-foreground text-lg pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-primary" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-primary" />
                    )}
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6">
                        <div className="border-t border-border pt-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-secondary to-accent rounded-3xl p-8 text-primary-foreground max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold mb-4 text-white">
              Still have questions?
            </h3>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Our support team is here to help you on your learning journey. Get in touch with us for any assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:support@shikshanam.in"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-foreground px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Email Support</span>
              </motion.a>
              <motion.a
                href="tel:+919910032165"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-foreground transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call Us</span>
              </motion.a>
            </div>
            <div className="mt-4 text-white text-sm">
              <p>Monday to Saturday 11AM – 6PM</p>
              <p>Phone: +91-9910032165</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
