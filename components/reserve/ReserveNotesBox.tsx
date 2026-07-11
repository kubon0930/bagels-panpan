import { reserveNotes, socialLinks } from "@/data/site";

/** 予約ページ共通の注意文ボックス */
export default function ReserveNotesBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-cream px-4 py-3.5 text-[13px] leading-relaxed text-ink/75 sm:px-5 sm:py-4 sm:text-sm ${className}`}
    >
      <ul className="space-y-1.5">
        {reserveNotes.map((note) => (
          <li key={note} className="flex gap-2">
            <span aria-hidden="true" className="text-bagel">
              ・
            </span>
            <span>
              {note.includes("Instagram") ? (
                <>
                  最新情報は
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-navy underline underline-offset-2 hover:text-bagel"
                  >
                    Instagram
                    <span className="sr-only">（新しいタブで開きます）</span>
                  </a>
                  をご確認ください。
                </>
              ) : (
                note
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
