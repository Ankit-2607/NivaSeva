import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc   Get all active services
// @route  GET /api/services
// @access Public
export const getServices = async (req, res, next) => {
  try {
    const { category, search, all } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (all !== 'true') filter.isActive = true;
      if (category && category !== 'All') filter.category = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const services = await Service.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: services.length, data: services });
    } else {
      // Memory store fallback
      let services = [...memoryStore.services];
      if (all !== 'true') {
        services = services.filter((s) => s.isActive);
      }
      if (category && category !== 'All') {
        services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        services = services.filter(
          (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );
      }
      return res.status(200).json({ success: true, count: services.length, data: services });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get single service by ID
// @route  GET /api/services/:id
// @access Public
export const getServiceById = async (req, res, next) => {
  try {
    let service;
    if (mongoose.connection.readyState === 1) {
      service = await Service.findById(req.params.id);
    } else {
      service = memoryStore.services.find((s) => s._id.toString() === req.params.id.toString());
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new service
// @route  POST /api/services
// @access Private (Admin)
export const createService = async (req, res, next) => {
  try {
    const { name, description, category, price, duration, icon, image, features } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service name, description, and price.',
      });
    }

    const featureList = Array.isArray(features)
      ? features
      : features
      ? features.split(',').map((s) => s.trim())
      : [];

    if (mongoose.connection.readyState === 1) {
      const service = await Service.create({
        name: name.trim(),
        description: description.trim(),
        category: category || 'General',
        price: Number(price),
        duration: duration || '60 mins',
        icon: icon || 'Wrench',
        image: image || '',
        features: featureList,
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: 'Service created successfully!',
        data: service,
      });
    } else {
      const newService = {
        _id: 'srv_' + Date.now(),
        name: name.trim(),
        description: description.trim(),
        category: category || 'General',
        price: Number(price),
        duration: duration || '60 mins',
        icon: icon || 'Wrench',
        image: image || '',
        features: featureList,
        isActive: true,
        createdAt: new Date(),
      };
      memoryStore.services.unshift(newService);

      return res.status(201).json({
        success: true,
        message: 'Service created successfully!',
        data: newService,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Update a service
// @route  PUT /api/services/:id
// @access Private (Admin)
export const updateService = async (req, res, next) => {
  try {
    const { name, description, category, price, duration, icon, image, features, isActive } = req.body;

    if (mongoose.connection.readyState === 1) {
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        {
          ...(name && { name: name.trim() }),
          ...(description && { description: description.trim() }),
          ...(category && { category }),
          ...(price !== undefined && { price: Number(price) }),
          ...(duration && { duration }),
          ...(icon && { icon }),
          ...(image !== undefined && { image }),
          ...(features !== undefined && {
            features: Array.isArray(features) ? features : features.split(',').map((s) => s.trim()),
          }),
          ...(isActive !== undefined && { isActive }),
        },
        { new: true, runValidators: true }
      );

      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Service updated successfully!',
        data: service,
      });
    } else {
      const idx = memoryStore.services.findIndex((s) => s._id.toString() === req.params.id.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }

      memoryStore.services[idx] = {
        ...memoryStore.services[idx],
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(category && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(duration && { duration }),
        ...(icon && { icon }),
        ...(image !== undefined && { image }),
        ...(features !== undefined && {
          features: Array.isArray(features) ? features : features.split(',').map((s) => s.trim()),
        }),
        ...(isActive !== undefined && { isActive }),
      };

      return res.status(200).json({
        success: true,
        message: 'Service updated successfully!',
        data: memoryStore.services[idx],
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a service
// @route  DELETE /api/services/:id
// @access Private (Admin)
export const deleteService = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }
    } else {
      const idx = memoryStore.services.findIndex((s) => s._id.toString() === req.params.id.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }
      memoryStore.services.splice(idx, 1);
    }

    res.status(200).json({
      success: true,
      message: 'Service removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
