import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/container';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { SidebarProfile } from '../components';
import {
  useMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../services/queries/reviews';
import { ReviewCard } from '../components';
import { Dialog, DialogContent } from '../ui/dialog';
import GiveReviewCard from '../components/GiveReviewCard';

export default function MyReviews() {
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoggedIn = !!token;
  useEffect(() => {
    if (!isLoggedIn) navigate('/login?tab=signin&redirect=/my-reviews');
  }, [isLoggedIn, navigate]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, isError } = useMyReviewsQuery({ page, limit });
  const reviews = useMemo(() => data?.data?.reviews ?? [], [data]);
  const canShowMore = (data?.data?.pagination?.total ?? 0) > reviews.length;

  const upd = useUpdateReviewMutation();
  const del = useDeleteReviewMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    id: number;
    star: number;
    comment?: string;
  } | null>(null);
  const [editStar, setEditStar] = useState(0);
  const [editComment, setEditComment] = useState('');
  const openEdit = (id: number, star: number, comment?: string) => {
    setEditTarget({ id, star, comment });
    setEditStar(star);
    setEditComment(comment ?? '');
    setEditOpen(true);
  };
  const submitEdit = () => {
    if (!editTarget) return;
    upd.mutate(
      {
        id: editTarget.id,
        star: editStar,
        comment: editComment.trim() || undefined,
      },
      { onSuccess: () => setEditOpen(false) }
    );
  };

  const onDelete = (id: number) => {
    if (!confirm('Delete this review?')) return;
    del.mutate(id);
  };

  return (
    <>
      <Container className='py-3xl max-w-[1200px]'>
        <div className='md:grid md:grid-cols-[240px_1fr] gap-3xl items-start'>
          <div className='hidden md:block md:w-[240px]'>
            <SidebarProfile
              name={'user'}
              onProfile={() => navigate('/profile')}
              onDeliveryAddress={() => navigate('/address')}
              onMyOrders={() => navigate('/orders')}
              onMyReviews={() => navigate('/my-reviews')}
              onLogout={() => navigate('/login')}
              insideDialog={false}
              className='w-full md:w-[240px]'
              activeItem='my_reviews'
            />
          </div>

          <div className='md:col-span-1'>
            <div className='text-display-md font-extrabold text-neutral-950'>
              My Reviews
            </div>

            {isLoading ? (
              <div className='mt-5xl grid grid-cols-1 md:grid-cols-2 gap-2xl'>
                {[0, 1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className='rounded-lg border-neutral-200 md:shadow-lg'
                  >
                    <CardContent className='p-2xl space-y-md'>
                      <Skeleton className='h-14 w-14 rounded-full' />
                      <Skeleton className='h-4 w-40' />
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-4 w-full' />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <div className='mt-5xl'>
                <Alert variant='error'>Failed to load reviews</Alert>
              </div>
            ) : reviews.length === 0 ? (
              <div className='mt-5xl'>
                <Alert variant='info'>You have no reviews yet</Alert>
              </div>
            ) : (
              <div className='mt-xl grid grid-cols-1 md:grid-cols-2 gap-2xl'>
                {reviews.map((rv) => (
                  <div key={rv.id} className='space-y-md'>
                    <ReviewCard
                      name={rv.restaurant?.name ?? 'Restaurant'}
                      rating={rv.star}
                      comment={rv.comment ?? ''}
                      date={rv.updatedAt ?? rv.createdAt}
                    />
                    <div className='inline-flex items-center gap-sm'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='rounded-full md:w-[20px] hover:bg-accent-green hover:text-white'
                        onClick={() => openEdit(rv.id, rv.star, rv.comment)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='rounded-full md:w-[20px] hover:bg-accent-red hover:text-white'
                        onClick={() => onDelete(rv.id)}
                        disabled={del.isPending}
                      >
                        Delete
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='rounded-full md:hidden lg:inline lg:w-10 hover:bg-primary hover:text-white'
                        onClick={() =>
                          navigate(`/restaurant/${rv.restaurant?.id ?? ''}`)
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {canShowMore ? (
              <div className='mt-2xl flex justify-center'>
                <Button variant='neutral' onClick={() => setPage(page + 1)}>
                  Show More
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Container>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className='rounded-2xl p-xl w-[92%] max-w-[400px] mx-auto'>
          <GiveReviewCard
            title='Edit Review'
            rating={editStar}
            onRatingChange={setEditStar}
            comment={editComment}
            onCommentChange={setEditComment}
            onSubmit={submitEdit}
            pending={upd.isPending}
            disabled={!editTarget || editStar <= 0}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
