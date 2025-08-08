import { OrderDetail, formatOrderDate } from "./ordersService";
import { useAuthStore } from "@/stores/authStore";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export interface PDFGenerationOptions {
  fileName?: string;
}

export interface PDFResult {
  filePath: string;
  base64?: string;
}

// Função para formatar preço
const formatPrice = (price: number): string => {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
};

// Função para formatar data de forma segura
const formatDateSafely = (dateString: string): string => {
  try {
    if (!dateString) {
      return "Data não informada";
    }

    // Se a data já está formatada (contém vírgula), retorna ela mesma
    if (dateString.includes(",")) {
      return dateString;
    }

    // Verificar se a data é válida
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Data não informada";
    }

    return formatOrderDate(dateString);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data não informada";
  }
};

// Obter dados da organização (usuário logado)
const getOrganizationInfo = (): {
  orgName: string;
  orgCnpj: string;
  orgTelefone?: string;
  orgEndereco?: string;
  orgCidade?: string;
  orgEstado?: string;
  orgEmail?: string;
} => {
  try {
    const state = (useAuthStore as any)?.getState?.();
    const orgName = state?.user?.nomeOrganizacao || "Empresa";
    const orgCnpj = state?.user?.cnpj || "";
    const orgTelefone = state?.user?.telefone;
    const orgEmail = state?.user?.username;
    const orgEndereco = state?.user?.endereco;
    const orgCidade = state?.user?.cidade;
    const orgEstado = state?.user?.estado;
    return {
      orgName,
      orgCnpj,
      orgTelefone,
      orgEndereco,
      orgCidade,
      orgEstado,
      orgEmail,
    };
  } catch (_e) {
    return { orgName: "Empresa", orgCnpj: "" };
  }
};

