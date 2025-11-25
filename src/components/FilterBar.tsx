import { cn } from '../lib/cn'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Checkbox, CheckboxLabel } from '../ui/checkbox'
import { Radio, RadioLabel } from '../ui/radio'
import { Switch } from '../ui/switch'

type FilterBarProps = {
  sort?: string
  onSortChange?: (value: string) => void
  categories?: { id: string; label: string; checked?: boolean }[]
  onCategoryToggle?: (id: string, checked: boolean) => void
  type?: 'all' | 'pickup' | 'delivery'
  onTypeChange?: (value: 'all' | 'pickup' | 'delivery') => void
  promoOnly?: boolean
  onPromoToggle?: (checked: boolean) => void
  className?: string
}

export default function FilterBar({ sort = 'popular', onSortChange, categories = [], onCategoryToggle, type = 'all', onTypeChange, promoOnly = false, onPromoToggle, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-md', className)}>
      <Select value={sort} onValueChange={(v) => onSortChange?.(v)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">Popular</SelectItem>
          <SelectItem value="price-asc">Price ↑</SelectItem>
          <SelectItem value="price-desc">Price ↓</SelectItem>
          <SelectItem value="rating-desc">Rating</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-md">
        <label className="inline-flex items-center">
          <Radio name="type" checked={type === 'pickup'} onChange={() => onTypeChange?.('pickup')} />
          <RadioLabel>Pickup</RadioLabel>
        </label>
        <label className="inline-flex items-center">
          <Radio name="type" checked={type === 'delivery'} onChange={() => onTypeChange?.('delivery')} />
          <RadioLabel>Delivery</RadioLabel>
        </label>
        <label className="inline-flex items-center">
          <Radio name="type" checked={type === 'all'} onChange={() => onTypeChange?.('all')} />
          <RadioLabel>All</RadioLabel>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-sm">
        {categories.map((c) => (
          <label key={c.id} className="inline-flex items-center">
            <Checkbox checked={!!c.checked} onChange={(e) => onCategoryToggle?.(c.id, e.currentTarget.checked)} />
            <CheckboxLabel>{c.label}</CheckboxLabel>
          </label>
        ))}
      </div>

      <Switch label="Promo" checked={promoOnly} onChange={(e) => onPromoToggle?.(e.currentTarget.checked)} />
    </div>
  )
}
