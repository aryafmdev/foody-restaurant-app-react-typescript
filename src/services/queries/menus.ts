import { useQuery } from '@tanstack/react-query'
import { http } from '../api/http'
import { z } from 'zod'
import { MenuItemSchema } from '../../types/schemas'

const MenusSchema = z.array(MenuItemSchema)

const fetchMenus = async () => {
  const res = await http.get('/menus')
  return MenusSchema.parse(res.data)
}

export const useMenusQuery = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
  })
}
