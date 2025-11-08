// components/DSADocuments.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

type Doc = {
  _id?: string;
  fileName: string;
  filePath: string; // may be public url or host/bucket path
  type?: string;
};

export default function DSADocuments({ documents = [] as Doc[] }: { documents?: Doc[] }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchUrl = async (doc: Doc) => {
    // If stored filePath is a full url, use it directly
    if (doc.filePath && (doc.filePath.startsWith('http://') || doc.filePath.startsWith('https://'))) {
      return doc.filePath;
    }
    if (!doc._id) throw new Error('Missing file id for presign');
    const res = await fetch(`/api/files/presign?fileId=${encodeURIComponent(doc._id)}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to get file url');
    return json.url as string;
  };

  const handlePreview = async (doc: Doc) => {
    try {
      setLoadingId(doc._id || doc.fileName);
      const url = await fetchUrl(doc);
      setPreviewUrl(url);
      setIsOpen(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load preview');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDownload = async (doc: Doc) => {
    try {
      setLoadingId(doc._id || doc.fileName);
      const url = await fetchUrl(doc);
      // open in new tab (will trigger browser download or view)
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      toast.error(err?.message || 'Download failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents</h3>
        <span className="text-sm text-slate-500">{documents.length} uploaded</span>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-slate-600">No documents uploaded</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc._id || doc.fileName} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <div>
                  <div className="text-sm font-medium">{doc.fileName}</div>
                  <div className="text-xs text-slate-500">{doc.type || 'Document'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => handlePreview(doc)} disabled={loadingId === (doc._id || doc.fileName)}>
                  Preview
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownload(doc)} disabled={loadingId === (doc._id || doc.fileName)}>
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal preview */}
      <Dialog open={isOpen} onOpenChange={(val) => { if (!val) setPreviewUrl(null); setIsOpen(val); }}>
        <DialogContent className="max-w-5xl w-full h-[85vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(100%-64px)]">
            {previewUrl ? (
              <iframe src={previewUrl} title="Document preview" className="w-full h-full border-0" />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-500">Loading preview...</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
