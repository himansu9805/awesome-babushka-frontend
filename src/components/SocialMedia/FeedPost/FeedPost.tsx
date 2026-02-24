import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import {
  faComment,
  faShare,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { formatRelativeTime } from "@/lib/dateUtils";
import {
  faSafari,
  faChrome,
  faFirefox,
  faEdge,
  faApple,
  faAndroid,
  faWindows,
  faLinux,
} from "@fortawesome/free-brands-svg-icons";
import { LinkPreview, Post } from "@/services/content";
import { useEffect, useRef, useState } from "react";
import {
  detectLinksInText,
  deduplicateLinks,
  buildHighlightedHtml,
} from "@/lib/urlUtils";
import { useServices } from "@/contexts/ServicesContext";
import LinkPreviewCard from "../LinkPreviewCard/LinkPreviewCard";

const clientIconMap: Record<string, IconDefinition> = {
  Safari: faSafari,
  Chrome: faChrome,
  Firefox: faFirefox,
  Edge: faEdge,
};

const platformIconMap: Record<string, IconDefinition> = {
  "Mac OS X": faApple,
  iOS: faApple,
  Windows: faWindows,
  Android: faAndroid,
  Linux: faLinux,
};

export function FeedPost({ post }: { post: Post }) {
  const { contentService } = useServices();
  const [linkPreviews, setLinkPreviews] = useState<Map<string, LinkPreview>>(
    new Map(),
  );
  const fetchedUrlsRef = useRef<Set<string>>(new Set());

  const detectedLinks = detectLinksInText(post.content ?? "");
  const uniqueUrls = deduplicateLinks(detectedLinks);
  const highlightedHtml = buildHighlightedHtml(
    post.content ?? "",
    detectedLinks,
  );

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
  }, [post.content]);

  const activePreviews = uniqueUrls
    .map((url) => linkPreviews.get(url))
    .filter((p): p is LinkPreview => p !== undefined);

  return (
    <div key={post.post_id} className="p-5 border-b border-gray-200 w-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div className="bg-black p-2 rounded-full">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            ></svg>
          </div>
          <div className="flex flex-col justify-start items-start ml-2">
            <div>
              <span className="text-sm font-bold">{post?.author}</span>
              {" • "}
              <span className="text-sm text-gray-400">
                {formatRelativeTime(post?.created_at)}
              </span>
            </div>
            <span className="text-sm text-gray-500">@{post?.author}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-400">
            Posted from{" "}
            <FontAwesomeIcon
              icon={clientIconMap[post?.user_platform.application]}
              size="lg"
            />{" "}
            on{" "}
            <FontAwesomeIcon
              icon={platformIconMap[post?.user_platform.os]}
              size="lg"
            />
          </span>
        </div>
      </div>
      <div
        className="ml-14 mt-2 font-[inherit] leading-relaxed
               whitespace-pre-wrap break-words overflow-hidden pointer-events-none"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      {post?.image_urls && (
        <div
          className={`grid gap-2 mt-2 overflow-hidden ml-14 ${
            post.image_urls.length === 1
              ? "grid-cols-1"
              : post.image_urls.length === 2
                ? "grid-cols-2"
                : post.image_urls.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
          }`}
        >
          {post.image_urls.map((image_url, index) => (
            <img
              key={image_url}
              src={image_url}
              alt={`Post image ${index + 1}`}
              className={`w-full rounded-2xl object-cover ${
                post.image_urls!.length === 1
                  ? "h-80"
                  : post.image_urls!.length === 2
                    ? "h-64"
                    : post.image_urls!.length === 3 && index === 0
                      ? "h-64 row-span-2"
                      : post.image_urls!.length === 3
                        ? "h-32"
                        : "h-40"
              }`}
            />
          ))}
        </div>
      )}
      {activePreviews.length > 0 && (
        <div
          className={`grid gap-2 mt-2 overflow-hidden ml-14 ${
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
      <div className="mb-2" />
      <div className="grid grid-cols-3 gap-x-3 pt-5 ml-14">
        <button className="text-xl">
          <FontAwesomeIcon icon={faHeart} className="text-gray-800" />
        </button>
        <button className="text-xl">
          <FontAwesomeIcon icon={faComment} className="text-gray-800" />
        </button>
        <button className="text-xl">
          <FontAwesomeIcon icon={faShare} className="text-gray-800" />
        </button>
      </div>
    </div>
  );
}
