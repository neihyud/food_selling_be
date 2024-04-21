const configs = require('../config')
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const stripe = require('stripe')(configs.stripePrivateKey)

exports.createOrder = async (req, res) => {

}

const validationAddress = (data) => {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    email: data.email,
    address: data.address
  }
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId
    const { address, items: listCartItems, payment } = req.body

    const subTotal = listCartItems.reduce((total, curr) => {
      const currentPrice = curr.offer_price ? curr.offer_price : curr.price
      return total + (curr.quantity * currentPrice)
    }, 0)

    const order = new Order({
      user_id: userId,
      address: JSON.stringify(validationAddress(address)),
      sub_total: subTotal,
      order_status: 'pending',
      payment_method: payment,
      payment_status: 'pending'
    })

    const orderTemp = await order.save()

    const orderItems = []
    listCartItems.forEach((item) => {
      const newOrderItem = new OrderItem({
        order_id: orderTemp.id,
        product_name: item.name,
        price: item.offer_price * 100 || item.price * 100,
        qty: item.quantity
      })
      console.log('item.offer_price == ', item.offer_price * 100)

      orderItems.push(newOrderItem.save())
    })

    await Promise.all(orderItems)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: listCartItems.map(item => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name
            },
            unit_amount: item.offer_price * 100 || item.price * 100
          },
          quantity: item.quantity
        }
      }),
      success_url: `${process.env.CLIENT_URL}/order/success?order_id=${orderTemp.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order/cancel`
    })

    // const orderItems

    console.log('session: ', session)
    res.status(200).send({ url: session.url })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
}

exports.stripeSuccess = async (req, res) => {
  const { session_id: sessionId, order_id: orderId } = req.body

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  const paymentStatus = session.payment_status

  if (paymentStatus === 'paid') {
    const dataUpdate = {
      payment_status: 'completed',
      transaction_id: session.payment_intent
    }

    await Order.findOneAndUpdate({ _id: orderId }, dataUpdate)
  } else {
    await Order.findOneAndUpdate({ _id: orderId }, { payment_status: 'fail' })
  }

  return res.status(200).send({ data: session })
}

exports.getListOrder = async (req, res) => {
  const userId = req.userId
  const listOrder = await Order.find({ user_id: userId })

  return res.status(200).send(listOrder)
}

exports.getListOrderItem = async (req, res) => {
  const { orderId } = req.params

  const data = await OrderItem.find({ order_id: orderId })

  return res.status(200).send(data)
}

exports.getListOrderAdmin = async (req, res) => {
  const listOrder = await Order.find({})

  return res.status(200).send(listOrder)
}
