import React, { useState } from 'react';
import { Mail, Phone, MapPin, Copy, Check, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = 'princedhakad5979@gmail.com';
  const phone = '+91 70000 61451';
  const location = 'Bhopal, India';

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 border-t border-[#1b1a20] bg-[#0c0c0f] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17161c] border border-[#26242c] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#412220] border border-[#5e322f]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c98985]">
              Get In Touch
            </span>
          </div>

          <h2
            id="contact-heading"
            className="font-['Outfit'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f3eee8] tracking-tight mb-6"
          >
            Let’s Create Something Great
          </h2>

          <p className="text-base sm:text-lg text-[#a6a29d] font-normal leading-relaxed">
            Ready to elevate your thumbnails and digital visuals? Reach out directly to discuss your next project.
          </p>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          
          {/* Email */}
          <div
            id="contact-card-email"
            className="p-6 rounded-2xl bg-[#121216] border border-[#201f26] hover:border-[#5e322f] transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#412220]/40 border border-[#5e322f] flex items-center justify-center text-[#f2e1df] mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-[#c98985]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7e7b85] mb-1">
              Email
            </span>
            <a
              href={`mailto:${email}`}
              className="text-sm sm:text-base font-medium text-[#f3eee8] hover:text-[#c98985] transition-colors break-all mb-3"
            >
              {email}
            </a>
            <button
              type="button"
              id="btn-copy-email"
              onClick={() => copyToClipboard(email, 'email')}
              className="mt-auto inline-flex items-center gap-1.5 text-xs text-[#9a969f] hover:text-[#f3eee8] py-1 px-2.5 rounded-md hover:bg-[#1c1b22] transition-colors"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy email</span>
                </>
              )}
            </button>
          </div>

          {/* Phone */}
          <div
            id="contact-card-phone"
            className="p-6 rounded-2xl bg-[#121216] border border-[#201f26] hover:border-[#5e322f] transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#412220]/40 border border-[#5e322f] flex items-center justify-center text-[#f2e1df] mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-[#c98985]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7e7b85] mb-1">
              Phone
            </span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="text-sm sm:text-base font-medium text-[#f3eee8] hover:text-[#c98985] transition-colors mb-3"
            >
              {phone}
            </a>
            <button
              type="button"
              id="btn-copy-phone"
              onClick={() => copyToClipboard(phone, 'phone')}
              className="mt-auto inline-flex items-center gap-1.5 text-xs text-[#9a969f] hover:text-[#f3eee8] py-1 px-2.5 rounded-md hover:bg-[#1c1b22] transition-colors"
            >
              {copiedPhone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy phone</span>
                </>
              )}
            </button>
          </div>

          {/* Location */}
          <div
            id="contact-card-location"
            className="p-6 rounded-2xl bg-[#121216] border border-[#201f26] hover:border-[#5e322f] transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1a1920] border border-[#26252d] flex items-center justify-center text-[#e8dfd8] mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-[#c98985]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7e7b85] mb-1">
              Location
            </span>
            <p className="text-sm sm:text-base font-medium text-[#f3eee8] mb-3">
              {location}
            </p>
            <span className="mt-auto inline-flex items-center text-xs text-[#7e7b85] py-1 px-2.5">
              Available Globally
            </span>
          </div>

        </motion.div>

        {/* Primary “Contact Me” CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center"
        >
          <a
            href={`mailto:${email}?subject=Project%20Inquiry%20-%20Design%20Collaboration`}
            id="btn-contact-me-primary"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-base text-[#f5ebea] bg-[#412220] hover:bg-[#542d2a] border border-[#5e322f] hover:border-[#753d39] shadow-xl shadow-[#412220]/30 hover:shadow-[#412220]/50 active:scale-[0.98] transition-all"
          >
            <span>Contact Me</span>
            <ArrowUpRight className="w-5 h-5 text-[#f5ebea]" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
