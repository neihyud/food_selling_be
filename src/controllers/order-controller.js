/* eslint-disable camelcase */
const configs = require('../config')
const Order = require('../models/Order')
const User = require('../models/User')
const OrderItem = require('../models/OrderItem')
const { getTotalSubTotalOfCompletedOrders } = require('../services/advanced-query')
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
        price: item.offer_price || item.price,
        qty: item.quantity,
        product_id: item.id || item._id
      })

      orderItems.push(newOrderItem.save())
    })

    await Promise.all(orderItems)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: listCartItems.map(item => {
        return {
          price_data: {
            currency: 'VND',
            product_data: {
              name: item.name
            },
            unit_amount: item.offer_price || item.price
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

exports.refundPayment = async (req, res) => {
  const { id } = req.params

  const order = await Order.findOne({ _id: id }).select('transaction_id')

  const paymentIntentId = order.transaction_id
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId
    })
    await Order.findOneAndUpdate({ _id: id }, { order_status: 'declined' })
    return res.status(200).send({ success: true })

    // if (refund.success) {
    //   await Order.findOneAndUpdate({ _id: id }, { order_status: 'declined' })
    //   return res.status(200).send({ success: true })
    // }

    // return res.status(400).send({ success: false, message: 'Refund fail!' })
  } catch (error) {
    console.error('Error creating refund:', error)
    return res.status(200).send({ success: true })

    // return res.status(400).send({ success: false, message: 'Refund fail!' })
  }
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
  const listOrder = await Order.find({}).populate({ path: 'user_id', select: 'name' })

  return res.status(200).send(listOrder)
}

exports.getListOrderAdminPend = async (req, res) => {
  const listOrder = await Order.find({ order_status: 'pending' })

  return res.status(200).send(listOrder)
}

exports.getListOrderAdminDelivered = async (req, res) => {
  const listOrder = await Order.find({ order_status: 'complete' })
  return res.status(200).send(listOrder)
}

exports.getListOrderAdminDeclined = async (req, res) => {
  const listOrder = await Order.find({ order_status: 'declined' })
  return res.status(200).send(listOrder)
}

exports.getListOrderAdminInProcess = async (req, res) => {
  const listOrder = await Order.find({ order_status: 'in_process' })
  return res.status(200).send(listOrder)
}

exports.getListOrderAdminToday = async (req, res) => {
  const listOrder = await Order.find({})

  return res.status(200).send(listOrder)
}

// admin
exports.getOrder = async (req, res) => {
  const { id } = req.params
  const order = await Order.findOne({ _id: id })

  return res.status(200).send(order)
}

exports.updateOrder = async (req, res) => {
  const { id } = req.params
  const { order_status, payment_status } = req.body
  const dataUpdate = { }

  if (order_status) {
    dataUpdate.order_status = order_status
  }

  if (payment_status) {
    dataUpdate.payment_status = payment_status
  }
  const order = await Order.findOneAndUpdate({ _id: id }, dataUpdate)

  return res.status(200).send(order)
}

exports.getInfoDashboard = async (req, res) => {
  const orderCount = await Order.countDocuments()
  const userCount = await User.countDocuments({ role: 'user' })

  const earnCount = await getTotalSubTotalOfCompletedOrders()

  return res.status(200).send({ orderCount, userCount, earnCount })
}

exports.getInfoStatusOrder = async (req, res) => {
  const orderCountSuccess = await Order.countDocuments({ order_status: 'success' })
  const orderCountInProcess = await Order.countDocuments({ order_status: 'pending' })
  const orderCountDelivered = await Order.countDocuments({ order_status: 'delivered' })
  const orderCountDeclined = await Order.countDocuments({ order_status: 'declined' })

  return res.status(200).send({ orderCountSuccess, orderCountInProcess, orderCountDelivered, orderCountDeclined })
}

exports.getInfoStatusOrderUser = async (req, res) => {
  const userId = req.userId

  const orderCount = await Order.countDocuments({ user_id: userId })

  const orderCountSuccess = await Order.countDocuments({ order_status: 'delivered', user_id: userId })
  const orderCountInProcess = await Order.countDocuments({ order_status: 'pending', user_id: userId })
  const orderCountDeclined = await Order.countDocuments({ order_status: 'declined', user_id: userId })

  return res.status(200).send({ orderCount, orderCountSuccess, orderCountInProcess, orderCountDeclined })
}
