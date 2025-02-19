import mongoose from "mongoose";

export interface ContainerSchema extends mongoose.Schema {
  owner_id: string;
  id: string;
  port: number;
  max_ram: number;
  max_cpu: number;
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
  port: {
    type: Number,
    required: true,
    unique: false,
  },
  max_ram: {
    type: Number,
    required: true,
    unique: false,
  },
  max_cpu: {
    type: Number,
    required: true,
    unique: false,
  },
});

export default mongoose.models.Containers ||
  mongoose.model("Containers", ContainerSchema);
