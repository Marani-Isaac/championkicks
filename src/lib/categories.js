/** Strict product categories allowed by the Champion Kicks API / admin UI */
export const PRODUCT_CATEGORIES = [
  { value: 'menshoes', label: "Men's Shoes", group: 'shoes', gender: 'men' },
  { value: 'wemenshoes', label: "Women's Shoes", group: 'shoes', gender: 'women' },
  { value: 'kidsshoes', label: "Kids' Shoes", group: 'shoes', gender: 'kids' },
  { value: 'menclothings', label: "Men's Clothing", group: 'clothing', gender: 'men' },
  { value: 'wemenclothings', label: "Women's Clothing", group: 'clothing', gender: 'women' },
  { value: 'kidsclothings', label: "Kids' Clothing", group: 'clothing', gender: 'kids' },
]

export const CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value)

export function getCategoryLabel(value) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function isValidCategory(value) {
  return CATEGORY_VALUES.includes(value)
}
