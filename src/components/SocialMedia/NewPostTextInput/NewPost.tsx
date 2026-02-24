import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import NeumorphButton from "@/components/commons/neumorph-button";
import { useServices } from "@/contexts/ServicesContext";
import type { NewPost } from "@/services/content";
import { LinkPreview } from "@/services/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faImage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  detectLinksInText,
  buildHighlightedHtml,
  deduplicateLinks,
} from "@/lib/urlUtils";
import LinkPreviewCard from "@/components/SocialMedia/LinkPreviewCard/LinkPreviewCard";

export default function NewPost() {
  const { contentService } = useServices();
  const { register, handleSubmit, watch, formState, reset } = useForm<NewPost>({
    mode: "onChange",
    defaultValues: { content: "" },
  });

  const postContent = watch("content") || "";
  const POST_LIMIT = 300;

  const IMAGES_LIMIT = 4;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const highlightLayerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fetchedUrlsRef = useRef<Set<string>>(new Set());
  const [linkPreviews, setLinkPreviews] = useState<Map<string, LinkPreview>>(
    new Map(),
  );

  const detectedLinks = detectLinksInText(postContent);
  const uniqueUrls = deduplicateLinks(detectedLinks);
  const highlightedHtml = buildHighlightedHtml(postContent, detectedLinks);

  const { ref: registerRef, ...registerRest } = register("content", {
    required: true,
    maxLength: POST_LIMIT,
  });

  const activePreviews = uniqueUrls
    .map((url) => linkPreviews.get(url))
    .filter((p): p is LinkPreview => p !== undefined);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightLayerRef.current) {
      highlightLayerRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  useEffect(() => {
    const urls = selectedImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedImages]);

  useEffect(() => {
    for (const url of uniqueUrls) {
      if (fetchedUrlsRef.current.has(url)) continue;
      fetchedUrlsRef.current.add(url);

      setLinkPreviews((prev) => {
        const updated = new Map(prev);
        updated.set(url, {
          url,
          title: "",
          description: "",
          favicon: "",
          isLoading: true,
          error: false,
        });
        return updated;
      });

      contentService
        .previewLink(url)
        .then((preview) => {
          setLinkPreviews((prev) => {
            const updated = new Map(prev);
            updated.set(url, { ...preview, isLoading: false, error: false });
            return updated;
          });
        })
        .catch(() => {
          setLinkPreviews((prev) => {
            const updated = new Map(prev);
            updated.set(url, {
              url,
              title: url,
              description: "",
              favicon: "",
              isLoading: false,
              error: true,
            });
            return updated;
          });
        });
    }
  }, [uniqueUrls.join(",")]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    setSelectedImages((prev) => {
      const combined = [...prev, ...incoming];
      return combined.slice(0, IMAGES_LIMIT);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<NewPost> = async (data: NewPost) => {
    try {
      await contentService.create(
        data,
        selectedImages.length > 0 ? selectedImages : [],
      );
      reset({ content: "" });
      setSelectedImages([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-lg w-full p-3">
      <h2 className="mb-4 text-xl font-bold">Compose new Post</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative min-h-[100px]">
          <div
            ref={highlightLayerRef}
            aria-hidden="true"
            className="absolute inset-0 p-0 font-[inherit] text-sm leading-relaxed
               whitespace-pre-wrap break-words overflow-hidden pointer-events-none text-transparent"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
          <textarea
            placeholder="What's on your mind?"
            {...registerRest}
            ref={(el) => {
              registerRef(el);
              textareaRef.current = el;
            }}
            onScroll={syncScroll}
            className="relative w-full min-h-[100px] resize-none border-none outline-none
               bg-transparent caret-black text-sm leading-relaxed z-10"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        {previewUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 rounded-md object-cover border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FontAwesomeIcon icon={faXmark} size="xs" />
                </button>
              </div>
            ))}
          </div>
        )}
        {activePreviews.length > 0 && (
          <div
            className={`grid gap-2 overflow-hidden mt-3 space-y-2 ${
              activePreviews.length === 1
                ? "grid-cols-1"
                : activePreviews.length === 2
                  ? "grid-cols-2"
                  : activePreviews.length === 3
                    ? "grid-cols-2"
                    : "grid-cols-2"
            }`}
          >
            {activePreviews.map((preview) => (
              <LinkPreviewCard key={preview.url} preview={preview} />
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="grid grid-cols-3 gap-3">
            <FontAwesomeIcon
              icon={faImage}
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer text-gray-800 hover:text-black"
            />
            <FontAwesomeIcon
              icon={faCalendar}
              size="lg"
              onClick={() => {}}
              className="cursor-pointer text-gray-800 hover:text-black"
            />
          </div>
          {postContent.length > POST_LIMIT * 0.8 - 10 && (
            <p
              className={`text-xs mt-2 ${
                postContent.length > POST_LIMIT
                  ? "text-red-500"
                  : postContent.length > POST_LIMIT * 0.8
                    ? "text-yellow-600"
                    : "text-gray-500"
              }`}
            >
              {postContent.length}/{POST_LIMIT}
            </p>
          )}
          <NeumorphButton
            intent="black"
            size="medium"
            className="uppercase"
            type="submit"
            disabled={!formState.isValid}
          >
            Create Post
          </NeumorphButton>
        </div>
      </form>
    </div>
  );
}
