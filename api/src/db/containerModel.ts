import mongoose from "mongoose";

export interface ContainerSchema extends mongoose.Schema {
  owner_id: string;
  id: string;
  password: string;
}

const ContainerSchema = new mongoose.Schema<ContainerSchema>({
  owner_id: {
    type: String,
    required: true,
    unique: false,
  },
  id: {
    type: String,
    required: true,
    unique: false,
  },
});

export default mongoose.models.Containers ||
  mongoose.model("Containers", ContainerSchema);
