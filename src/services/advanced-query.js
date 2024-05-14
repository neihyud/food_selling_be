const Product = require('../models/Product')
const mongoose = require('mongoose')

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
      matchConditions.push({
        $and: [
          { name: { $regex: query.search, $options: 'i' } },
          { 'category.name': { $regex: query.search, $options: 'i' } }
        ]
      })
    }

    if (query.categoryId) {
      matchConditions.push({
        category_id: new mongoose.Types.ObjectId(query.categoryId)
      })
    }

    if (query.productId) {
      matchConditions.push({
        _id: new mongoose.Types.ObjectId(query.productId)
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

module.exports = {
  getProductsInfo
}
