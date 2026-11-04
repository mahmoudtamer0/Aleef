
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/tracker';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      track(pathname);
    }
  }, [pathname]);

  return null;
}
