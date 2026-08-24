export const FACTS = {
  phone1: '+218 21 732 5270',
  phone2: '+218 91 650 7774',
  email: 'info@remalnahya.com',
  site: 'www.remalnahya.com',
  addressEn: 'Gergarish Main Road, Hay Al-Andalus, Tripoli, Libya',
  addressAr: 'طريق قرقارش الرئيسي، حي الأندلس، طرابلس، ليبيا',
} as const;

/** tel: hrefs must not carry spaces */
export const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`;
