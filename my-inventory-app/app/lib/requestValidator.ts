// app/lib/requestValidator.ts (ПОЛНЫЙ КОД)
export class RequestValidator {
  private steps: { [key: string]: boolean } = {};
  private logs: string[] = [];

  constructor(private operationId: string) {
    this.log(`🚀 Начата операция: ${operationId}`);
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
    console.log(message);
  }

  async validateStep(stepName: string, validationFn: () => Promise<boolean>, description: string) {
    this.log(`🔍 Проверка: ${description}`);
    
    try {
      const isValid = await validationFn();
      this.steps[stepName] = isValid;
      
      if (isValid) {
        this.log(`✅ ${stepName}: Успешно`);
      } else {
        this.log(`❌ ${stepName}: Провал`);
      }
      
      return isValid;
    } catch (error) {
      this.log(`💥 ${stepName}: Ошибка - ${error}`);
      this.steps[stepName] = false;
      return false;
    }
  }

  getReport() {
    const passed = Object.values(this.steps).filter(Boolean).length;
    const total = Object.keys(this.steps).length;
    
    return {
      operationId: this.operationId,
      success: passed === total,
      steps: this.steps,
      summary: `${passed}/${total} этапов пройдено`,
      logs: this.logs
    };
  }

  printFinalReport() {
    const report = this.getReport();
    console.log('\n' + '='.repeat(50));
    console.log('📊 ФИНАЛЬНЫЙ ОТЧЕТ ВАЛИДАЦИИ');
    console.log('='.repeat(50));
    
    Object.entries(report.steps).forEach(([step, success]) => {
      console.log(`${success ? '✅' : '❌'} ${step}`);
    });
    
    console.log('---');
    console.log(report.success ? '🎉 ВСЕ ЭТАПЫ УСПЕШНЫ!' : '💥 ЕСТЬ ОШИБКИ!');
    console.log(report.summary);
    console.log('='.repeat(50));
    
    return report;
  }
}