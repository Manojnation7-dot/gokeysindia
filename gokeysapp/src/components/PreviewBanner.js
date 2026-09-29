// Shown at the top of a page opened from the admin "Preview draft" button.
export default function PreviewBanner({ path = "/" }) {
  return (
    <div className="sticky top-0 z-[100] bg-amber-400 text-gray-900 text-sm px-4 py-2 flex flex-wrap items-center justify-center gap-3 shadow">
      <span className="font-semibold">Preview mode</span>
      <span>You are seeing unpublished content. Visitors can't see drafts.</span>
      <a
        href={`/api/preview/exit?path=${encodeURIComponent(path)}`}
        className="underline font-semibold"
      >
        Exit preview
      </a>
    </div>
  );
}
