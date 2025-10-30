'use client';

import { useState } from 'react';
import {
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  Download,
  Share,
  Info,
} from 'lucide-react';

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(10);
  const [tenureType, setTenureType] = useState('years');
  const [loanType, setLoanType] = useState('education');

  // Calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;

    if (monthlyRate === 0) {
      return principal / totalMonths;
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    return emi;
  };

  const emi = calculateEMI();
  const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;
  const totalAmount = emi * totalMonths;
  const totalInterest = totalAmount - loanAmount;

  const loanTypes = [
    { value: 'education', label: 'Education Loan', rate: '8.5-12%' },
    { value: 'personal', label: 'Personal Loan', rate: '10-18%' },
    { value: 'home', label: 'Home Loan', rate: '8-10%' },
    { value: 'car', label: 'Car Loan', rate: '7-12%' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Loan Calculator</h1>
            <p className="text-slate-600">
              Calculate your EMI and plan your education loan
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
              <Share className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Loan Details */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Calculator className="h-5 w-5 text-blue-600" /> Loan Details
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Enter your loan requirements
                  </p>
                </div>

                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Loan Type
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                  >
                    {loanTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} ({type.rate})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Loan Amount
                    </label>
                    <span className="text-sm font-medium text-blue-600">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>₹50K</span>
                    <span>₹50L</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Interest Rate (% per annum)
                    </label>
                    <span className="text-sm font-medium text-blue-600">
                      {interestRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>6%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Loan Tenure
                    </label>
                    <span className="text-sm font-medium text-blue-600">
                      {tenure} {tenureType}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="1"
                      max={tenureType === 'years' ? 30 : 360}
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(parseInt(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                    <select
                      value={tenureType}
                      onChange={(e) => setTenureType(e.target.value)}
                      className="border border-slate-300 rounded-md p-1 text-sm"
                    >
                      <option value="years">Years</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1 {tenureType.slice(0, -1)}</span>
                    <span>
                      {tenureType === 'years' ? '30 years' : '360 months'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="p-6 space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-blue-600" /> Payment Breakdown
                </h2>
                <div className="flex justify-between text-slate-700">
                  <span>Principal Amount</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Total Interest</span>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(totalInterest)}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-slate-900 font-semibold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* EMI Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-center p-6">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Monthly EMI
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(emi)}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <div className="text-slate-600">Tenure</div>
                  <div className="font-semibold text-slate-900">
                    {totalMonths} months
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Interest Rate</div>
                  <div className="font-semibold text-slate-900">
                    {interestRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Total Payments</div>
                <div className="text-lg font-bold text-slate-900">
                  {totalMonths}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                <Percent className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Interest %</div>
                <div className="text-lg font-bold text-slate-900">
                  {((totalInterest / loanAmount) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Pro Tips</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Consider making prepayments to reduce total interest</li>
                    <li>• Education loans offer tax benefits under Section 80E</li>
                    <li>• Compare rates from multiple banks before applying</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
