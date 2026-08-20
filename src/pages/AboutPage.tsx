import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { companyData } from '../data/company';
import { ShieldCheck, Cpu, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AboutPageProps {
  onOpenQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuoteModal }) => {
  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Hero Header */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 border-b border-gray-200">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/25 text-[#008BA3] font-mono text-xs uppercase tracking-widest mb-6 font-bold">
            <span>Doha, Qatar</span>
            <span>•</span>
            <span>CR 158065</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#0A0B0D] tracking-tight uppercase leading-[1.02]">
            ABOUT FACE <br />
            <span className="text-gradient-cyan">PRINTING SERVICES</span>
          </h1>

          <p className="mt-8 text-xl sm:text-2xl font-display font-medium text-gray-800 leading-relaxed">
            “{companyData.description.body1}”
          </p>
        </div>
      </section>

      {/* 01 WHO WE ARE */}
      <section className="py-24 border-b border-gray-200 relative bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-6">
              <SectionHeading
                number="01"
                tag="IDENTITY"
                title="WHO WE ARE."
                subtitle="A dedicated full-service printing and branding partner in Qatar."
              />

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {companyData.description.body2}
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {companyData.description.body3}
              </p>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4 mt-2">
                <div className="w-12 h-12 rounded-xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-base">Commercial Registration: 158065</h4>
                  <p className="font-mono text-xs text-gray-500">Doha, State of Qatar • Official Corporate Provider</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200 shadow-xl">
                <img
                  src="/images/user_extracted/Page_02_Image_01.jpeg"
                  alt="FACE PRINTING SERVICES Facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-mono text-xs text-[#38E1FF] uppercase tracking-widest font-bold">
                    Production Excellence
                  </p>
                  <p className="font-display font-bold text-lg text-white mt-1">
                    Delivering high-quality print solutions across Qatar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 WHAT WE DO */}
      <section className="py-24 border-b border-gray-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="02"
            tag="CAPABILITIES"
            title="WHAT WE DO."
            subtitle="Full spectrum production covering 8 specialized disciplines."
            className="mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Branding", slug: "branding", desc: "Pop-up walls, roll-ups, flags, canopies & spatial graphics." },
              { title: "Light Box", slug: "light-box", desc: "Tension fabric SEG, backlit displays & freestanding totems." },
              { title: "Events", slug: "events", desc: "Stadium hoardings, media backdrops & tournament staging." },
              { title: "Offset Printing", slug: "offset-printing", desc: "Corporate brochures, annual reports, calendars & stationery." },
              { title: "Gift Items", slug: "gift-items", desc: "Executive VIP boxes, flasks, journals, powerbanks & medals." },
              { title: "Acrylic Works", slug: "acrylic-works", desc: "Laser cut awards, door plaques, directories & safety signage." },
              { title: "Uniforms & Sports Wear", slug: "uniforms-sportswear", desc: "Reflective boiler suits, school polos, jerseys & headwear." },
              { title: "Vehicle Wrapping", slug: "vehicle-wrapping", desc: "Full bus wraps, van graphics, pickup fleets & commercial livery." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#00BCD4]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-[#008BA3] font-bold">0{idx + 1}</span>
                  <h4 className="font-display font-bold text-xl text-gray-900 mt-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
                <Link
                  to={`/services/${item.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono text-[#008BA3] hover:text-[#00BCD4] font-semibold"
                >
                  <span>Explore pillar</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 OUR APPROACH */}
      <section className="py-24 border-b border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="03"
            tag="METHODOLOGY"
            title="OUR APPROACH."
            subtitle="Combining advanced printing technology, skilled designers, and reliable service."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900">Advanced Technology</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Utilizing state-of-the-art wide format printers, precision CNC laser cutters, and calibrated offset lithography presses to ensure color precision and sharp resolution.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900">Skilled Designers</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our pre-press and creative team ensures your brand guidelines are strictly respected, with spot color calibration and structural engineering for all physical materials.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900">Reliable Service</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Committed delivery schedules, transparent cost-effective printing solutions, and full on-site installation across Doha and all municipalities in Qatar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 QUALITY & CRAFTSMANSHIP */}
      <section className="py-24 border-b border-gray-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200 shadow-md">
                <img
                  src="/images/user_extracted/Page_02_Image_02.jpeg"
                  alt="Craftsmanship & Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col gap-6">
              <SectionHeading
                number="04"
                tag="EXCELLENCE"
                title="QUALITY & CRAFTSMANSHIP."
                subtitle="We combine quality materials, modern equipment and expert craftsmanship."
              />

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Every project produced by FACE PRINTING SERVICES stands out with precision and impact. From the diamond-polished edges of our acrylic awards to the seamless air-release cast vinyls on fleet vehicles, our focus on tactile perfection is unrelenting.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Quality Materials & Certified Substrates",
                  "Modern Equipment & CNC Fabrication",
                  "Expert Hand-Finishing & Assembly",
                  "Precision Color Matching & G7 Standards"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0" />
                    <span className="text-xs font-mono text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenQuoteModal}
                  className="px-8 py-4 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.35)] cursor-pointer"
                >
                  Discuss Your Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
