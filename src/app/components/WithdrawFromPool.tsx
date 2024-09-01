"use client";

import React, { useState } from "react";
import Button, { SubmitButton } from "./Button";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { useDefi } from "./DefiContext";
import toast from "react-hot-toast";

export const WithdrawFromPool = () => {
  const { withdrawFromPool, withdrawalForm, handleWithdrawalFormChange, defi } =
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
    await withdrawFromPool(() => setShowModal(false));
  };

  return (
    <div className="w-full">
      <Button onClick={openModal}>Withdraw From Pool</Button>
      {showModal && (
        <Modal heading="Withdraw From Pool" close={closeModal}>
          <form
            action={handleFormSubmit}
            className="w-full flex flex-col gap-8 p-6"
          >
            <Input
              name="poolId"
              id="poolId"
              label="Liquidity Pool ID"
              placeholder="Liquidity Pool ID"
              type="text"
              required
              value={withdrawalForm.poolId}
              onChange={handleWithdrawalFormChange}
            />
            <Input
              name="amount"
              id="amount"
              label="Amount"
              placeholder="Amount"
              type="tel"
              required
              value={parseFloat(
                `${withdrawalForm?.amount || 0}`.replace(/,/g, "")
              ).toLocaleString()}
              onChange={handleWithdrawalFormChange}
            />

            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <SubmitButton>Withdraw</SubmitButton>
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
