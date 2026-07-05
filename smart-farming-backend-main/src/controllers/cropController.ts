import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Crop from "../models/Crop";

export const addCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, variety, plantedDate, status, landSize } = req.body;

    const newCrop = new Crop({
      user: req.user?.id, 
      name,
      variety,
      plantedDate,
      status,
      landSize
    });

    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (error) {
    res.status(500).json({ message: "Error adding crop", error });
  }
};

// export const getMyCrops = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
   
//     console.log("Fetching crops for User ID:", req.user?.id);

//     const crops = await Crop.find({ user: req.user?.id as string });
    
//     console.log("Crops found:", crops.length);
    
//     res.json(crops);
//   } catch (error) {
//     console.error("Error details:", error);
//     res.status(500).json({ message: "Error fetching crops", error });
//   }
// };
export const getMyCrops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    
    const query = req.user?.role.toLowerCase() === 'admin' ? {} : { user: req.user?.id };

    console.log("Fetching crops. Role:", req.user?.role, "User ID:", req.user?.id);


    const crops = await Crop.find(query).populate('user', 'name');
    
    res.json(crops);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Error fetching crops", error });
  }
};
// update
// UPDATE
export const updateCrop = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const filter = req.user?.role.toLowerCase() === 'admin' 
            ? { id: id } 
            : { id: id, user: req.user?.id };

        const updatedCrop = await Crop.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
        
        if (!updatedCrop) {
            res.status(404).json({ message: "Crop not found or unauthorized" });
            return;
        }
        res.json(updatedCrop);
    } catch (error) {
        res.status(500).json({ message: "Error updating crop", error });
    }
};

// DELETE
export const deleteCrop = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const filter = req.user?.role.toLowerCase() === 'admin' 
            ? { id: id } 
            : { id: id, user: req.user?.id };

        const deletedCrop = await Crop.findOneAndDelete(filter);
        
        if (!deletedCrop) {
            res.status(404).json({ message: "Crop not found or unauthorized" });
            return;
        }
        res.json({ message: "Crop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting crop", error });
    }
};