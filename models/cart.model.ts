import Product from './product.model'

class Cart {
  items: ICart[];
  totalQuantity: number;
  totalPrice: number;

  constructor(items: ICart[] = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items
    this.totalQuantity = totalQuantity
    this.totalPrice = totalPrice
  }

  async updatePrices(): Promise<void> {
    const productIds = this.items.map((item) => item.product.id)

    const products = await Product.findMultiple(productIds)

    const deletableCartItemProductIds: string[] = []

    for (const cartItem of this.items) {
      const product = products.find((prod: IProduct) => prod._id === cartItem.product.id)

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id)
        continue
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0
      })
    }

    // recalculate cart totals
    this.totalQuantity = 0
    this.totalPrice = 0

    for (const item of this.items) {
      this.totalQuantity += item.quantity
      this.totalPrice += item.totalPrice
    }
  }

  addItem(product: Product): void {
    const cartItem: ICart = {
      product: product,
      quantity: 1,
      totalPrice: product.price
    }

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (item.product.id === product.id) {
        cartItem.quantity = item.quantity + 1
        cartItem.totalPrice += product.price
        this.items[i] = cartItem

        this.totalQuantity++
        this.totalPrice += product.price
        return
      }
    }

    this.items.push(cartItem)
    this.totalQuantity++
    this.totalPrice += product.price
  }

  updateItem(productId: string, newQuantity: number): { updatedItemPrice: number } | void  {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item }
        const quantityChange = newQuantity - item.quantity

        cartItem.quantity = newQuantity
        cartItem.totalPrice = newQuantity * item.product.price
        
        this.items[i] = cartItem

        this.totalQuantity = this.totalQuantity + quantityChange
        this.totalPrice += quantityChange * item.product.price
      
        return { updatedItemPrice: cartItem.totalPrice }
      
      } else if (item.product.id === productId && newQuantity <= 0) {
      
        this.items.splice(i, 1)
        this.totalQuantity -= item.quantity
        this.totalPrice -= item.totalPrice
      
        return { updatedItemPrice: 0 }
      }
    }
  }
}

export default Cart
