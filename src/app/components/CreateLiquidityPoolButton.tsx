"use client";

import React, { useState } from "react";
import Button, { SubmitButton } from "./Button";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { useDefi } from "./DefiContext";

export const CreateLiquidityPoolButton = () => {
  const { createLiquidityPool } = useDefi();

  const [showModal, setShowModal] = useState(false);
  
  const closeModal = () => setShowModal(false);

  return (
    <div className="w-full">
      <Button onClick={() => setShowModal(true)}>Create Liquidity Pool</Button>
      {showModal && (
        <Modal heading="Create Liquidity Pool" close={closeModal}>
          <form
            action={createLiquidityPool}
            className="w-full flex flex-col gap-8 p-6"
          >
            <Input
              name="assetName"
              id="assetName"
              label="Asset Name"
              placeholder="Asset Name"
              type="text"
            />
            <Input
              label="Token A  Amount (XLM)"
              placeholder="Token A  Amount (XLM)"
              type="tel"
            />
            <Input
              label="Token B Amount (Custom Asset)"
              placeholder="Token B Amount (Custom Asset)"
              type="tel"
            />

            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <SubmitButton>Create Liquidity Pool</SubmitButton>
              <Button type="reset" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
