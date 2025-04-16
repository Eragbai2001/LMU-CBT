// For App Router: /app/test/page.tsx
// For Pages Router: /pages/test.tsx

import TestPage from '@/components/dashboard/practice/testpage'; // Adjust the path as needed

// For App Router:
export default function Test() {
  return <TestPage />;
}

// For Pages Router, you'd just export the TestPage component directly