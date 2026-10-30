import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Clock
} from 'lucide-react';
import { api } from '../lib/api';
import { useNotifications } from '../context/NotificationContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useNotifications();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does food donation pickup work for hotels and restaurants?',
      a: 'Once a donor submits a surplus food listing with quantity and expiry deadline, registered NGOs in that city are notified. When an NGO claims the food, an automated volunteer driver task is generated. The volunteer collects the food from the donor’s loading dock and delivers it to the shelter.',
    },
    {
      q: 'Is there any legal liability for food donors?',
      a: 'In many jurisdictions (such as the Bill Emerson Good Samaritan Food Donation Act in the US and equivalent food safety provisions internationally), food donors and non-profits are legally protected from civil and criminal liability when donating apparently wholesome food in good faith.',
    },
    {
      q: 'How do you guarantee food safety and hygiene?',
      a: 'All food donations require a mandatory food safety declaration confirming proper preparation and safe storage temperatures. In addition, listings include strict expiry timestamps and are automatically expired and locked if not claimed in time.',
    },
    {
      q: 'Can individuals or households donate cooked food?',
      a: 'Yes! While bulk donations from banquet halls and supermarkets constitute our largest volume, households with surplus festive meals or packaged pantry staples can register as donors and contribute.',
    },
    {
      q: 'How can I volunteer as a delivery driver?',
      a: 'Sign up via the Registration page, select the "Volunteer" role, specify your vehicle type (Bike, Car, Van, etc.), and access your Volunteer Dashboard to begin claiming nearby delivery tasks immediately.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.sendContactMessage({ name, email, subject, message });
      setSubmitted(true);
      showToast('Thank you! Your message has been received by our support team.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block">
          We’re Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
          Contact the Surplus to Serve Team
        </h1>
        <p className="text-stone-600 text-sm">
          Have questions about bulk enterprise food donations, NGO partnerships, or technical integration? Reach out anytime.
        </p>
      </div>

      {/* Grid: Form & Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Emergency Hotline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-serif">Contact Information</h3>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Our central coordinating center is available 7 days a week to support rapid food dispatching and emergency hunger relief operations.
            </p>

            <div className="space-y-4 text-xs text-emerald-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-sm">Headquarters</strong>
                  100 Social Impact Plaza, Humanitarian Quarter, Metro City, CA 90001
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-sm">Helpline & Dispatch</strong>
                  Toll-Free: 1800-SURPLUS (1800-787-7587)<br />
                  Local Desk: +1 (555) 019-2831
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-sm">Email Inquiries</strong>
                  General: support@surplustoserve.org<br />
                  Partnerships: partners@surplustoserve.org
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-sm">Operating Hours</strong>
                  Food Hotline: 24/7 Monitored Dispatch<br />
                  Office Support: 7:00 AM – 10:00 PM Daily
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Callout */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-amber-950 text-sm">
              <Phone className="w-4 h-4 text-amber-700" />
              Emergency Food Rescue Dispatch
            </span>
            <p>
              Are you a restaurant or hotel with &gt; 100 servings needing immediate emergency pickup within 2 hours? Call our emergency line directly at <strong>+1 (555) 019-2831</strong> for priority dispatch.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-serif">Send Us a Message</h3>
              <p className="text-xs text-stone-500 mt-1">
                Fill out the form below and an assigned coordinator will respond within 4 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Thank you for reaching out. A confirmation has been recorded in the platform database.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chef Marcus"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marcus@restaurant.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hotel Food Surplus Partnership, Volunteer Query, Feedback"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how we can assist your food rescue requirements..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <HelpCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Frequently Asked Questions</h2>
          <p className="text-xs text-stone-500">Everything you need to know about food donation logistics & safety</p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-stone-200 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="transition">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-stone-900 text-sm cursor-pointer hover:bg-stone-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
