import BusinessFunction from '../models/business-function.model';
import { BusinessFunction as BusinessFunctionType } from '../models/business-function.model';
import dbConnect from '../mongodb';

export class BusinessFunctionService {
  private defaultFunctions = [
    "Marketing",
    "Design",
    "Engineering",
    "Finance",
    "Sales"
  ];

  async initializeDefaultFunctions(userId: string): Promise<void> {
    try {
      await dbConnect();
      const existingFunctions = await BusinessFunction.find({ userId });
      
      if (existingFunctions.length === 0) {
        const defaultFunctions = this.defaultFunctions.map(name => ({
          name,
          userId,
          isDefault: true
        }));
        
        await BusinessFunction.insertMany(defaultFunctions);
      }
    } catch (error) {
      throw new Error('Error initializing default business functions');
    }
  }

  async getAllBusinessFunctions(userId: string): Promise<BusinessFunctionType[]> {
    try {
      await dbConnect();
      await this.initializeDefaultFunctions(userId);
      const functions = await BusinessFunction.find({ userId }).lean();
      return JSON.parse(JSON.stringify(functions));
    } catch (error) {
      throw new Error('Error fetching business functions from database');
    }
  }

  async createBusinessFunction(
    name: string, 
    userId: string
  ): Promise<BusinessFunctionType> {
    try {
      await dbConnect();
      const businessFunction = new BusinessFunction({
        name,
        userId,
        isDefault: false
      });
      const savedFunction = await businessFunction.save();
      return JSON.parse(JSON.stringify(savedFunction));
    } catch (error) {
      throw new Error('Error creating business function in database');
    }
  }

  async deleteBusinessFunction(
    id: string, 
    userId: string
  ): Promise<boolean> {
    try {
      await dbConnect();
      const businessFunction = await BusinessFunction.findOne({ _id: id, userId });
      
      if (!businessFunction) {
        return false;
      }

      if (businessFunction.isDefault) {
        throw new Error('Cannot delete default business function');
      }

      const result = await BusinessFunction.findOneAndDelete({ 
        _id: id, 
        userId,
        isDefault: false
      });
      return !!result;
    } catch (error) {
      throw new Error('Error deleting business function from database');
    }
  }
}