'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function EditDSAPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const dsaId = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bankName: '',
    branchCode: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect non-admins
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    if (session?.user && session.user.role !== 'admin') router.push('/unauthorized');
  }, [status, session, router]);

  // Fetch DSA details
  useEffect(() => {
    const fetchDSA = async () => {
      try {
        const res = await fetch(`/api/admin/users/${dsaId}`);
        const data = await res.json();
        if (data.success && data.user) {
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            bankName: data.user.bankName || '',
            branchCode: data.user.branchCode || '',
            isActive: data.user.isActive ?? true
          });
        } else {
          toast.error('Failed to fetch DSA details');
          router.push('/admin/dsa');
        }
      } catch (error) {
        console.error('Error fetching DSA:', error);
        toast.error('Error loading DSA data');
        router.push('/admin/dsa');
      } finally {
        setIsFetching(false);
      }
    };
    if (dsaId) fetchDSA();
  }, [dsaId, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${dsaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success('DSA updated successfully');
        router.push('/admin/dsa');
      } else {
        toast.error(data.error || 'Failed to update DSA');
      }
    } catch (error) {
      console.error('Error updating DSA:', error);
      toast.error('Error updating DSA');
    } finally {
      setIsLoading(false);
    }
  };

  const bankOptions = [
    { value: 'SBI', label: 'State Bank of India' },
    { value: 'HDFC', label: 'HDFC Bank' },
    { value: 'ICICI', label: 'ICICI Bank' },
    { value: 'Axis', label: 'Axis Bank' },
    { value: 'PNB', label: 'Punjab National Bank' },
    { value: 'BOB', label: 'Bank of Baroda' },
    { value: 'Canara', label: 'Canara Bank' },
    { value: 'Union', label: 'Union Bank of India' },
  ];

  if (isFetching) return <div className="p-6">Loading DSA data...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit DSA</h1>
            <p className="text-slate-600">Update DSA account information</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle>Edit DSA Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  required
                />
                <FormInput
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />
                <FormInput
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                />
              </div>

              {/* Bank Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Bank Name"
                  value={formData.bankName}
                  onValueChange={(value) => handleInputChange('bankName', value)}
                  options={bankOptions}
                  error={errors.bankName}
                  required
                />
                <FormInput
                  label="Branch Code"
                  value={formData.branchCode}
                  onChange={(e) => handleInputChange('branchCode', e.target.value)}
                  error={errors.branchCode}
                />
              </div>

              {/* Active Toggle */}
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                  Active DSA Account
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Update DSA'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
