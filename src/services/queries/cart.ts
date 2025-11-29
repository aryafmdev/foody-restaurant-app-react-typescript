import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../api/http';
import {
  GetCartResponseSchema,
  AddCartItemResponseSchema,
} from '../../types/schemas';
import type { GetCartResponse } from '../../types/schemas';

type PendingItem = {
  restaurantId: number;
  restaurantName?: string;
  restaurantLogo?: string;
  menuId: number;
  menuName?: string;
  menuPrice?: number;
  menuImage?: string;
  quantity: number;
  ts: number;
};

function k(u: string) {
  return `cart_pending_${u}`;
}
function lp(u: string): PendingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(k(u));
    return raw ? (JSON.parse(raw) as PendingItem[]) : [];
  } catch {
    return [];
  }
}
function sp(u: string, arr: PendingItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(k(u), JSON.stringify(arr));
  } catch {
    return;
  }
}
function up(u: string, item: PendingItem) {
  const arr = lp(u);
  const idx = arr.findIndex(
    (e) => e.restaurantId === item.restaurantId && e.menuId === item.menuId
  );
  const ts = Date.now();
  if ((item.quantity ?? 0) <= 0) {
    const next = arr.filter(
      (e) => !(e.restaurantId === item.restaurantId && e.menuId === item.menuId)
    );
    sp(u, next);
    return;
  }
  const record: PendingItem = { ...arr[idx], ...item, ts } as PendingItem;
  if (idx >= 0) {
    arr[idx] = record;
    sp(u, arr);
  } else {
    sp(u, [...arr, record]);
  }
}
function rm(u: string, restaurantId: number, menuId: number) {
  const arr = lp(u).filter(
    (e) => !(e.restaurantId === restaurantId && e.menuId === menuId)
  );
  sp(u, arr);
}
function clr(u: string) {
  sp(u, []);
}
export function getPendingQty(u: string, restaurantId: number, menuId: number) {
  const e = lp(u).find(
    (x) => x.restaurantId === restaurantId && x.menuId === menuId
  );
  return e?.quantity ?? 0;
}

function overlayCartWithPending(
  d: GetCartResponse,
  userKey: string
): GetCartResponse {
  const ops = lp(userKey);
  if (ops.length === 0) return d;
  let nextCart = d.data.cart.map((group) => {
    const rel = ops.filter((o) => o.restaurantId === group.restaurant.id);
    if (rel.length === 0) return group;
    const newItems: typeof group.items = [];
    for (const it of group.items) {
      const p = rel.find((o) => o.menuId === it.menu.id);
      if (p) {
        if (p.quantity <= 0) continue;
        const qty = p.quantity;
        newItems.push({
          ...it,
          quantity: qty,
          itemTotal: (it.menu.price ?? 0) * qty,
        });
      } else {
        newItems.push(it);
      }
    }
    const subtotal = newItems.reduce(
      (sum, i) =>
        sum + (i.itemTotal ?? (i.menu.price ?? 0) * (i.quantity ?? 0)),
      0
    );
    return { ...group, items: newItems, subtotal };
  });
  // Insert pending items not yet present from server
  for (const p of ops) {
    if (p.quantity <= 0) continue;
    const gi = nextCart.findIndex((g) => g.restaurant.id === p.restaurantId);
    if (gi >= 0) {
      const group = nextCart[gi];
      const exists = group.items.some((i) => i.menu.id === p.menuId);
      if (!exists) {
        const newItem = {
          id: Number(`${p.restaurantId}${p.menuId}`),
          menu: {
            id: p.menuId,
            foodName: p.menuName ?? 'Item',
            price: p.menuPrice ?? 0,
            type: 'food',
            image: p.menuImage ?? '',
          },
          quantity: p.quantity,
          itemTotal: (p.menuPrice ?? 0) * p.quantity,
        };
        nextCart[gi] = {
          ...group,
          items: [...group.items, newItem],
          subtotal: (group.subtotal ?? 0) + newItem.itemTotal,
        };
      }
    } else {
      nextCart = [
        ...nextCart,
        {
          restaurant: {
            id: p.restaurantId,
            name: p.restaurantName ?? 'Store',
            logo: p.restaurantLogo ?? '',
          },
          items: [
            {
              id: Number(`${p.restaurantId}${p.menuId}`),
              menu: {
                id: p.menuId,
                foodName: p.menuName ?? 'Item',
                price: p.menuPrice ?? 0,
                type: 'food',
                image: p.menuImage ?? '',
              },
              quantity: p.quantity,
              itemTotal: (p.menuPrice ?? 0) * p.quantity,
            },
          ],
          subtotal: (p.menuPrice ?? 0) * p.quantity,
        },
      ];
    }
  }
  nextCart = nextCart.filter((g) => g.items.length > 0);
  const summary = {
    totalItems: nextCart.reduce(
      (sum, g) => sum + g.items.reduce((s, it) => s + (it.quantity ?? 0), 0),
      0
    ),
    totalPrice: nextCart.reduce((sum, g) => sum + (g.subtotal ?? 0), 0),
    restaurantCount: nextCart.length,
  };
  return { success: d.success, data: { cart: nextCart, summary } };
}

