'use client';

import { LayoutGroup } from 'framer-motion';

interface MotionProviderProps {
  children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
