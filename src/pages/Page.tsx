import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface PageProps {
  fullWidth?: boolean;

  children?: ReactNode | undefined;
}

function Page({ children, fullWidth = false }: PageProps) {
  const klass = fullWidth ? 'w-full px-16' : 'lg:container lg:mx-auto';
  return (
    <>
      <Header />
      <div className={klass}>{children}</div>
      <Footer />
    </>
  );
}

export default Page;
