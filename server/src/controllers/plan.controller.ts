import TravelPlan from '@models/TravelPlan';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';

export const createPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, destination, startDate, endDate } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      res.status(400).json({
        error: 'Title, description, start date, and end date are required',
      });
      return;
    }

    const userId = req.user?.userId;

    const newPlan = await TravelPlan.create({
      title,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: userId,
      collaborators: [
        {
          userId: userId,
          role: 'admin',
          permissions: ['edit', 'delete', 'invite'],
          joinedAt: new Date(),
        },
      ],
    });

    res
      .status(201)
      .json({ message: 'Travel plan created successfully', plan: newPlan });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const readPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user?.userId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid plan ID' });
      return;
    }

    const plan = await TravelPlan.findOne({
      _id: id,
      $or: [{ createdBy: userId }, { 'collaborators.userId': userId }],
    }).populate('createdBy', 'name email avatar');

    if (!plan) {
      res.status(404).json({ error: 'Plan not found' });
      return;
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error('Error reading plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const readPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const plans = await TravelPlan.find({
      $or: [{ createdBy: userId }, { 'collaborators.userId': userId }],
    })
      .populate('createdBy', 'name email avater')
      .sort({ createdAt: -1 });

    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error reading plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const updates = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid plan ID' });
      return;
    }

    const plan = await TravelPlan.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { createdBy: userId },
          {
            'collaborators.userId': userId,
            'collaborators.role': { $in: ['admin', 'editor'] },
          },
        ],
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!plan) {
      res.status(404).json({ error: 'Plan not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid plan ID' });
      return;
    }

    const plan = await TravelPlan.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!plan) {
      res.status(404).json({ error: 'Plan not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
