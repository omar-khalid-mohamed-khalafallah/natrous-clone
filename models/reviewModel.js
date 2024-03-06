/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const Tour = require('./toursModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review can not be empty'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user'],
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
},);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre('/^find/', function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });
});
reviewSchema.statics.calcAvgRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                average: { $avg: '$rating' },
            }
        }

    ]);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].average,
    });
};
reviewSchema.post('save', function () {
    this.constructor.calcAvgRatings(this.tour);

});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
