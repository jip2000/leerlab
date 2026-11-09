import { languages, type LanguageCode } from '@/data/languages';
import { Select } from './Field';

export function LanguageSelect({ value, onChange, ...rest }: { value: LanguageCode; onChange: (v: LanguageCode) => void; 'aria-label'?: string }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as LanguageCode)} {...rest}>
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag ? `${l.flag} ` : ''}
          {l.name}
        </option>
      ))}
    </Select>
  );
}
