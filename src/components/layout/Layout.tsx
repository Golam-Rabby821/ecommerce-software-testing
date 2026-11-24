import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { QALabDrawer } from '@/components/qa/QALabDrawer';
import { QAMissionBar } from '@/components/qa/QAMissionBar';
import { XRayInspector } from '@/components/qa/XRayInspector';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" data-testid="app-layout">
      <Header />
      <QAMissionBar />
      <main className="flex-1" data-testid="main-content">
        {children}
      </main>
      <Footer />
      <QALabDrawer />
      <XRayInspector />
    </div>
  );
};
