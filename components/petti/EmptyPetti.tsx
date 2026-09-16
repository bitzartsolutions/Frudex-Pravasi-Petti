import { Icon } from "@/components/ui/Icon";

export function EmptyPetti() {
  return (
    <div className="text-center py-12 space-y-2">
      <Icon name="shopping_basket" className="text-outline" size={48} />
      <p className="font-headline-sm text-headline-sm text-primary">Your Hamper Is Empty</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Choose your preferred dates, nuts, and chocolates to build a memorable diaspora gift.
      </p>
    </div>
  );
}
