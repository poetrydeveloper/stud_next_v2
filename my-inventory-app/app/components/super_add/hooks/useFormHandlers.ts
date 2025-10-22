import { useCallback } from "react";

interface UseFormHandlersProps {
  mode: string;
  step: number;
  formData: any;
  selectedNode: any;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  onSuccess: () => void;
}

export function useFormHandlers({
  mode,
  step,
  formData,
  selectedNode,
  setStep,
  setLoading,
  setError,
  onSuccess
}: UseFormHandlersProps) {
  const validateStep = useCallback((): boolean => {
    setError("");

    if (mode === 'category' && step === 1) {
      if (!formData.categoryName.trim()) {
        setError("Введите название категории");
        return false;
      }
    }

    if (mode === 'spine' && step === 1) {
      if (!formData.spineName.trim()) {
        setError("Введите название Spine");
        return false;
      }
    }

    if (mode === 'product') {
      if (step === 1) {
        if (!formData.productName.trim()) {
          setError("Введите название товара");
          return false;
        }
        if (!formData.productCode.trim()) {
          setError("Введите код товара");
          return false;
        }
      }
      
      if (step === 2 && formData.createUnit && formData.makeCandidate) {
        if (!formData.requestQuantity || parseInt(formData.requestQuantity) <= 0) {
          setError("Введите корректное количество");
          return false;
        }
        if (!formData.requestPrice || parseFloat(formData.requestPrice) <= 0) {
          setError("Введите корректную цену");
          return false;
        }
      }
    }

    return true;
  }, [mode, step, formData, setError]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    try {
      // Базовые данные запроса
      const requestData: any = {
        unitOptions: {
          createUnit: formData.createUnit,
          makeCandidate: formData.makeCandidate,
          supplierId: formData.supplierId ? parseInt(formData.supplierId) : undefined,
          requestPricePerUnit: formData.requestPricePerUnit ? parseFloat(formData.requestPricePerUnit) : undefined
        }
      };

      // Добавляем product ТОЛЬКО для режима product
      if (mode === 'product') {
        requestData.product = {
          name: formData.productName,
          code: formData.productCode,
          description: formData.productDescription,
          brandId: formData.productBrandId ? parseInt(formData.productBrandId) : undefined
        };
      }

      // Добавляем категорию если создаем новую
      if (mode === 'category' || (mode === 'product' && selectedNode?.type !== 'spine')) {
        const categoryData: any = {
          name: mode === 'category' ? formData.categoryName : selectedNode?.name || "Новая категория"
        };
        
        // ВАЖНО: Передаем parentId для создания вложенной категории
        if (mode === 'category' && selectedNode?.type === 'category') {
          categoryData.parentId = selectedNode.id;
          console.log("🎯 Создание дочерней категории с parentId:", selectedNode.id);
        }
        
        requestData.category = categoryData;
      }

      // Добавляем spine если создаем новый
      if (mode === 'spine' || (mode === 'product' && selectedNode?.type !== 'spine')) {
        requestData.spine = {
          name: mode === 'spine' ? formData.spineName : formData.spineName || `${formData.productName} Spine`
        };
      }

      // Добавляем опции заявки если нужно (ТОЛЬКО для product)
      if (mode === 'product' && formData.createUnit && formData.makeCandidate) {
        // ФИКС: Проверяем что цена корректная
        const price = parseFloat(formData.requestPrice);
        if (isNaN(price) || price <= 0) {
          throw new Error("Введите корректную цену за единицу");
        }

        requestData.requestOptions = {
          quantity: parseInt(formData.requestQuantity),
          pricePerUnit: price
        };
      }

      console.log("📤 Отправка SUPER_ADD данных:", requestData);

      const res = await fetch('/api/super-add/create-chain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при создании");
      }

      console.log("✅ SUPER_ADD успех:", data);
      onSuccess();

    } catch (err: any) {
      console.error("❌ SUPER_ADD ошибка:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [mode, formData, selectedNode, validateStep, setLoading, setError, onSuccess]);

  const handleNext = useCallback(() => {
    if (!validateStep()) return;
    
    if (mode === 'category' || mode === 'spine') {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  }, [mode, step, validateStep, handleSubmit, setStep]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step, setStep]);

  return {
    handleSubmit,
    handleNext,
    handleBack,
    validateStep
  };
}