import { useAppSelector } from '@/hooks/redux';

/** Isotipo de la empresa desde el ERP; si no llega, el archivo local de respaldo. */
export function useLogo(): string {
  return useAppSelector((s) => s.empresa.data?.logo) ?? '/brand/isotipo.png';
}