export function useCartQuery(userId?: string | null, enabled: boolean = true) {
  const key = userId ?? 'guest';
  return useQuery({
    queryKey: ['cart', key],
    queryFn: async () => {
      const res = await http.get('/api/cart');
      return GetCartResponseSchema.parse(res.data);
    },
    enabled,
    select: (d) => overlayCartWithPending(d, key),
  });
}

type AddItemOptimistic = {
  restaurant: { id: number; name: string; logo?: string };
  menu: {
    id: number;
    foodName: string;
    price: number;
    type?: string;
    image?: string;
  };
  quantity?: number;
};

export function useAddToCartMutation(userKey?: string | null) {
  const qc = useQueryClient();
  const key = userKey ?? 'guest';
  return useMutation({
    mutationFn: async (vars: {
      body: { restaurantId: number; menuId: number; quantity?: number };
      optimistic?: AddItemOptimistic;
    }) => {
      const res = await http.post('/api/cart', vars.body);
      return AddCartItemResponseSchema.parse(res.data);
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ['cart', key] });
      if (vars.optimistic) {
        up(key, {
          restaurantId: vars.body.restaurantId,
          restaurantName: vars.optimistic.restaurant.name,
          restaurantLogo: vars.optimistic.restaurant.logo,
          menuId: vars.body.menuId,
          menuName: vars.optimistic.menu.foodName,
          menuPrice: vars.optimistic.menu.price,
          menuImage: vars.optimistic.menu.image,
          quantity: vars.body.quantity ?? 1,
          ts: Date.now(),
        });
      } else {
        const payload: PendingItem = {
          restaurantId: vars.body.restaurantId,
          menuId: vars.body.menuId,
          quantity: vars.body.quantity ?? 1,
          ts: Date.now(),
        };
        up(key, payload);
      }
      const previous = qc.getQueryData<GetCartResponse | undefined>([
        'cart',
        key,
      ]);
      qc.setQueryData<GetCartResponse | undefined>(['cart', key], (old) => {
        if (!old || !vars.optimistic) return old;
        const gIdx = old.data.cart.findIndex(
          (g) => g.restaurant.id === vars.optimistic!.restaurant.id
        );
        const item = {
          id: Date.now(),
          menu: {
            id: vars.optimistic.menu.id,
            foodName: vars.optimistic.menu.foodName,
            price: vars.optimistic.menu.price,
            type: vars.optimistic.menu.type ?? 'food',
            image: vars.optimistic.menu.image ?? '',
          },
          quantity: vars.optimistic.quantity ?? 1,
          itemTotal:
            (vars.optimistic.menu.price ?? 0) * (vars.optimistic.quantity ?? 1),
        };
        let nextCart = [...old.data.cart];
        if (gIdx >= 0) {
          const group = nextCart[gIdx];
          const exists = group.items.some((it) => it.menu.id === item.menu.id);
          nextCart[gIdx] = {
            ...group,
            items: exists ? group.items : [...group.items, item],
          };
        } else {
          nextCart = [
            ...nextCart,
            {
              restaurant: vars.optimistic.restaurant,
              items: [item],
              subtotal: item.itemTotal,
            },
          ];
        }
        nextCart = nextCart.map((g) => ({
          ...g,
          subtotal: g.items.reduce(
            (sum, it) =>
              sum + (it.itemTotal ?? (it.menu.price ?? 0) * (it.quantity ?? 0)),
            0
          ),
        }));
        const summary = {
          totalItems: nextCart.reduce(
            (sum, g) =>
              sum + g.items.reduce((s, it) => s + (it.quantity ?? 0), 0),
            0
          ),
          totalPrice: nextCart.reduce((sum, g) => sum + (g.subtotal ?? 0), 0),
          restaurantCount: nextCart.length,
        };
        return { success: old.success, data: { cart: nextCart, summary } };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      const prev = (ctx as { previous?: GetCartResponse })?.previous;
      if (prev) qc.setQueryData(['cart', key], prev);
    },
    onSettled: () => {
      const p = lp(key);
      if (p.length > 20) sp(key, p.slice(-20));
      qc.invalidateQueries({ queryKey: ['cart', key] });
    },
  });
}

