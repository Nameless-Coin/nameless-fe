import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useForm, Resolver } from "react-hook-form";

type FormValues = {
  ticker: string;
  name: string;
  description: string;
  image: File;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values,
    errors: {
      ticker: {
        type: "manual",
        message: "Ticker is required",
      },
      name: {
        type: "manual",
        message: "Name is required",
      },
      description: {
        type: "manual",
        message: "Description is required",
      },
      image: {
        type: "manual",
        message: "Image is required",
      },
    },
  };
};

export const ChangeTickerDialog = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-gray-800 text-white rounded-md px-4 py-2">
          Change Ticker
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Ticker</DialogTitle>
          <DialogDescription>
            Change the ticker of the selected asset.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Ticker"
            {...register("ticker", { required: true })}
          />
          {errors.ticker && <p>{errors.ticker.message}</p>}
          <Input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
          />
          {errors.name && <p>{errors.name.message}</p>}
          <Input
            type="text"
            placeholder="Description"
            {...register("description", { required: true })}
          />
          {errors.description && <p>{errors.description.message}</p>}
          <Input
            type="file"
            placeholder="Image"
            // restrict file to be one, and image types
            accept="image/*"
            // restrict to one image
            multiple={false}
            {...register("image", { required: true })}
          />
          {errors.image && <p>{errors.image.message}</p>}
          <DialogFooter>
            <button
              type="submit"
              className="bg-gray-800 w-full text-white rounded-md mt-4 px-4 py-2"
            >
              Change Ticker
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
