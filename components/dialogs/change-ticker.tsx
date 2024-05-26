import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  ticker: string;
  name: string;
  description: string;
  images: File[];
};

export const ChangeTickerDialog = () => {
  const { loading } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open}>
      <DialogTrigger>
        <div
          onClick={() => setOpen(true)}
          className={cn(
            "bg-gray-800 text-white rounded-md px-4 py-2",
            loading ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          Change Ticker
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Ticker</DialogTitle>
          <DialogDescription>
            Change the ticker of the selected asset.
          </DialogDescription>
        </DialogHeader>
        <Form
          close={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

const Form = ({ close }: { close: () => void }) => {
  const { updateCoin, refetch } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { signAndExecuteTransactionBlock } = useWallet();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { ticker, name, description, images } = data;

    let image = images[0];

    if (!image) {
      toast.error("Please provide an image");
      return;
    }

    if (image.size > 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    if (!image.type.startsWith("image")) {
      toast.error("Please provide an image");
      return;
    }

    try {
      let updateCoinTx = await updateCoin(ticker, name, description, image);
      signAndExecuteTransactionBlock({
        transactionBlock: updateCoinTx,
      })
        .then(() => {
          toast.success("Ticker updated successfully");
          close();
          refetch();
        })
        .catch((e) => {
          toast.error("Failed to update ticker");
        });
    } catch (e) {
      toast.error("Failed to update ticker");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Ticker"
          {...register("ticker", { required: true })}
        />
        {errors.ticker && <p className="text-error-500">Ticker is required</p>}
        <Input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        {errors.name && <p className="text-error-500">Name is required</p>}
        <Input
          type="text"
          placeholder="Description"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-error-500">Description is required</p>
        )}
        <Input
          type="file"
          placeholder="Image"
          // restrict file to be one, and image types
          accept="image/*"
          // restrict to one image
          multiple={false}
          {...register("images", { required: true })}
        />
        {errors.images && <p className="text-error-500">Image is required</p>}
        <button
          type="submit"
          className="bg-gray-800 w-full text-white rounded-md mt-4 px-4 py-2"
        >
          Change Ticker
        </button>
      </form>
    </>
  );
};
