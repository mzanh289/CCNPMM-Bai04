const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    url: { type: String, required: true, trim: true },
    altText: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    position: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('ProductImage', productImageSchema);
