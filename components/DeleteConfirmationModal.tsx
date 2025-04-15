import React from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] md:w-1/3">
        <h2 className="text-lg font-semibold text-center">
          Are you sure you want to delete this category?
        </h2>
        <div className="flex justify-between gap-4 mt-4 w-full">
          <Button
            onClick={onClose}
            variant="secondary"
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            variant="destructive"
            className="cursor-pointer"
          >
            Delete
          </Button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white cursor-pointer"
        >
          <AiOutlineClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
