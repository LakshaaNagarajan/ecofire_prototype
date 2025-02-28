import PI from '../models/PI.model';
import { PI as PIInterface } from '../models/PI.model';
import dbConnect from '../mongodb';

export class PIService {
  async getAllPIs(userId: string): Promise<PIInterface[]> {
    try {
      await dbConnect();
      const pis = await PI.find({ userId }).lean();
      return JSON.parse(JSON.stringify(pis));
    } catch (error) {
      throw new Error('Error fetching PIs from database');
    }
  }

  async getPIById(id: string, userId: string): Promise<PIInterface | null> {
    try {
      await dbConnect();
      const pi = await PI.findOne({ _id: id, userId }).lean();
      return pi ? JSON.parse(JSON.stringify(pi)) : null;
    } catch (error) {
      throw new Error('Error fetching PI from database');
    }
  }

  async createPI(piData: Partial<PIInterface>, userId: string): Promise<PIInterface> {
    try {
      await dbConnect();
      const pi = new PI({
        ...piData,
        userId
      });
      const savedPI = await pi.save();
      return JSON.parse(JSON.stringify(savedPI));
    } catch (error) {
      throw new Error('Error creating PI in database');
    }
  }

  async updatePI(id: string, userId: string, updateData: Partial<PIInterface>): Promise<PIInterface | null> {
    try {
      await dbConnect();
      const updatedPI = await PI.findOneAndUpdate(
        { _id: id, userId },
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();
      
      return updatedPI ? JSON.parse(JSON.stringify(updatedPI)) : null;
    } catch (error) {
      throw new Error('Error updating PI in database');
    }
  }

  async deletePI(id: string, userId: string): Promise<boolean> {
    try {
      await dbConnect();
      const result = await PI.findOneAndDelete({ _id: id, userId });
      return !!result;
    } catch (error) {
      throw new Error('Error deleting PI from database');
    }
  }

  // New method for creating initial PI
  async createInitialPI(piData: Partial<PIInterface>): Promise<PIInterface> {
    try {
      await dbConnect();
      const newPI = await PI.create(piData);
      return JSON.parse(JSON.stringify(newPI));
    } catch (error) {
      throw new Error('Error creating initial PI in database');
    }
  }
}
