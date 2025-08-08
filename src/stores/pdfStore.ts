import { create } from "zustand";
import { generateOrderPDF, PDFGenerationOptions, PDFResult } from "@/services/pdfService";
import { OrderDetail } from "@/services/ordersService";
import { showSuccessToast, showErrorToast } from "@/services/axios";

interface PDFState {
  lastGeneratedPDF: PDFResult | null;
  generateOrderPDF: (order: OrderDetail, options?: PDFGenerationOptions) => Promise<PDFResult>;
  clearLastGenerated: () => void;
}

export const usePDFStore = create<PDFState>((set, get) => ({
  lastGeneratedPDF: null,
  generateOrderPDF: async (order: OrderDetail, options?: PDFGenerationOptions) => {
    try {
      const result = await generateOrderPDF(order, options);
      set({ lastGeneratedPDF: result });
      showSuccessToast(
        'PDF gerado com sucesso!', 
        `Pedido ${order.idPedido} foi compartilhado.`
      );
      return result;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showErrorToast(
        'Erro ao gerar PDF', 
        'Não foi possível gerar o PDF do pedido.'
      );
      throw error;
    }
  },
  clearLastGenerated: () => {
    set({ lastGeneratedPDF: null });
  },
}));
