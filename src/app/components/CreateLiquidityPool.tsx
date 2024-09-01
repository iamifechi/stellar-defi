"use client";

import React, { useState } from "react";
import Button, { SubmitButton } from "./Button";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { useDefi } from "./DefiContext";
import toast from "react-hot-toast";

export const CreateLiquidityPool = () => {
  const { createLiquidityPool, defi, defiForm, handleDefiFormChange } =
    useDefi();
  const publicKey = defi?.keypair?.publicKey();

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const openModal = () => {
    toast.dismiss();
    try {
      if (!publicKey) {
        throw new Error("Public key is required. Try generating a keypair");
      }

      setShowModal(true);
    } catch (error: any) {
      toast.error(error?.message, {
        duration: 8000,
        className: "border border-red-400",
      });
    }
  };

  const handleFormSubmit = async () => {
    await createLiquidityPool(() => setShowModal(false));
  };

  return (
    <div className="w-full">
      <Button onClick={openModal}>Create Liquidity Pool</Button>
      {showModal && (
        <Modal heading="Create Liquidity Pool" close={closeModal}>
          <form
            action={handleFormSubmit}
            className="w-full flex flex-col gap-8 p-6"
          >
            <Input
              name="assetName"
              id="assetName"
              label="Asset Name"
              placeholder="Asset Name"
              type="text"
              required
              onChange={handleDefiFormChange}
            />
            <Input
              name="tokenAAmount"
              id="tokenAAmount"
              label="Token A  Amount (XLM)"
              placeholder="Token A  Amount (XLM)"
              type="tel"
              required
              value={parseFloat(
                `${defiForm?.tokenAAmount || 0}`.replace(/,/g, "")
              ).toLocaleString()}
              onChange={handleDefiFormChange}
            />
            <Input
              name="tokenBAmount"
              id="tokenBAmount"
              label="Token B Amount (Custom Asset)"
              placeholder="Token B Amount (Custom Asset)"
              type="tel"
              required
              value={parseFloat(
                `${defiForm?.tokenBAmount || 0}`.replace(/,/g, "")
              ).toLocaleString()}
              onChange={handleDefiFormChange}
            />

            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <SubmitButton>Create Liquidity Pool</SubmitButton>
              <Button outline type="reset" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
