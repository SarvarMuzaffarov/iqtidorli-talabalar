import QRCode from 'qrcode';

export const generateQRCodeDataURL = async (text: string): Promise<string> => {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return url;
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
};
