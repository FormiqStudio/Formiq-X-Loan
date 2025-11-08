// app/api/auth/register/route.ts
import { validatePassword } from "@/lib/auth/utils";
import { User } from "@/lib/db"; // adjust: import your User model correctly
import { connectDB } from "@/lib/db/connection"; // ensure this connects and exports mongoose
import FileUpload from "@/lib/db/models/FileUpload";
import { logApiRequest, logApiResponse, logError } from "@/lib/logger";
import { uploadToMinio } from "@/lib/minio";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DOCUMENT_CONFIGS = {
  maxSize: 10 * 1024 * 1024, // 10 MB
  allowedTypes: ["application/pdf"],
};

const registerSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name too long"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
    role: z.enum(["user", "dsa"]).optional().default("user"),
    bankName: z.enum(["SBI", "HDFC", "ICICI", "AXIS", "KOTAK"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "dsa") return !!data.bankName;
      return true;
    },
    {
      message: "Bank name is required for DSA registration",
      path: ["bankName"],
    }
  );

export async function POST(request: NextRequest) {
  const start = Date.now();
  const url = request.url;
  try {
    logApiRequest("POST", url);

    // Parse multipart/form-data
    const formData = await request.formData();

    // Collect text fields
    const fields: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        fields[key] = String(value);
      }
    }

    // Validate fields
    const parsed = registerSchema.safeParse(fields);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      logApiResponse("POST", url, 400, Date.now() - start);
      return NextResponse.json(
        { success: false, error: "Validation failed", details: issues },
        { status: 400 }
      );
    }
    const validated = parsed.data;

    // Get file objects
    const panFile = formData.get("pan") as File | null;
    const aadharFile = formData.get("aadhar") as File | null;

    if (validated.role === "dsa") {
      if (!panFile)
        return NextResponse.json(
          { success: false, error: "PAN PDF is required" },
          { status: 400 }
        );
      if (!aadharFile)
        return NextResponse.json(
          { success: false, error: "Aadhar PDF is required" },
          { status: 400 }
        );
    }

    // Validate password with your helper
    const pwdValidation = validatePassword(validated.password);
    if (!pwdValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Password validation failed",
          details: pwdValidation.errors,
        },
        { status: 400 }
      );
    }

    // Validate file sizes / types
    const checkFile = (file: File | null, label: string) => {
      if (!file) return { ok: true };
      if (!DOCUMENT_CONFIGS.allowedTypes.includes(file.type)) {
        return { ok: false, error: `${label} must be a PDF` };
      }
      if (file.size > DOCUMENT_CONFIGS.maxSize) {
        return {
          ok: false,
          error: `${label} exceeds ${
            DOCUMENT_CONFIGS.maxSize / (1024 * 1024)
          }MB`,
        };
      }
      return { ok: true };
    };

    const panCheck = checkFile(panFile, "PAN");
    if (!panCheck.ok)
      return NextResponse.json(
        { success: false, error: panCheck.error },
        { status: 400 }
      );
    const aadharCheck = checkFile(aadharFile, "Aadhar");
    if (!aadharCheck.ok)
      return NextResponse.json(
        { success: false, error: aadharCheck.error },
        { status: 400 }
      );

    // Connect DB
    await connectDB();

    // Duplicate checks
    const existingEmail = await User.findOne({ email: validated.email });
    if (existingEmail)
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );

    const existingPhone = await User.findOne({ phone: validated.phone });
    if (existingPhone)
      return NextResponse.json(
        { success: false, error: "User with this phone number already exists" },
        { status: 409 }
      );

    // Create user
    const userData: any = {
      email: validated.email,
      password: validated.password,
      firstName: validated.firstName,
      lastName: validated.lastName,
      phone: validated.phone,
      role: validated.role,
      ...(validated.role === "dsa" && { bankName: validated.bankName }),
    };

    const user = new User(userData);
    await user.save();

    // helper to upload File object and create FileUpload doc
    // helper to upload File object and create FileUpload doc
    async function uploadAndSave(file: File, docType: string) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await uploadToMinio({
        fileName: file.name,
        fileBuffer: buffer,
        contentType: file.type,
        metadata: {
          documentType: docType,
          uploadedBy: String(user._id),
          originalName: file.name,
        },
      });

      const fileRecord = await FileUpload.create({
        originalName: file.name,
        fileName: uploadRes.fileName,
        fileUrl: uploadRes.fileUrl,
        fileType: file.type,
        fileSize: buffer.length,
        mimeType: file.type,
        uploadedBy: user._id,
        documentType: docType,
        minioObjectName: uploadRes.fileName,
      });

      // ✅ Add this block HERE — inside the function, not outside
      user.documents = user.documents || [];
      user.documents.push({
        type:
          docType === "pan_card"
            ? "PAN"
            : docType === "aadhar_card"
            ? "Aadhar"
            : "Other",
        fileName: fileRecord.fileName,
        filePath: fileRecord.fileUrl,
        uploadedAt: fileRecord.createdAt || new Date(),
      });

      return { uploadRes, fileRecord };
    }

    console.log("files", panFile, aadharFile);
    const uploadedFiles: Record<string, any> = {};

    if (panFile) {
      const { uploadRes, fileRecord } = await uploadAndSave(
        panFile,
        "pan_card"
      );
      uploadedFiles.pan = {
        fileUrl: uploadRes.fileUrl,
        fileName: uploadRes.fileName,
        recordId: fileRecord._id,
      };
      user.panimage = uploadRes.fileUrl;
    }

    if (aadharFile) {
      const { uploadRes, fileRecord } = await uploadAndSave(
        aadharFile,
        "aadhar_card"
      );
      uploadedFiles.aadhar = {
        fileUrl: uploadRes.fileUrl,
        fileName: uploadRes.fileName,
        recordId: fileRecord._id,
      };
      user.aadharimage = uploadRes.fileUrl;
    }

    // Save user with file URLs
    await user.save();

    logApiResponse("POST", url, 201, Date.now() - start);
    return NextResponse.json(
      {
        success: true,
        message:
          validated.role === "dsa"
            ? "DSA registration successful. Please wait for admin verification."
            : "Registration successful. You can now login.",
        data: {
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            panimage: user.panimage,
            aadharimage: user.aadharimage,
            isVerified: user.isVerified,
          },
          uploadedFiles,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    logError("Registration error", error);
    // optionally: try to cleanup user and uploaded files if partially created
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
