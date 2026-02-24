import { LinkPreview } from "@/services/content";

interface LinkPreviewCardProps {
  preview: LinkPreview;
}

export default function LinkPreviewCard({ preview }: LinkPreviewCardProps) {
  const hostname = (() => {
    try {
      return new URL(preview.url).hostname.replace("www.", "");
    } catch {
      return preview.url;
    }
  })();

  if (preview.isLoading) {
    return (
      <div className="rounded-lg p-3 space-y-2 animate-pulse bg-gray-50">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-100 bg-gray-50 transition-colors no-underline group"
    >
      {preview.favicon && !preview.error ? (
        <img
          src={preview.favicon}
          alt=""
          width={16}
          height={16}
          className="mt-0.5 w-4 h-4 shrink-0 rounded-sm"
        />
      ) : (
        <div className="mt-0.5 w-4 h-4 shrink-0 rounded-sm bg-gray-200" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-gray-400 mb-0.5">{hostname}</p>
        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
          {preview.error ? preview.url : preview.title || preview.url}
        </p>
        {preview.description && !preview.error && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {preview.description}
          </p>
        )}
      </div>
    </a>
  );
}
