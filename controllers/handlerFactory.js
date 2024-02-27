/* eslint-disable prettier/prettier */
const catchAsync = require('../util/catchAsync');
const APIFeatures = require('../util/apiFeatures');
const AppError = require('../util/appError');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = Model.findByIdAndDelete(req.params.id);
        if (!doc) return next(new AppError('the document is not Found', 404));
        res.status(204).json({
            message: 'Successful Delete',
            data: {
                tour: '<Deleted Tour>',
            },
        });
    });
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError('the document is not Found', 404));
        }
        res.status(200).json({
            message: 'Successful update',
            data: {
                doc,
            },
        });
    });
exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            message: 'Successful write',
            data: {
                doc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);

        const doc = await query;
        if (!doc) {
            return next(new AppError('the document is not Found', 404));
        }
        res.status(200).json({
            message: 'Successful read',
            data: {
                doc,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        //Execute Query
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId };
        const feature = new APIFeatures(Model.find(filter), req.query)
            .filtering()
            .sorting()
            .page()
            .fieldLimit();
        const doc = await feature.query.explain();
        res.status(200).json({
            message: 'Successful read',
            data: {
                doc,
            },
        });
    });
