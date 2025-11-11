"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  GraduationCap,
  Building,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/layout";
import {
  useGetApplicationByIdQuery,
  useGetApplicationDocumentsQuery,
} from "@/store/api/apiSlice";
import { SkeletonCard } from "@/components/ui/loading/SkeletonCard";
import { formatFullCurrency, formatLoanAmount } from "@/lib/utils/currency";
import { safeApplication } from "@/lib/utils/fallbacks";

export default function ApplicationDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id as string;

  const {
    data: applicationData,
    isLoading,
    error,
    refetch,
  } = useGetApplicationByIdQuery(applicationId, {
    skip: !session?.user || session.user.role !== "user",
  });

  const { data: documentsData, isLoading: isLoadingDocuments } =
    useGetApplicationDocumentsQuery(applicationId, {
      skip: !session?.user || session.user.role !== "user",
    });

  if (status === "loading") {
    return (
      <DashboardLayout>
        <ApplicationSkeleton />
      </DashboardLayout>
    );
  }

  if (!session?.user || session.user.role !== "user") {
    router.push("/login");
    return null;
  }

  if (isLoading || !applicationData) {
    return (
      <DashboardLayout>
        <ApplicationSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Error Loading Application
            </h3>
            <p className="text-slate-600 mb-4">
              {error && "data" in error && error.data
                ? (error.data as any).error || "Failed to load application"
                : "Failed to load application"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push("/user/applications")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const application = applicationData?.application;
  const documents = documentsData?.documents || [];

  if (!application) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Application Not Found
            </h3>
            <p className="text-gray-600">
              The requested application could not be found.
            </p>
            <Link href="/user/applications">
              <Button className="mt-4">Back to Applications</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const safeApp = safeApplication(application);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "under_review":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "partially_approved":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "partially_approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "under_review":
        return "Under Review";
      case "partially_approved":
        return "Partially Approved";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const calculateProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 20;
      case "under_review":
        return 50;
      case "partially_approved":
        return 75;
      case "approved":
        return 100;
      case "rejected":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/user/applications">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Application #{safeApp.applicationNumber}
              </h1>
              <p className="text-gray-600">
                {safeApp.educationInfo.course} at{" "}
                {safeApp.educationInfo.instituteName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={`${getStatusColor(safeApp.status)} border px-3 py-1`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(safeApp.status)}
                {getStatusText(safeApp.status)}
              </div>
            </Badge>
            {safeApp.status === "partially_approved" && (
              <Link href={`/user/chat?applicationId=${safeApp._id}`}>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with DSA
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Application Progress</h3>
                <span className="text-sm text-gray-600">
                  {calculateProgress(safeApp.status)}% Complete
                </span>
              </div>
              <Progress
                value={calculateProgress(safeApp.status)}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Submitted</span>
                <span>Under Review</span>
                <span>DSA Review</span>
                <span>Final Decision</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900">
                  {safeApp.personalDetails.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {safeApp.personalInfo.email}
                </p>
                <p className="text-sm text-gray-600">
                  {safeApp.personalInfo.phone}
                </p>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900">
                  {safeApp.educationInfo.course} at{" "}
                  {safeApp.educationInfo.instituteName}
                </p>
              </CardContent>
            </Card>

            {/* Financial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900">
                  Annual Income:{" "}
                  {formatFullCurrency(safeApp.financialInfo.annualIncome)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900">
                  Requested: {formatLoanAmount(safeApp.loanDetails.amount)}
                </p>
                <p className="text-sm text-gray-600">
                  Purpose: {safeApp.loanDetails.purpose}
                </p>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDocuments ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : documents.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No documents uploaded yet
                  </p>
                ) : (
                  documents.map((doc: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 border rounded mb-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {doc.documentType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* --------------------- Skeleton Loader ---------------------- */

function ApplicationSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-9 w-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-9 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-3 w-10 bg-gray-100 rounded"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded"></div>
        <div className="flex justify-between text-xs text-gray-400">
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-5 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-100 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
