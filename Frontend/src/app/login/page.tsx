'use client';

import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
