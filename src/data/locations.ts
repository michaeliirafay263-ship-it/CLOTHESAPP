import { DeliveryZone } from '../types';

export const DAR_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'kinondoni',
    district: 'Kinondoni',
    districtSw: 'Kinondoni',
    wards: [
      'Sinza',
      'Mikocheni',
      'Masaki / Oysterbay',
      'Mwenge',
      'Kijitonyama',
      'Msasani',
      'Mwananyamala',
      'Kinondoni Mjini',
      'Magomeni',
      'Tandale',
      'Mbezi Beach',
      'Kawe',
      'Kunduchi',
      'Tegeta'
    ],
    fee: 3000,
    estimatedHours: '2 - 4 hours (Same Day)',
    estimatedHoursSw: 'Masaa 2 - 4 (Siku Hiyo Hiyo)'
  },
  {
    id: 'ilala',
    district: 'Ilala',
    districtSw: 'Ilala',
    wards: [
      'Kariakoo',
      'Posta / CBD',
      'Upanga Mashariki',
      'Upanga Magharibi',
      'Gerezani',
      'Jangwani',
      'Ilala Boma',
      'Tabata',
      'Buguruni',
      'Kinyerezi',
      'Segerea',
      'Vingunguti',
      'Ukonga',
      'Gongo la Mboto'
    ],
    fee: 3000,
    estimatedHours: '2 - 4 hours (Same Day)',
    estimatedHoursSw: 'Masaa 2 - 4 (Siku Hiyo Hiyo)'
  },
  {
    id: 'ubungo',
    district: 'Ubungo',
    districtSw: 'Ubungo',
    wards: [
      'Ubungo Mjini',
      'Shekilango',
      'Mabibo',
      'Manzese',
      'Kimara',
      'Mbezi Mwisho',
      'Goba',
      'Kibamba',
      'Makurumla'
    ],
    fee: 4000,
    estimatedHours: '3 - 5 hours (Same Day)',
    estimatedHoursSw: 'Masaa 3 - 5 (Siku Hiyo Hiyo)'
  },
  {
    id: 'temeke',
    district: 'Temeke',
    districtSw: 'Temeke',
    wards: [
      'Temeke Mjini',
      'Chang\'ombe',
      'Kurasini',
      'Mbagala',
      'Mtoni',
      'Tandika',
      'Yombo Vituka',
      'Keko',
      'Sandali',
      'Buza'
    ],
    fee: 4000,
    estimatedHours: '3 - 6 hours (Same Day)',
    estimatedHoursSw: 'Masaa 3 - 6 (Siku Hiyo Hiyo)'
  },
  {
    id: 'kigamboni',
    district: 'Kigamboni',
    districtSw: 'Kigamboni',
    wards: [
      'Kigamboni Ferry',
      'Vijibweni',
      'Kibada',
      'Mjimwema',
      'Gezaulole',
      'Tuangoma',
      'Somangila'
    ],
    fee: 5000,
    estimatedHours: '4 - 7 hours (Same Day or Next Morning)',
    estimatedHoursSw: 'Masaa 4 - 7 (Siku Hiyo Hiyo au Asubuhi)'
  }
];

export const formatTZS = (amount: number): string => {
  return `TZS ${amount.toLocaleString('en-US')}`;
};
