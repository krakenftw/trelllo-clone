import Access from "./svg/Access";
import IntroducingTags from "./svg/IntroducingTags";
import ShareNotes from "./svg/ShareNotes";

export default function FeatureCards() {
  return (
    <div className="flex gap-3">
      {[
        {
          Icon: IntroducingTags,
          title: "Organize with Labels",
          description:
            "Add labels to your notes for easy categorization and retrieval. Streamline your workflow.",
        },
        {
          Icon: ShareNotes,
          title: "Collaborate Seamlessly",
          description:
            "Share your notes quickly via email or link. Improve teamwork with easy sharing.",
        },
        {
          Icon: Access,
          title: "Use on Any Device",
          description:
            "Access your notes on all your devices. Stay productive on your phone, tablet, or computer.",
        },
      ].map((card, index) => (
        <div
          key={index}
          className="rounded-lg p-4 py-8 bg-white flex gap-3 w-full items-center"
        >
          <card.Icon />
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{card.title}</h3>
            <p className="text-xs">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
