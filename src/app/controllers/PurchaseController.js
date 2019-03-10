const Ad = require('../models/Ad')
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store(req, res) {
    const {
      ad,
      content
    } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    const approvedPurchase = await Purchase.findOne({
      status: 'A'
    })

    if (approvedPurchase) {
      return res.status(400).json({
        message: `Ad ${ ad } is already closed`
      })
    }

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({
      ad,
      user: user.id,
      content
    })

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
