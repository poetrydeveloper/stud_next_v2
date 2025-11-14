"use client";

import { useState, useEffect } from "react";
import { useFormData } from "@/app/components/super_add/hooks/useFormData";
import { useFormHandlers } from "@/app/components/super_add/hooks/useFormHandlers";
import WizardHeader from "@/app/components/WizardHeader";
import WizardContent from "@/app/components/WizardContent";
import WizardFooter from "@/app/components/WizardFooter";

interface SuperAddWizardProps {
  mode: 'category' | 'spine' | 'product';
  selectedNode: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SuperAddWizard({ mode, selectedNode, onClose, onSuccess }: SuperAddWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    formData,
    brands,
    suppliers,
    handleInputChange,
    loadBrandsAndSuppliers
  } = useFormData(mode, selectedNode);

  const {
    handleSubmit,
    handleNext,
    handleBack,
    validateStep
  } = useFormHandlers({
    mode,
    step,
    formData,
    selectedNode,
    setStep,
    setLoading,
    setError,
    onSuccess
  });

  useEffect(() => {
    loadBrandsAndSuppliers();
  }, [loadBrandsAndSuppliers]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        
        <WizardHeader 
          mode={mode}
          step={step}
          onClose={onClose}
        />

        <WizardContent
          mode={mode}
          step={step}
          formData={formData}
          selectedNode={selectedNode}
          brands={brands}
          suppliers={suppliers}
          error={error}
          handleInputChange={handleInputChange}
        />

        <WizardFooter
          mode={mode}
          step={step}
          loading={loading}
          onBack={handleBack}
          onNext={handleNext}
          validateStep={validateStep}
        />

      </div>
    </div>
  );
}