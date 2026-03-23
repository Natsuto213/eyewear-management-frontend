import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Sparkles, Heart, Zap, Shield, Star, ArrowRight } from "lucide-react";

const STATS = [
  { value: "2018", label: "Năm thành lập" },
  { value: "50K+", label: "Khách hàng" },
  { value: "500+", label: "Mẫu kính" },
  { value: "4.9★", label: "Đánh giá" },
];

const VALUES = [
  { icon: Sparkles, title: "Cá tính riêng",    desc: "Mỗi cặp kính là một lời tuyên ngôn về phong cách. Chúng tôi giúp bạn tìm ra điều đó." },
  { icon: Shield,   title: "Chất lượng thật",  desc: "Không trung gian, không hàng kém chất lượng. Mỗi sản phẩm đều được kiểm định kỹ càng." },
  { icon: Heart,    title: "Tận tâm phục vụ",  desc: "Từ tư vấn chọn frame đến hậu mãi bảo hành — chúng tôi luôn ở đây cho bạn." },
  { icon: Zap,      title: "Trải nghiệm nhanh", desc: "Đặt hàng online, giao tận nhà, lắp kính tại nhà. Nhanh chóng và tiện lợi nhất có thể." },
];

const TEAM = [
  { name: "Hương xinh gái",  role: "Founder & CEO",        emoji: "👓" },
  { name: "Pé Ân",           role: "Head of Design",       emoji: "✨" },
  { name: "Pé Huy",          role: "AdminSystem",          emoji: "🛡️" },
  { name: "Pé Quang",        role: "SaleStaff",            emoji: "🛒" },
  { name: "Pé Phát",         role: "Manager",              emoji: "👔" },
  { name: "Pé Kiên",         role: "OperationStaff",       emoji: "⚙️" },
];

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">{value}</div>
      <div className="text-sm text-teal-100 font-medium uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY       = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Be Vietnam Pro', sans-serif !important; }
        .card-lift { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .card-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(13,148,136,0.1); }
      `}</style>

      {/* ── HERO ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden bg-white"
      >
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-teal-50 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-teal-50/50 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-5 py-2 mb-8 text-sm text-teal-700 font-medium"
        >
          <Star className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
          Cửa hàng kính mắt tin yêu từ 2018
          <Star className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black leading-[0.95] mb-8 text-gray-900"
        >
          Chúng tôi{" "}
          <span className="text-teal-600">yêu</span>
          <br />kính mắt.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mb-12"
        >
          Không chỉ là một cặp kính. Đó là cách bạn nhìn thế giới — và cách thế giới nhìn bạn.
        </motion.p>

        <motion.a
          href="#story"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-lg shadow-teal-200"
        >
          Khám phá câu chuyện <ArrowRight className="w-4 h-4" />
        </motion.a>

        <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute bottom-12 right-12 text-5xl opacity-10 hidden md:block">👓</motion.div>
        <motion.div animate={{ rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="absolute top-20 left-16 text-4xl opacity-10 hidden md:block">🕶️</motion.div>
      </motion.section>

      {/* ── STORY ── */}
      <section id="story" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-[0.3em] mb-4">Câu chuyện của chúng tôi</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
              Bắt đầu từ một<br />
              <span className="text-gray-400">nỗi bức xúc</span><br />
              rất thật.
            </h2>
            <div className="space-y-5 text-gray-500 text-base leading-relaxed">
              <p>Năm 2018, founder Minh Tuấn — người cận 5 đi-ốp — không thể tìm được cặp kính vừa đẹp, vừa tốt, vừa giá hợp lý. Toàn bộ thị trường chỉ có hai lựa chọn: <span className="text-gray-900 font-medium">rẻ nhưng kém</span>, hoặc <span className="text-gray-900 font-medium">đẹp nhưng đắt vô lý.</span></p>
              <p>Thế là chúng tôi tự làm. Từ cửa hàng nhỏ 15m² ở Quận 3, đến nay đã phục vụ hơn <span className="text-teal-600 font-semibold">50,000 khách hàng</span> trên toàn quốc.</p>
              <p>Triết lý vẫn vậy: <span className="text-gray-900 font-medium">kính đẹp không nên là đặc quyền của người giàu.</span></p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
            <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-3xl p-8 shadow-sm">
              <div className="text-6xl mb-6">👓</div>
              <blockquote className="text-xl font-bold text-gray-900 leading-snug mb-6">
                "Mỗi người xứng đáng được nhìn thế giới rõ nét — theo cách của riêng mình."
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-teal-100">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">MT</div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">Minh Tuấn</p>
                  <p className="text-gray-400 text-xs">Founder & CEO</p>
                </div>
              </div>
            </div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-teal-600 text-white rounded-2xl px-4 py-2 text-sm font-bold shadow-lg shadow-teal-200">
              Since 2018 ✨
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-teal-500" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => <AnimatedStat key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-teal-600 text-sm font-semibold uppercase tracking-[0.3em] mb-3">Giá trị cốt lõi</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">Chúng tôi tin vào điều gì?</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-lift bg-white border border-gray-100 rounded-2xl p-7 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="px-6 py-24 bg-teal-50/40">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-[0.3em] mb-3">Đội ngũ</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Con người đằng sau kính.</h2>
            <p className="text-gray-500 max-w-md mx-auto">Những người trẻ đam mê thời trang, công nghệ và dịch vụ — cùng nhau vì một mục tiêu.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEAM.map((member, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                onMouseEnter={() => setHoveredTeam(i)} onMouseLeave={() => setHoveredTeam(null)}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center cursor-default hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300"
              >
                <motion.div animate={hoveredTeam === i ? { scale: 1.25, rotate: 10 } : { scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }} className="text-4xl mb-4">
                  {member.emoji}
                </motion.div>
                <p className="font-bold text-gray-900 text-base mb-1">{member.name}</p>
                <p className="text-gray-400 text-xs font-medium">{member.role}</p>
                <motion.div initial={{ scaleX: 0 }} animate={hoveredTeam === i ? { scaleX: 1 } : { scaleX: 0 }} className="mt-4 h-0.5 bg-teal-500 rounded-full origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-6xl mb-6">🤝</div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Trở thành một phần<br />
            <span className="text-teal-600">câu chuyện của chúng tôi.</span>
          </h2>
          <p className="text-gray-500 mb-10 text-lg">Hơn 50,000 khách hàng đã tin tưởng. Bạn sẽ là người tiếp theo?</p>
          <motion.a href="/all-product" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold px-10 py-4 rounded-2xl text-base shadow-xl shadow-teal-200 transition-colors">
            Khám phá bộ sưu tập <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </section>

      <div className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm bg-white">
        © 2024 Sora Eyewear — Made with 💚 tại Việt Nam
      </div>
    </div>
  );
}