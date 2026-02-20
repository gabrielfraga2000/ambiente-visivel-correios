import axios from "axios";
import { BlingOrder } from "@/types/shipment";

interface BlingTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getBlingToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const response = await axios.post<BlingTokenResponse>(
      "https://www.bling.com.br/Api/v3/oauth/token",
      {
        grant_type: "client_credentials",
        client_id: process.env.BLING_CLIENT_ID,
        client_secret: process.env.BLING_CLIENT_SECRET,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = response.data.access_token;
    cachedToken = { token, expiresAt: Date.now() + (response.data.expires_in - 60) * 1000 };

    return token;
  } catch (error) {
    console.error("Erro ao autenticar com API do Bling", error);
    throw new Error("Falha na autenticação com API do Bling");
  }
}

function mapBlingOrder(data: any): BlingOrder {
  return {
    numero: String(data.numero),
    cliente: { nome: data.contato?.nome ?? "Cliente sem nome" },
    rastreamento: {
      codigo: data.transporte?.etiqueta?.codigoRastreamento ?? "",
      transportadora: data.transporte?.transportador?.nome ?? "Não informado",
      dataPostagem: data.transporte?.etiqueta?.dataPostagem ?? new Date().toISOString(),
      situacao: data.situacao?.valor ?? "PENDENTE",
      ultimaAtualizacao: data.dataAtualizacao ?? new Date().toISOString(),
    },
  };
}

export async function fetchOrdersWithTracking(): Promise<BlingOrder[]> {
  try {
    const token = await getBlingToken();
    const response = await axios.get("https://www.bling.com.br/Api/v3/pedidos/vendas", {
      params: {
        limite: 100,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pedidos = response.data?.data ?? [];

    return pedidos
      .map((item: any) => mapBlingOrder(item))
      .filter((order: BlingOrder) => order.rastreamento.codigo);
  } catch (error) {
    console.error("Erro ao buscar pedidos na API do Bling", error);
    throw new Error("Falha ao buscar pedidos com rastreio");
  }
}
