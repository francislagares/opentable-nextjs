import { Review } from '@prisma/client';

import ReviewCard from './ReviewCard';

const Reviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div>
      <h1 className='font-bold text-3xl mt-10 mb-7 borber-b pb-5'>
        What {reviews.length} {reviews.length === 1 ? 'person' : 'people'}{' '}
        people are saying
      </h1>
      <div>
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
