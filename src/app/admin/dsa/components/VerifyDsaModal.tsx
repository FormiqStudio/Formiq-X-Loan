"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateUserStatusMutation, useVerifyDsaAccountMutation } from "@/store/api/apiSlice";
import { toast } from "sonner";

interface VerifyDSADialogProps {
  id: string;
  isVerified: boolean;
  refetchDSAs?: () => void;
}

export default function VerifyDSADialog({
  id,
  isVerified,
  refetchDSAs,
}: VerifyDSADialogProps) {
  const [verifyDsaAccount, { isLoading }] = useVerifyDsaAccountMutation();

    const handleConfirm = async () => {
    try {
      await verifyDsaAccount({
        id,
        isVerified: !isVerified,
      }).unwrap();

      toast.success(`DSA marked as ${!isVerified ? "Verified" : "Unverified"}`);
      refetchDSAs && refetchDSAs();
    } catch (error) {
      console.error("Verification update error:", error);
      toast.error("Failed to update verification status");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant={isVerified ? "outline" : "default"}
          className={
            isVerified
              ? "border-green-600 text-green-700 hover:bg-green-50"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }
        >
          {isVerified ? "Verified" : "Unverified"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isVerified ? "Mark as Unverified?" : "Mark as Verified?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{" "}
            <b>{isVerified ? "unverify" : "verify"}</b> this DSA account?  
            This action will immediately affect their access.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isVerified
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {isLoading ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
