interface InsightProps {
  text: string;
}

export default function Insight({ text }: InsightProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">AI Insight</h3>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}