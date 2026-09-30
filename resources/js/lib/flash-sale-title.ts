import { useEffect, useState } from 'react';

const MONTHS = [
  'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
];

const jakartaDate = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Jakarta',
  month: 'numeric',
  day: 'numeric',
});

export function getFlashSaleTitle(date: Date = new Date()): string {
  const parts = jakartaDate.formatToParts(date);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);

  if (day <= 5) {
    return 'FLASH SALE GAJIAN';
  }

  if (day === month) {
    return `FLASH SALE ${month}.${month}`;
  }

  if (day >= 25) {
    return 'FLASH SALE AKHIR BULAN';
  }

  return `FLASH SALE ${MONTHS[month - 1]}`;
}

export function useFlashSaleTitle(): string {
  const [title, setTitle] = useState(getFlashSaleTitle);

  useEffect(() => {
    const update = () => setTitle(getFlashSaleTitle());
    const interval = window.setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return title;
}
