import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Building,
  User,
  Award
} from 'lucide-react';
import { Certificate } from '../types';
import { TktiyfLogo } from './TktiyfLogo';

interface VerifyCertificateModalProps {
  certificates: Certificate[];
  initialCertNumber?: string;
  onClose: () => void;
  onViewCertificateDetails?: (cert: Certificate) => void;
}

export const VerifyCertificateModal: React.FC<VerifyCertificateModalProps> = ({
  certificates,
  initialCertNumber = '',
  onClose,
  onViewCertificateDetails,
}) => {
  const [certNumberInput, setCertNumberInput] = useState(initialCertNumber);
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Quick preset sample numbers for immediate testing
  const sampleNumbers = ['IL-2026-00125', 'IL-2026-00126', 'IL-2026-00127'];

  useEffect(() => {
    if (initialCertNumber) {
      performLookup(initialCertNumber);
    }
  }, [initialCertNumber]);

  const performLookup = (num: string) => {
    const trimmed = num.trim().toUpperCase();
    const found = (certificates || []).find((c) => c.certificateNumber.toUpperCase() === trimmed);
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumberInput.trim()) return;
    performLookup(certNumberInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TktiyfLogo size="sm" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Sertifikatni QR / Raqam orqali Tekshirish
              </h3>
              <p className="text-[11px] text-slate-400">
                TKTI Yangiyer filiali rasmiy reyestri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Search */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Sertifikat raqamini kiriting (yoki QR skaner qiling):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certNumberInput}
                  onChange={(e) => setCertNumberInput(e.target.value)}
                  placeholder="Masalan: IL-2026-00125"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shrink-0"
              >
                Tekshirish
              </button>
            </div>
          </form>

          {/* Quick Clickable Sample Pills */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-400">Namunaviy raqamlar:</span>
            {sampleNumbers.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setCertNumberInput(num);
                  performLookup(num);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Prompt Section 5 Verification Result Display */}
          {hasSearched && (
            <div className="pt-2">
              {searchResult ? (
                /* Valid Certificate View */
                <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-500/60 text-slate-900 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span>Sertifikat haqiqiy</span>
                  </div>

                  <div className="bg-white/80 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Sertifikat №:</span>
                      <strong className="font-mono text-slate-900">{searchResult.certificateNumber}</strong>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Ishtirokchi:</span>
                      <strong className="text-slate-950">{searchResult.studentName}</strong>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Fakultet:</span>
                      <strong className="text-slate-800">{searchResult.studentFaculty}</strong>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Tadbir:</span>
                      <strong className="text-sky-700">{searchResult.eventName}</strong>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Berilgan sana:</span>
                      <strong className="text-slate-800">{searchResult.issueDate}</strong>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Tasdiqlovchi mas‘ul:</span>
                      <strong className="text-slate-800">{searchResult.signatory}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ushbu sertifikat Toshkent kimyo-texnologiya instituti Yangiyer filiali rasmiy reyestrida ro‘yxatga olingan.</span>
                  </div>

                  {onViewCertificateDetails && (
                    <button
                      onClick={() => {
                        onClose();
                        onViewCertificateDetails(searchResult);
                      }}
                      className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                    >
                      Sertifikat asl nusxasini ko‘rish →
                    </button>
                  )}
                </div>
              ) : (
                /* Not Found View */
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Sertifikat topilmadi</span>
                  </div>
                  <p className="text-rose-700">
                    Kiritilgan raqam (<strong>{certNumberInput}</strong>) bo‘yicha institut ma‘lumotlar bazasida tasdiqlangan sertifikat mavjud emas. Raqamni tekshirib qayta kiriting.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
