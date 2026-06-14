import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import EditorialButton from '../ui/EditorialButton';

interface ContactSectionProps {
  formSubmitted: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  formSubmitted,
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <section id="contact" className="py-24 md:py-36 border-t border-white/10 px-6 md:px-12 bg-[#080a09]/10">
      <div className="max-w-4xl mx-auto">
        <SectionLabel num="06" title="Contact" className="mb-16" />

        <div className="mb-16 text-left">
          <h2 className="text-3xl md:text-5vw font-heading font-bold uppercase leading-tight text-white mb-4 select-none">
            LET'S BUILD THE NEXT SPATIAL EXPERIENCE.
          </h2>
          <p className="text-xs md:text-sm text-[#8d928d] font-light tracking-wide">
            开始一次新的空间体验合作 / Book a Studio Consultation
          </p>
        </div>

        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-white/5 bg-panel flex flex-col items-center justify-center gap-6"
          >
            <div className="p-4 bg-white/5 border border-white/5 text-[#9de8cf]">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white uppercase">预约提交成功</h3>
            <p className="text-xs text-[#8d928d] max-w-md mx-auto leading-relaxed font-light">
              感谢您的关注！我们已收到您的合作咨询，主创团队将在 1 个工作日内通过邮件或电话与您取得联系。
            </p>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-8 select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label className="text-[10px] font-mono tracking-widest text-[#8d928d] uppercase mb-3">您的姓名 Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：朱先生"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-mono tracking-widest text-[#8d928d] uppercase mb-3">电子邮箱 Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label className="text-[10px] font-mono tracking-widest text-[#8d928d] uppercase mb-3">联系电话 Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="138-xxxx-xxxx"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-mono tracking-widest text-[#8d928d] uppercase mb-3">合作方向 Option *</label>
                <div className="relative">
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer appearance-none rounded-none"
                  >
                    <option value="" disabled className="bg-[#050706]">请选择合作方向</option>
                    <option value="3d-printing" className="bg-[#050706]">机器人3D打印建造</option>
                    <option value="interactive-art" className="bg-[#050706]">新媒体多媒体交互装置</option>
                    <option value="sandbox" className="bg-[#050706]">AR增强现实数字沙盘</option>
                    <option value="digital-life" className="bg-[#050706]">AIGC与专属数字生命</option>
                    <option value="exhibition-planning" className="bg-[#050706]">品牌活动/数字特展策划</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-mono tracking-widest text-[#8d928d] uppercase mb-3">需求描述 Description *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="请详细描述您的项目需求、场地尺寸、预估周期等信息..."
                className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white transition-colors resize-none rounded-none"
              />
            </div>

            <EditorialButton
              type="submit"
              variant="solid"
              className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] bg-[#f3f0e8] text-[#050706] hover:bg-[#9de8cf] hover:text-[#050706]"
              cursorText="SEND"
            >
              发送预约咨询
            </EditorialButton>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
