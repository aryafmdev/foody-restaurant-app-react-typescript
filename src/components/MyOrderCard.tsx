import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import storeImg from '../assets/images/store.png';
import itemDefaultImg from '../assets/images/image.png';
import { Image } from '../ui/image';
import { Button } from '../ui/button';
import { formatCurrency } from '../lib/format';

type OrderItem = {
  title: string;
  unitPrice: number;
  imageUrl?: string | null;
  quantity: number;
};

type MyOrderCardProps = {
  storeName: string;
  items: OrderItem[];
  onGiveReview?: () => void;
  className?: string;
};

export default function MyOrderCard({ storeName, items, onGiveReview, className }: MyOrderCardProps) {
  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  return (
    <Card className={["rounded-lg shadow-md border border-neutral-200", className].filter(Boolean).join(" ")}> 
      <CardHeader className="p-2xl pb-xl border-none">
        <div className="inline-flex items-center gap-sm">
          <img src={storeImg} alt="Store" className="h-6 w-6" />
          <span className="text-md md:text-lg font-bold text-neutral-950">{storeName}</span>
        </div>
      </CardHeader>
      <CardContent className="p-2xl">
        <div className="space-y-2xl">
          {items.map((it, i) => (
            <div key={`${it.title}-${i}`} className="flex items-center gap-md">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-neutral-200">
                <Image alt={it.title} src={it.imageUrl ?? itemDefaultImg} className="h-full w-full" />
              </div>
              <div>
                <div className="text-md text-neutral-900">{it.title}</div>
                <div className="text-md font-extrabold text-neutral-900">{`${it.quantity} x ${formatCurrency(it.unitPrice, 'IDR')}`}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2xl border-t border-neutral-300 border-dashed" />
      </CardContent>
      <CardFooter className="p-2xl pt-xl border-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <div className="text-sm text-neutral-700">Total</div>
            <div className="text-md font-extrabold text-neutral-900">{formatCurrency(total, 'IDR')}</div>
          </div>
          <Button variant="primary" size="md" className="mt-lg md:mt-0 w-full md:w-auto" onClick={onGiveReview}>Give Review</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