export function useClearCartMutation(userKey?: string | null) {
  const qc = useQueryClient();
  const key = userKey ?? 'guest';
  return useMutation({
    mutationFn: async () => {
      const res = await http.delete('/api/cart');
      return res.data as { success: boolean; message?: string };
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['cart', key] });
      clr(key);
      const previous = qc.getQueryData<GetCartResponse | undefined>([
        'cart',
        key,
      ]);
      qc.setQueryData<GetCartResponse | undefined>(['cart', key], (old) => {
        if (!old) return old;
        return {
          success: old.success,
          data: {
            cart: [],
            summary: { totalItems: 0, totalPrice: 0, restaurantCount: 0 },
          },
        };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      const prev = (ctx as { previous?: GetCartResponse })?.previous;
      if (prev) qc.setQueryData(['cart', key], prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['cart', key] });
    },
  });
}

export function useUpdateCartItemMutation(userKey?: string | null) {
  const qc = useQueryClient();
  const key = userKey ?? 'guest';
  return useMutation<
    { success: boolean },
    Error,
    { id: number; quantity: number; optimistic?: AddItemOptimistic },
    { previous?: GetCartResponse }
  >({
    mutationFn: async (payload) => {
      const res = await http.put(`/api/cart/${payload.id}`, {
        quantity: payload.quantity,
      });
      return res.data as { success: boolean };
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['cart', key] });
      const previous = qc.getQueryData<GetCartResponse | undefined>([
        'cart',
        key,
      ]);
      if (previous) {
        const g = previous.data.cart.find((gr) =>
          gr.items.some((i) => i.id === payload.id)
        );
        const it = g?.items.find((i) => i.id === payload.id);
        if (g && it) {
          up(key, {
            restaurantId: g.restaurant.id,
            menuId: it.menu.id,
            quantity: payload.quantity,
            ts: Date.now(),
          });
        } else if (payload.optimistic) {
          up(key, {
            restaurantId: payload.optimistic.restaurant.id,
            menuId: payload.optimistic.menu.id,
            quantity: payload.quantity,
            ts: Date.now(),
          });
        }
      } else if (payload.optimistic) {
        up(key, {
          restaurantId: payload.optimistic.restaurant.id,
          menuId: payload.optimistic.menu.id,
          quantity: payload.quantity,
          ts: Date.now(),
        });
      }
      qc.setQueryData<GetCartResponse | undefined>(['cart', key], (old) => {
        if (!old) {
          if (!payload.optimistic) return old;
          const item = {
            id: Date.now(),
            menu: {
              id: payload.optimistic.menu.id,
              foodName: payload.optimistic.menu.foodName,
              price: payload.optimistic.menu.price,
              type: payload.optimistic.menu.type ?? 'food',
              image: payload.optimistic.menu.image ?? '',
            },
            quantity: payload.quantity,
            itemTotal:
              (payload.optimistic.menu.price ?? 0) * payload.quantity,
          };
          const nextCart = [
            {
              restaurant: payload.optimistic.restaurant,
              items: [item],
              subtotal: item.itemTotal,
            },
          ];
          const summary = {
            totalItems: nextCart.reduce(
              (sum, g) =>
                sum + g.items.reduce((s, it) => s + (it.quantity ?? 0), 0),
              0
            ),
            totalPrice: nextCart.reduce((sum, g) => sum + (g.subtotal ?? 0), 0),
            restaurantCount: nextCart.length,
          };
          return { success: true, data: { cart: nextCart, summary } };
        }
        const nextCart = old.data.cart.map((group) => ({
          ...group,
          items: group.items.map((it) =>
            it.id === payload.id
              ? {
                  ...it,
                  quantity: payload.quantity,
                  itemTotal: (it.menu.price ?? 0) * payload.quantity,
                }
              : it
          ),
        }));
        const withSubtotals = nextCart.map((g) => ({
          ...g,
          subtotal: g.items.reduce(
            (sum, it) =>
              sum + (it.itemTotal ?? (it.menu.price ?? 0) * (it.quantity ?? 0)),
            0
          ),
        }));
        const summary = {
          totalItems: withSubtotals.reduce(
            (sum, g) =>
              sum + g.items.reduce((s, it) => s + (it.quantity ?? 0), 0),
            0
          ),
          totalPrice: withSubtotals.reduce(
            (sum, g) => sum + (g.subtotal ?? 0),
            0
          ),
          restaurantCount: withSubtotals.length,
        };
        return { success: old.success, data: { cart: withSubtotals, summary } };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      const prev = (ctx as { previous?: GetCartResponse })?.previous;
      if (prev) qc.setQueryData(['cart', key], prev);
    },
    onSettled: () => {
      const p = lp(key);
      if (p.length > 20) sp(key, p.slice(-20));
      qc.invalidateQueries({ queryKey: ['cart', key] });
    },
  });
}

