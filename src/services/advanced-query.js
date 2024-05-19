const Product = require('../models/Product')
const mongoose = require('mongoose')
const Review = require('../models/Review')
const OrderItem = require('../models/OrderItem')
const Order = require('../models/Order')

// const getProductsInfo = async () => {
//   try {
//     const products = await Product.aggregate([
//       {
//         $lookup: {
//           from: 'reviews',
//           localField: '_id',
//           foreignField: 'product_id',
//           as: 'reviews'
//         }
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category_id',
//           foreignField: '_id',
//           as: 'category'
//         }
//       },
//       {
//         $unwind: {
//           path: '$category',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $addFields: {
//           average_rating: {
//             $avg: '$reviews.rate'
//           },
//           reviews_count: {
//             $size: '$reviews'
//           }
//         }
//       },
//       {
//         $project: {
//           id: 1,
//           name: 1,
//           description: 1,
//           thumb_img: 1,
//           price: 1,
//           offer_price: 1,
//           quantity: 1,
//           sku: 1,
//           status: 1,
//           average_rating: 1,
//           reviews_count: 1,
//           category: {
//             id: '$category._id',
//             name: '$category.name',
//             description: '$category.description',
//             status: '$category.status'
//           }
//         }
//       }
//     ])

//     return products
//   } catch (err) {
//     console.error(err)
//   }
// }

const getProductsInfo = async (query) => {
  try {
    const matchConditions = [{ status: 1 }]

    if (query?.search && query.search.trim() !== '') {
      // const regex = new RegExp(query.search, 'i')
      //     filter.name = { $regex: regex }
      matchConditions.push({
        $or: [
          // { name: { $regex: query.search, $options: 'i' } },
          { name: { $regex: new RegExp(query.search, 'i') } },
          { 'category.name': { $regex: new RegExp(query.search, 'i') } }
          // { 'category.name': { $regex: query.search, $options: 'i' } }
        ]
      })
    }

    if (query?.categoryId) {
      matchConditions.push({
        category_id: new mongoose.Types.ObjectId(query.categoryId)
      })
    }

    if (query?.productId) {
      matchConditions.push({
        _id: new mongoose.Types.ObjectId(query.productId)
      })
    }

    if (query?.productIds) {
      matchConditions.push({
        _id: { $in: query?.productIds }
      })
    }

    const products = await Product.aggregate([
      ...(matchConditions.length > 0 ? [{ $match: { $and: matchConditions } }] : []),
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'product_id',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          average_rating: {
            $avg: '$reviews.rate'
          },
          reviews_count: {
            $size: '$reviews'
          }
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          thumb_img: 1,
          price: 1,
          offer_price: 1,
          quantity: 1,
          sku: 1,
          status: 1,
          average_rating: 1,
          reviews_count: 1,
          category: {
            id: '$category._id',
            name: '$category.name',
            description: '$category.description',
            status: '$category.status'
          }
        }
      }
    ])

    return products
  } catch (error) {
    console.log(error)
    return error
  }
}

const oneMonthAgo = new Date()
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

const getTopRateProduct = async (query) => {
  const products = await Review.aggregate([
    {
      $match: {
        createdAt: { $gte: oneMonthAgo }
      }
    },
    {
      $group: {
        _id: '$product_id',
        averageRating: { $avg: '$rate' }
      }
    },
    {
      $sort: {
        averageRating: -1
      }
    },
    {
      $limit: 3
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo'
      }
    }
  ])

  return products
}

const getTopPopularProduct = async (limit) => {
  try {
    const topProducts = await OrderItem.aggregate([
      // {
      //   $match: {
      //     createdAt: { $gte: oneMonthAgo }
      //   }
      // },
      {
        $group: {
          _id: '$product_id',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit || 3
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $project: {
          _id: 0,
          count: 1,
          productDetails: {
            _id: 1,
            name: 1,
            price: 1,
            offer_price: 1,
            thumb_img: 1
          }
        }
      }
    ])

    return topProducts
  } catch (error) {
    console.error(error)
    return []
  }
}

const getTopPopularProductUser = async () => {
  try {
    const listProductPopular = await getTopPopularProduct(8)

    const listProductId = listProductPopular?.map((product) => {
      return product?.productDetails?._id
    }) || []

    const infoProduct = await getProductsInfo({ productIds: listProductId })

    return infoProduct
  } catch (error) {
    console.error(error)
    return []
  }
}

const getTotalSubTotalOfCompletedOrders = async () => {
  try {
    const result = await Order.aggregate([
      {
        $match: { order_status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalSubTotal: { $sum: '$sub_total' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSubTotal: 1
        }
      }
    ])

    return result.length > 0 ? result[0].totalSubTotal : 0
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getTopPopularProductWithCategoryId = async (categoryId) => {
  try {
    const topProducts = await OrderItem.aggregate([
      // {
      //   $match: {
      //     createdAt: { $gte: oneMonthAgo }
      //   }
      // },
      {
        $group: {
          _id: '$product_id',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $match: {
          'productDetails.category_id': new mongoose.Types.ObjectId(categoryId)
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 3
      },
      {
        $project: {
          _id: 0,
          count: 1,
          productDetails: {
            _id: 1
          }
        }
      }
    ])

    const listProductId = topProducts?.map((product) => {
      return product?.productDetails?._id
    }) || []

    const infoProduct = await getProductsInfo({ productIds: listProductId })

    return infoProduct
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = {
  getProductsInfo,
  getTopRateProduct,
  getTopPopularProduct,
  getTotalSubTotalOfCompletedOrders,
  getTopPopularProductWithCategoryId,
  getTopPopularProductUser
}
