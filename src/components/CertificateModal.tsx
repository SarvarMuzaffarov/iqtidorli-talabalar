import React, { useEffect, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode as QrIcon,
  Sparkles,
  Building
} from 'lucide-react';
import { Certificate } from '../types';
import { generateQRCodeDataURL } from '../utils/qr';
import { TktiyfLogo } from './TktiyfLogo';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
  onOpenVerifyWithNumber?: (certNumber: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  onOpenVerifyWithNumber,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (certificate) {
      // Generate real QR code image containing verification payload
      const verifyUrl = `https://talenthub.tkti.uz/verify/${certificate.certificateNumber}`;
      generateQRCodeDataURL(verifyUrl).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [certificate]);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Top toolbar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              Rasmiy Elektron Sertifikat (QR Verifikatsiyali)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVerifyWithNumber && (
              <button
                onClick={() => onOpenVerifyWithNumber(certificate.certificateNumber)}
                className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <QrIcon className="w-3.5 h-3.5" />
                QR Tekshirish
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Chop etish / PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100 flex items-center justify-center">
          
          {/* Certificate Sheet (A4 ratio styled) */}
          <div 
            id="printable-certificate"
            className="w-full max-w-3xl bg-amber-50/40 border-8 border-double border-amber-800/60 p-8 sm:p-12 rounded-lg shadow-xl relative text-center space-y-6 text-slate-900 select-none"
            style={{
              backgroundImage: 'radial-gradient(#d9770615 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Corner Ornamental Accents */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-800/70" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-800/70" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-800/70" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-800/70" />

            {/* University Header */}
            <div className="space-y-1.5 flex flex-col items-center">
              <TktiyfLogo size="lg" className="mb-1" />
              <div className="text-[11px] uppercase tracking-widest font-black text-slate-700">
                O‘zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligi
              </div>
              <div className="text-xs sm:text-base font-extrabold tracking-wide text-slate-900 uppercase">
                Toshkent kimyo-texnologiya instituti Yangiyer filiali
              </div>
              <div className="text-[11px] font-semibold text-sky-900">
                Iqtidorli talabalar bilan ishlash bo‘limi • TalentHub TKTIYF
              </div>
            </div>

            {/* Certificate Big Word */}
            <div className="pt-2">
              <h1 
                className="text-3xl sm:text-5xl font-serif font-black tracking-widest text-amber-900"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                CERTIFICATE
              </h1>
              <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500 mt-1">
                Maxsus Maqom Sertifikati
              </div>
            </div>

            {/* Awardee Section */}
            <div className="space-y-2 max-w-xl mx-auto">
              <p className="text-xs sm:text-sm italic text-slate-600 font-serif">
                Ushbu sertifikat rasman tasdiqlaydiki:
              </p>

              <div className="border-b-2 border-amber-800/40 pb-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-serif tracking-tight">
                  {certificate.studentName}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {certificate.studentFaculty}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif pt-2">
                institut doirasida tashkil etilgan <strong className="font-bold text-slate-950">“{certificate.eventName}”</strong> dasturida faol ishtirok etgani va o‘zining yuqori iqtidorini namoyon qilganligi uchun berildi.
              </p>

              {certificate.reason && (
                <p className="text-[11px] text-slate-500 italic max-w-lg mx-auto">
                  "{certificate.reason}"
                </p>
              )}
            </div>

            {/* Signatures & Real Scannable QR Code */}
            <div className="pt-6 border-t border-amber-900/20 grid grid-cols-3 items-end text-xs">
              
              {/* Left: Signatory */}
              <div className="text-left space-y-1">
                <div className="font-serif italic text-slate-700 text-sm font-bold border-b border-slate-400 pb-1 inline-block">
                  {certificate.signatory}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {certificate.signatoryTitle}
                </div>
              </div>

              {/* Center: Stamp / Official Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                  <TktiyfLogo size="xl" className="opacity-95 drop-shadow-md hover:scale-105 transition transform" />
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-800/40 pointer-events-none" />
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono font-bold">
                  Sana: {certificate.issueDate}
                </span>
                <span className="text-[8px] text-sky-800 font-semibold uppercase">
                  Yangiyer filiali muhri
                </span>
              </div>

              {/* Right: Real Scannable QR Code */}
              <div className="text-right flex flex-col items-end space-y-1">
                <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-xs inline-block">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Certificate QR Code"
                      className="w-18 h-18 sm:w-20 sm:h-20 object-contain"
                    />
                  ) : (
                    <div className="w-18 h-18 bg-slate-200 animate-pulse rounded" />
                  )}
                </div>
                <div className="font-mono text-[10px] font-bold text-slate-800">
                  № {certificate.certificateNumber}
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Haqiqiy (Verifikatsiyalangan)
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Sertifikat tekshirish manzili: <code className="text-slate-800 font-mono">talenthub.tkti.uz/verify/{certificate.certificateNumber}</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
