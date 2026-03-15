import { Input } from "./input";

export function DateTimePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} />;
}