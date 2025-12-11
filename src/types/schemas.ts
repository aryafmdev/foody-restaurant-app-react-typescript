import { z } from 'zod';

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatar: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  createdAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const RestaurantSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: z.number(),
  place: z.string().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;

export const MenuSchema = z.object({
  id: z.number(),
  foodName: z.string(),
  price: z.number(),
  type: z.string(),
  image: z.string().optional(),
});

export type Menu = z.infer<typeof MenuSchema>;

export const CartItemDetailSchema = z.object({
  id: z.number(),
  menu: MenuSchema,
  quantity: z.number(),
  itemTotal: z.number(),
});

export type CartItemDetail = z.infer<typeof CartItemDetailSchema>;

export const CartGroupSchema = z.object({
  restaurant: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().optional(),
  }),
  items: z.array(CartItemDetailSchema),
  subtotal: z.number(),
});

export type CartGroup = z.infer<typeof CartGroupSchema>;

export const CartSummarySchema = z.object({
  totalItems: z.number(),
  totalPrice: z.number(),
  restaurantCount: z.number(),
});

export type CartSummary = z.infer<typeof CartSummarySchema>;

export const GetCartResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    cart: z.array(CartGroupSchema),
    summary: CartSummarySchema,
  }),
});

export type GetCartResponse = z.infer<typeof GetCartResponseSchema>;

export const AddCartItemResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    cartItem: z.object({
      id: z.number(),
      restaurant: z.object({
        id: z.number(),
        name: z.string(),
        logo: z.string().optional(),
      }),
      menu: MenuSchema,
      quantity: z.number(),
      itemTotal: z.number(),
    }),
  }),
});

export type AddCartItemResponse = z.infer<typeof AddCartItemResponseSchema>;

export const TransactionPricingSchema = z.object({
  subtotal: z.number(),
  serviceFee: z.number(),
  deliveryFee: z.number(),
  totalPrice: z.number(),
});

export type TransactionPricing = z.infer<typeof TransactionPricingSchema>;

export const TransactionRestaurantItemSchema = z.object({
  menuId: z.number(),
  menuName: z.string(),
  price: z.number(),
  quantity: z.number(),
  itemTotal: z.number(),
  image: z.string().optional(),
});

export type TransactionRestaurantItem = z.infer<
  typeof TransactionRestaurantItemSchema
>;

export const TransactionRestaurantSchema = z.object({
  restaurant: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().optional(),
  }),
  items: z.array(TransactionRestaurantItemSchema),
  subtotal: z.number().optional(),
});

export type TransactionRestaurant = z.infer<typeof TransactionRestaurantSchema>;

export const TransactionSchema = z.object({
  id: z.number().optional(),
  transactionId: z.string(),
  paymentMethod: z.string().optional(),
  status: z.enum(['preparing', 'on_the_way', 'delivered', 'done', 'cancelled']),
  pricing: TransactionPricingSchema.optional(),
  restaurants: z.array(TransactionRestaurantSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deliveryAddress: z.string().optional(),
  phone: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CheckoutResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ transaction: TransactionSchema }),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const UpdateOrderStatusResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    order: z.object({
      id: z.number(),
      transactionId: z.string(),
      status: z.string(),
      updatedAt: z.string(),
    }),
  }),
});

export type UpdateOrderStatusResponse = z.infer<
  typeof UpdateOrderStatusResponseSchema
>;

export const RestaurantListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: z.number(),
  place: z.string().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  reviewCount: z.number().optional(),
  menuCount: z.number().optional(),
  priceRange: z.object({ min: z.number(), max: z.number() }).optional(),
  distance: z.number().optional(),
  coordinates: z.object({ lat: z.number(), long: z.number() }).optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export type RestaurantListItem = z.infer<typeof RestaurantListItemSchema>;

export const RestaurantListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    restaurants: z.array(RestaurantListItemSchema),
    pagination: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  }),
});

export type RestaurantListResponse = z.infer<
  typeof RestaurantListResponseSchema
>;

export const RecommendedRestaurantsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    recommendations: z.array(
      RestaurantListItemSchema.extend({
        sampleMenus: z.array(MenuSchema).optional(),
        isFrequentlyOrdered: z.boolean().optional(),
      })
    ),
    message: z.string().optional(),
  }),
});

export type RecommendedRestaurantsResponse = z.infer<
  typeof RecommendedRestaurantsResponseSchema
>;

export const RestaurantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: z.number(),
  averageRating: z.number().optional(),
  place: z.string().optional(),
  coordinates: z.object({ lat: z.number(), long: z.number() }).optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  totalMenus: z.number().optional(),
  totalReviews: z.number().optional(),
  menus: z.array(MenuSchema).optional(),
  reviews: z
    .array(
      z.object({
        id: z.number(),
        star: z.number(),
        comment: z.string().optional(),
        createdAt: z.string().optional(),
        user: z.object({ id: z.number(), name: z.string() }).optional(),
      })
    )
    .optional(),
});

export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;

export const RestaurantDetailResponseSchema = z.object({
  success: z.boolean(),
  data: RestaurantDetailSchema,
});

export type RestaurantDetailResponse = z.infer<
  typeof RestaurantDetailResponseSchema
>;

export const ReviewSchema = z.object({
  id: z.number(),
  star: z.number(),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  user: z.object({ id: z.number(), name: z.string() }).optional(),
  restaurant: z
    .object({ id: z.number(), name: z.string(), logo: z.string().optional() })
    .optional(),
  transactionId: z.string().optional(),
  menus: z
    .array(
      z.object({
        menuId: z.number(),
        menuName: z.string(),
        price: z.number(),
        type: z.string(),
        image: z.string().optional(),
        quantity: z.number(),
      })
    )
    .optional(),
});

export type Review = z.infer<typeof ReviewSchema>;

export const CreateReviewResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({ review: ReviewSchema }),
});

export type CreateReviewResponse = z.infer<typeof CreateReviewResponseSchema>;

export const RestaurantReviewsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    restaurant: z.object({
      id: z.number(),
      name: z.string(),
      star: z.number().optional(),
    }),
    reviews: z.array(ReviewSchema),
    statistics: z
      .object({
        totalReviews: z.number(),
        averageRating: z.number(),
        ratingDistribution: z.record(z.string(), z.number()).optional(),
      })
      .optional(),
    pagination: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  }),
});

export type RestaurantReviewsResponse = z.infer<
  typeof RestaurantReviewsResponseSchema
>;

export const MyReviewsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    reviews: z.array(ReviewSchema),
    pagination: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  }),
});

export type MyReviewsResponse = z.infer<typeof MyReviewsResponseSchema>;

export const UpdateReviewResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ review: ReviewSchema }),
});

export type UpdateReviewResponse = z.infer<typeof UpdateReviewResponseSchema>;

export const DeleteReviewResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type DeleteReviewResponse = z.infer<typeof DeleteReviewResponseSchema>;

export const SuccessEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});
export const ErrorEnvelopeSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
});

export type SuccessEnvelope = z.infer<typeof SuccessEnvelopeSchema>;
export type ErrorEnvelope = z.infer<typeof ErrorEnvelopeSchema>;
