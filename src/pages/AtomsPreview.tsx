import { Container } from '../ui/container';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Link } from '../ui/link';
import { Divider } from '../ui/divider';
import { Spinner } from '../ui/spinner';
import { Skeleton } from '../ui/skeleton';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import { IconButton } from '../ui/icon-button';
import { Image } from '../ui/image';
import { Avatar } from '../ui/avatar';
import { Star } from '../ui/star';
import { Dot } from '../ui/dot';
import { Switch } from '../ui/switch';
import { Checkbox, CheckboxLabel } from '../ui/checkbox';
import { Radio, RadioLabel } from '../ui/radio';
import { Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TooltipContent } from '../ui/tooltip';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { formatCurrency } from '../lib/format';
import { Search, ShoppingCart, Heart } from 'lucide-react';

export default function AtomsPreview() {
  return (
    <Container className='py-2xl space-y-2xl'>
      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Button</div>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-sm'>
          <Button>Primary</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='neutral'>Neutral</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='danger'>Danger</Button>
          <Button variant='link'>Link</Button>
          <Button size='sm'>Small</Button>
          <Button size='lg'>Large</Button>
          <IconButton aria-label='Search'>
            <Search size={18} />
          </IconButton>
          <IconButton variant='primary' aria-label='Cart'>
            <ShoppingCart size={18} />
          </IconButton>
          <IconButton variant='ghost' aria-label='Fav'>
            <Heart size={18} />
          </IconButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Inputs</div>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-lg'>
          <div className='space-y-sm'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' placeholder='Your name' />
          </div>
          <div className='space-y-sm'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='email@example.com'
              variant='success'
            />
          </div>
          <div className='space-y-sm md:col-span-2'>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea id='bio' placeholder='Tell us about you' />
          </div>
          <div className='space-y-sm'>
            <Label>Select</Label>
            <Select defaultValue='popular'>
              <SelectTrigger>
                <SelectValue placeholder='Choose' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='popular'>Popular</SelectItem>
                <SelectItem value='price-asc'>Price ↑</SelectItem>
                <SelectItem value='price-desc'>Price ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-sm'>
            <Label>Checkbox & Radio</Label>
            <div className='flex items-center gap-md'>
              <label className='inline-flex items-center'>
                <Checkbox defaultChecked />
                <CheckboxLabel>Recommended</CheckboxLabel>
              </label>
              <label className='inline-flex items-center'>
                <Radio name='cat' defaultChecked />
                <RadioLabel>Burger</RadioLabel>
              </label>
            </div>
            <Switch label='Promo' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Feedback</div>
        </CardHeader>
        <CardContent className='space-y-md'>
          <div className='flex items-center gap-md'>
            <Spinner />
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-6 w-40' />
          </div>
          <Alert>Info message</Alert>
          <Alert variant='success'>Success message</Alert>
          <Alert variant='warning'>Warning message</Alert>
          <Alert variant='error'>Error message</Alert>
          <div className='flex items-center gap-sm'>
            <Badge>Default</Badge>
            <Badge variant='primary'>Primary</Badge>
            <Badge variant='success'>Success</Badge>
            <Badge variant='warning'>Warning</Badge>
            <Badge variant='error'>Error</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Media & Icons</div>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-lg'>
          <div className='space-y-sm'>
            <Image
              alt='Food'
              src='https://images.unsplash.com/photo-1606756790138-6fb5d4b3c6fb?w=600&q=80'
              className='h-32'
            />
            <Image alt='Invalid' src='' className='h-32' />
          </div>
          <div className='space-y-sm'>
            <Avatar name='John Doe' />
            <Avatar name='Jane' src='https://i.pravatar.cc/100' />
          </div>
          <div className='space-y-sm'>
            <div className='flex items-center gap-xxs'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} filled={i < 4} />
              ))}
            </div>
            <div className='flex items-center gap-xxs'>
              <Dot />
              <Dot active />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Typography & Misc</div>
        </CardHeader>
        <CardContent className='space-y-md'>
          <div className='space-x-md'>
            <Link href='#'>Primary link</Link>
            <Link href='#' variant='muted'>
              Muted link
            </Link>
            <Link href='#' variant='underline'>
              Underline
            </Link>
          </div>
          <Divider />
          <div className='text-md'>{formatCurrency(45000, 'IDR')}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='neutral'>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip text</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    </Container>
  );
}
