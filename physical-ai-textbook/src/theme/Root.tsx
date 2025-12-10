import React from 'react';
import FloatingChatbot from '@site/src/components/FloatingChatbot';

// Default implementation, that you can customize
export default function Root({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      {children}
      <FloatingChatbot />
    </>
  );
}
