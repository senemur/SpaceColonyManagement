'use client';

import React from 'react';
import RegisterForm from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
