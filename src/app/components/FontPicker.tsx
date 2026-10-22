import { useId, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown, Search, Type } from 'lucide-react';
import { getResumeFont, RESUME_FONTS } from '../fonts';

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const listId = useId();
  const selected = getResumeFont(value);

  return (
    <div className="font-picker-field">
      <span id={labelId}>Fonte do currículo</span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button type="button" className="font-picker-trigger" aria-labelledby={labelId} aria-expanded={open} aria-controls={open ? listId : undefined} aria-haspopup="dialog">
            <Type size={16} aria-hidden="true" />
            <span style={{ fontFamily: selected.family }}>{selected.name}</span>
            <ChevronsUpDown size={15} aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="font-picker-popover" align="start" sideOffset={6} collisionPadding={12} aria-label="Escolher fonte">
            <Command label="Fontes disponíveis">
              <div className="font-picker-search">
                <Search size={16} aria-hidden="true" />
                <Command.Input placeholder="Buscar fonte..." aria-label="Buscar fonte" />
              </div>
              <Command.List id={listId} className="font-picker-list">
                <Command.Empty className="font-picker-empty">Nenhuma fonte encontrada.</Command.Empty>
                {['Sem serifa', 'Com serifa', 'Monoespaçada'].map(category => (
                  <Command.Group key={category} heading={category}>
                    {RESUME_FONTS.filter(font => font.category === category).map(font => (
                      <Command.Item key={font.id} value={font.name} keywords={[font.category]} onSelect={() => { onChange(font.id); setOpen(false); }} className="font-picker-option">
                        <span style={{ fontFamily: font.family }}>{font.name}</span>
                        <span className="font-picker-sample" style={{ fontFamily: font.family }}>Aa</span>
                        <Check size={15} style={{ opacity: selected.id === font.id ? 1 : 0 }} aria-hidden="true" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <small>Fontes locais, com alternativas para outros dispositivos.</small>
    </div>
  );
}
