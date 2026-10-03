import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TimeZoneConverter from "@/components/widgets/TimeZoneConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("time-zone-converter")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function TimeZoneConverterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Converting a time between cities usually means adding and subtracting hours in your head and hoping daylight saving doesn't get in the way. This time zone converter works the other way round: every city you add gets its own 24-hour strip, all lined up on one shared timeline. Drag across it and each city's local time updates instantly, with night, waking hours, and the 9-to-5 workday shaded so you can see at a glance whether a meeting time is reasonable for everyone. Switch between 12-hour and 24-hour clocks, pick any date, and the offsets adjust for daylight saving automatically. Your time zone is read from your browser and nothing is sent anywhere."
      steps={[
        "Your own time zone is set as home, with a few common cities already added. Use Add a city to bring in others.",
        "Drag across any timeline, or type a time in the Time field, to see the same moment in every city.",
        "Press Play the day to watch the whole day sweep past, or Now to jump back to the current time.",
        "Look for the dashed green outline: it marks the longest stretch where everyone is inside working hours.",
        "Use Copy times to paste the converted times into a message or calendar invite.",
      ]}
      faq={[
        {
          question: "How do I convert EST to PST?",
          answer:
            "Set New York (Eastern) as your home city, add Los Angeles (Pacific), and drag the timeline or type a time. Pacific time is normally three hours behind Eastern, and the converter shows the exact gap for the date you pick.",
        },
        {
          question: "Does it handle daylight saving time?",
          answer:
            "Yes. Offsets are looked up for the specific date and time you choose using your browser's built-in time zone database, so a date after a clock change shows the right offset. Countries change their clocks on different dates, so the gap between two cities can temporarily differ from usual — pick the date to see the real value.",
        },
        {
          question: "What do the shaded colours mean?",
          answer:
            "Green is working hours (9:00 to 17:00 local), unshaded is waking hours (7:00 to 22:00), and grey is night. The dashed outline marks the longest window where every city you've added is inside working hours at the same time.",
        },
        {
          question: "What is the difference between UTC and GMT?",
          answer:
            "UTC is the global time standard that other time zones are measured from. GMT is a time zone used in the UK during winter that happens to show the same clock time as UTC. In summer the UK moves to British Summer Time, an hour ahead, while UTC never changes.",
        },
        {
          question: "Can I use 24-hour (military) time?",
          answer:
            "Yes. Switch the 12h/24h toggle to show every city on a 24-hour clock, for example 17:30 instead of 5:30 PM.",
        },
        {
          question: "Is my location sent to a server?",
          answer:
            "No. Your time zone is read from your browser and all conversion happens on your device. Nothing you enter is uploaded or stored.",
        },
      ]}
    >
      <TimeZoneConverter />
    </ToolPageTemplate>
  );
}