export function useDeleteCartItemMutation(userKey?: string | null) {
  const qc = useQueryClient();
  const key = userKey ?? 'guest';
  return useMutation<
    { success: boolean; message?: string },
    Error,
    { id: number },
    { previous?: GetCartResponse }
  >({
    mutationFn: async ({ id }) => {
      const res = await http.delete(`/api/cart/${id}`);
      return res.data as { success: boolean; message?: string };
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: ['cart', key] });
      const previous = qc.getQueryData<GetCartResponse | undefined>([
        'cart',
        key,
      ]);
      if (previous) {
        const g = previous.data.cart.find((gr) =>
          gr.items.some((i) => i.id === id)
        );
        const it = g?.items.find((i) => i.id === id);
        if (g && it) rm(key, g.restaurant.id, it.menu.id);
      }
      qc.setQueryData<GetCartResponse | undefined>(['cart', key], (old) => {
        if (!old) return old;
        const cartWithout = old.data.cart
          .map((group) => ({
            ...group,
            items: group.items.filter((it) => it.id !== id),
          }))
          .filter((g) => g.items.length > 0);
        const summary = {
          totalItems: cartWithout.reduce(
            (sum, g) =>
              sum + g.items.reduce((s, it) => s + (it.quantity ?? 0), 0),
            0
          ),
          totalPrice: cartWithout.reduce(
            (sum, g) =>
              sum +
              g.items.reduce(
                (s, it) =>
                  s +
                  (it.itemTotal ?? (it.menu.price ?? 0) * (it.quantity ?? 0)),
                0
              ),
            0
          ),
          restaurantCount: cartWithout.length,
        };
        return { success: old.success, data: { cart: cartWithout, summary } };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      const prev = (ctx as { previous?: GetCartResponse })?.previous;
      if (prev) qc.setQueryData(['cart', key], prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['cart', key] });
    },
  });
}