// Função para gerar HTML do pedido
const generateOrderHTML = (order: OrderDetail): string => {
  const products = order.itens.filter((item) => item.tipo === "Produto");
  const services = order.itens.filter((item) => item.tipo === "Serviço");

  const totalProducts = products.reduce(
    (sum, item) => sum + item.precoTotal,
    0
  );
  const totalServices = services.reduce(
    (sum, item) => sum + item.precoTotal,
    0
  );
  const {
    orgName,
    orgCnpj,
    orgTelefone,
    orgEndereco,
    orgCidade,
    orgEstado,
    orgEmail,
  } = getOrganizationInfo();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pedido ${order.idPedido}</title>
       <style>
        :root { --primary: #3B82F6; --accent: #059669; --border: #ddd; }
        @page { size: A4; margin: 16mm; }
        body {
          font-family: Arial, sans-serif;
          margin: 20px auto;
          max-width: 760px;
          color: #333;
          line-height: 1.6;
          font-variant-numeric: tabular-nums;
        }
        .header {
          text-align: left;
          border-bottom: 2px solid var(--primary);
          padding-bottom: 6px;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .header h1 { margin: 0 0 6px 0; }
        .header p { margin: 2px 0; }
        .order-info {
          background: transparent;
          padding: 0;
          border-radius: 0;
          margin-bottom: 6px;
          margin-left: 0;
          line-height: 1.3;
        }
        .order-info h3 { margin: 0 0 6px 0; }
        .order-info p { margin: 1px 0; }
        .customer-info {
          background: transparent;
          padding: 0;
          border-radius: 0;
          margin-bottom: 8px;
          margin-left: 0;
          line-height: 1.3;
        }
        .customer-info h3 { margin: 0 0 6px 0; }
        .customer-info p { margin: 1px 0; }
        .info-row { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 6px; }
        .info-row .order-info, .info-row .customer-info { flex: 1 1 0; margin-bottom: 0; }
        .items-section { margin-bottom: 20px; }
        .items-section h3 { margin: 0 0 4px 0; }
        .items-section.with-divider { border-top: 2px solid var(--primary); padding-top: 6px; margin-top: 6px; }
        .item { border: 0; border-bottom: 1px solid var(--border); padding: 6px 0; margin-bottom: 4px; border-radius: 0; page-break-inside: avoid; }
        .items-section .item:last-child { border-bottom: 0; margin-bottom: 0; }
        .item-header { font-weight: bold; color: var(--primary); margin-bottom: 5px; word-break: break-word; }
        .item-header .item-desc { color: #666; font-weight: normal; font-size: 12px; margin-left: 6px; display: inline-block; max-width: 60%; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; }
        .item-details { display: flex; align-items: center; gap: 12px; font-size: 12px; }
        .item-details span { white-space: nowrap; }
        .item-details span:first-child { min-width: 70px; text-align: left; }
        .item-details span:nth-child(2) { flex: 1; text-align: center; }
        .item-details span:last-child { min-width: 160px; text-align: right; margin-left: auto; }
        .total-section { background: transparent; padding: 6px 0 0 0; border-radius: 0; border-top: 2px solid var(--primary); line-height: 1.3; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .final-total { font-weight: bold; font-size: 18px; color: var(--accent); padding-top: 6px; margin-top: 6px; }
        .total-separator { border: 0; border-top: 2px solid #666; margin: 6px 0; }
        @media print { .total-separator { border-top-color: #222; border-top-width: 3px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${orgName}</h1>
        <p><strong>CNPJ:</strong> ${orgCnpj}</p>
        ${
          orgEmail || orgTelefone
            ? `<p>${orgEmail ? `<strong>Email:</strong> ${orgEmail}` : ""}${
                orgEmail && orgTelefone ? "     " : ""
              }${orgTelefone ? `<strong>Tel:</strong> ${orgTelefone}` : ""}</p>`
            : ""
        }
        ${
          orgEndereco || orgCidade || orgEstado
            ? `<p><strong>Endereço:</strong> ${orgEndereco || ""}${
                orgCidade || orgEstado
                  ? ` - ${orgCidade || ""}${orgEstado ? ` - ${orgEstado}` : ""}`
                  : ""
              }</p>`
            : ""
        }
      </div>

      <div class="info-row">
        <div class="order-info">
          <h3>Informações do Pedido</h3>
          <p><strong>Pedido:</strong> ${order.idPedido}</p>
          <p><strong>Data de Criação:</strong> ${formatDateSafely(
            order.dataCriacao
          )}</p>
          <p><strong>Situação:</strong> <span>${order.status}</span></p>
        </div>

        <div class="customer-info">
          <h3>Dados do Cliente</h3>
          <p><strong>Nome:</strong> ${order.nomeFantasiaCliente}</p>
          <p><strong>CNPJ/CPF:</strong> ${order.cnpj}</p>
          <p><strong>Cidade:</strong> ${order.cidade} - ${order.estado}</p>
        </div>
      </div>

      ${
        products.length > 0
          ? `
        <div class="items-section">
          <h3>Produtos</h3>
          ${products
            .map(
              (item) => `
            <div class="item">
              <div class="item-header">${item.nome}${
                item.descricao
                  ? ' - <span class="item-desc">' + item.descricao + "</span>"
                  : ""
              }</div>
              <div class="item-details">
                <span>Qtd: ${item.quantidade}</span>
                <span>Preço Un.: ${formatPrice(item.precoUnitario)}</span>
                <span>Total: ${formatPrice(item.precoTotal)}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        services.length > 0
          ? `
        <div class="items-section">
          <h3>Serviços</h3>
          ${services
            .map(
              (item) => `
            <div class="item">
              <div class="item-header">${item.nome}${
                item.descricao
                  ? ' - <span class="item-desc">' + item.descricao + "</span>"
                  : ""
              }</div>
              <div class="item-details">
                <span>Qtd: ${item.quantidade}</span>
                <span>Preço Un.: ${formatPrice(item.precoUnitario)}</span>
                <span>Total: ${formatPrice(item.precoTotal)}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <div class="total-section">
        <h3>Resumo</h3>
        <div class="total-row">
          <span>Subtotal Produtos:</span>
          <span>${formatPrice(totalProducts)}</span>
        </div>
        <div class="total-row">
          <span>Subtotal Serviços:</span>
          <span>${formatPrice(totalServices)}</span>
        </div>
        <hr class="total-separator" />
        <div class="total-row final-total">
          <span>Total Geral:</span>
          <span>${formatPrice(order.precoTotal)}</span>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateOrderPDF = async (
  order: OrderDetail,
  generationOptions: PDFGenerationOptions = {}
): Promise<PDFResult> => {
  try {
    const html = generateOrderHTML(order);

    // Gerar PDF usando expo-print
    const { uri } = await Print.printToFileAsync({
      html: html,
      base64: false,
    });

    // Renomear/mover para usar o fileName fornecido
    const safeFileName = (
      generationOptions.fileName || `pedido-${order.idPedido}-${Date.now()}`
    )
      .toLowerCase()
      .endsWith(".pdf")
      ? (generationOptions.fileName as string)
      : `${
          generationOptions.fileName || `pedido-${order.idPedido}-${Date.now()}`
        }.pdf`;
    const baseDir =
      FileSystem.documentDirectory || FileSystem.cacheDirectory || "";
    const targetUri = `${baseDir}${safeFileName}`;
    let finalUri = uri;
    try {
      const existing = await FileSystem.getInfoAsync(targetUri);
      if (existing.exists) {
        await FileSystem.deleteAsync(targetUri, { idempotent: true });
      }
      await FileSystem.moveAsync({ from: uri, to: targetUri });
      finalUri = targetUri;
    } catch (fsError) {
      console.warn(
        "Não foi possível mover/renomear o PDF para o destino final, usando URI temporária:",
        fsError
      );
    }

    // Verificar se o compartilhamento está disponível
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      // Compartilhar o PDF usando expo-sharing com opção de download
      await Sharing.shareAsync(finalUri, {
        mimeType: "application/pdf",
        dialogTitle: `Pedido ${order.idPedido}`,
        UTI: "com.adobe.pdf",
      });
    }

    return {
      filePath: finalUri,
      base64: undefined,
    };
  } catch (error: any) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error(
      `Não foi possível gerar o PDF: ${error?.message || "Erro desconhecido"}`
    );
  }
};
